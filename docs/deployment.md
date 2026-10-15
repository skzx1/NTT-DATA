# Deployment runbook

บัญชี109991964227 / ap-southeast-1 / stack marginsight. Bedrock direct us-east-1ตามผู้ใช้อนุญาต อนุญาต regional resourcesเฉพาะus-east-1, ap-southeast-1, ap-southeast-7. CloudFront globalได้รับอนุญาตในsession ไม่เปลี่ยนองค์กร/Marketplace/SSO

## Build และ deploy ซ้ำ

ใช้Node24/npm ci แล้ว node scripts/verify.mjs ก่อนdeploy เตรียมpayloadด้วยnode scripts/package-deploy.mjs; packageไม่มีcredentials/node_modules/source maps อัปโหลดในCloudShellของบัญชีทีม ไม่สร้าง permanent access keys

การdeployปกติใช้ template-external-roles.yaml กับstackmarginsightและ7rolesที่มีอยู่แล้ว ไม่deployfoundationทับfullstack

```sh
aws sts get-caller-identity --query Account --output text
sam validate --lint --region ap-southeast-1 --template-file template-external-roles.yaml
sam deploy --template-file template-external-roles.yaml --stack-name marginsight --region ap-southeast-1 --resolve-s3 --parameter-overrides AIEnabled=true AIRegion=us-east-1 --tags Project=MarginSight Environment=dev Owner=Team10 --no-confirm-changeset --no-fail-on-empty-changeset
bash scripts/cloud-publish.sh
python3 scripts/cloud-inventory.py
```

ค่าAccountต้องตรง109991964227 ตรวจchange setเมื่อมีreplacement/newpermission ไม่ยอมรับdata-lossโดยอัตโนมัติ ไม่ถามอนุญาตเดิมซ้ำ; สิทธิ์/ความเสี่ยงใหม่ต้องทบทวน

สำหรับเริ่มในบัญชีที่ได้รับอนุญาตแต่ยังไม่มีstack: cloud-foundation.sh -> cloud-roles.py -> full external-roles deploy. Foundationscriptจะหยุดเมื่อstackมีอยู่แล้ว Rolesใช้CreateRole/PutRolePolicyและGetRoleเฉพาะเมื่อroleมีอยู่ ตรวจtrustเป็นLambdaและARNตรง ไม่อ่านGetRolePolicyที่ถูกปฏิเสธ ไม่เปลี่ยนSSO

Scopedrolesสร้างแยกจากCF จึงไม่ถูกลบอัตโนมัติเมื่อteardownstack คู่มือเดิมcloud-deploy.sh/template.yamlสร้างIAMในCF เคยล้มเหลวเพราะChallengerAccessไม่มีGetRolePolicy จึงไม่ใช้เส้นทางนั้นในบัญชีนี้

CloudShellใช้Linux: ไฟล์.shต้องLF ถ้าได้CRLFให้ปรับบรรทัดก่อนรัน ไม่ใช้การข้ามTLS/permissionsเพื่อแก้ปัญหา

## เปิดสิทธิ์ร้าน

ผู้ใช้สมัครCognitoผ่านเว็บและตั้งรหัสผ่านเอง Agentไม่ตั้งหรือรับรหัสผ่าน หลังยืนยันอีเมล/ล็อกอิน ผู้ใช้ตั้งชื่อร้านผ่าน POST /me/store ได้เอง. APIสร้างPROFILE+OWNERmembershipแบบtransaction หนึ่งprivatepersonalstoreต่อsubject เริ่มจากข้อมูลว่าง. การผูกlegacyMOCKdemoยังทำเฉพาะเมื่อได้รับคำขอ โดยผู้ดูแลอ่านverifiedCognitoSubแล้วinvokeSeedผ่านIAM; Seedไม่มีHTTProute. ต้องมีผู้ใช้ที่สองเพื่อทดสอบtenantบนAWS ไม่ใช้UUIDปลอม/IDtokenแทนaccess token

publicpreviewเป็นMOCKแบบอ่านอย่างเดียวคำนวณในbrowser ไม่ใช่publicAPIเข้าถึงร้านจริง

## LINE

เจ้าของchannelเก็บJSON channelSecret/channelAccessTokenในSecretsManagerโดยไม่ใส่secretลงแชท/repo ตั้งLineSecretArnและให้webhook/workerอ่านเฉพาะsecretARNนั้น บทบาทปัจจุบันยังไม่มีGetSecretValueจนมีsecretที่ยืนยันแล้ว ตั้งendpoint /line/webhook ทดสอบHMAC/linkหมดอายุ/ส่งซ้ำ/live replyและแยกaccountก่อนอ้างFULL_SCOPE

## การตรวจและหยุดงาน

cloud-inventory.pyตรวจstack/functions/privateS3/no-tokenAPI/Budgetและretainedresources. cloud-import-smoke.pyเขียนข้อมูลMOCKทดสอบ1000rowsผ่านคิวจริง. cloud-receipt-smoke.pyใช้ภาพสังเคราะห์และเกิดค่าmodelcalls. cloud-assistant-smoke.mjsใช้operator-only testcopyของbundle ไม่deployadditionalexportsเข้าLambda/publicAPI. เก็บผลJSONในdocs/evidence/aws แยกจากbrowserCognitoE2E

Kill switch: updateAIEnabled=falseด้วยfulltemplateเดิม และpauseเฉพาะeventsourceUUIDของmarginsight-importworker/ocrworker/lineworkerที่ตรวจจากAWSก่อนใช้คำสั่ง update-event-source-mapping --no-enabled. ไม่แก้account-wideconcurrency/ทีมอื่น ไม่purgequeue/data การpauseไม่หยุดstoragecost

Rollback: ใช้verifiedlast-goodartifact/config/stackparameters ตรวจreplacementและสำรองข้อมูลก่อน รักษาDynamo/S3Retain และinventory ไม่มีคำสั่งลบอัตโนมัติ IAMrolesแยกต้องcleanupแยกเมื่อได้รับอนุญาต

Budget350USDรวมทั้งทีม เป้าหมายtrial25USD billingล่าช้า/appcapsไม่ใช่hardcap ดูcost-log.md รวมresourcesจากfailedstackด้วย

LINE queue eventmappingตั้งEnabled=falseเมื่อLineSecretArnว่างผ่านHasLineSecret condition เพื่อไม่pollคิวที่ยังไม่ใช้ ตั้งsecret+เฉพาะIAMARNก่อนenableในการdeployครั้งถัดไป ไม่เรียกmodelprofileข้ามRegion

Batchperformance: financialAPIใช้งานDBพร้อมกันไม่เกิน8รายการภายในrequest และโหลดcatalog/jobstatusซ้ำเพียงครั้งเดียว ใช้latest50rowsในdashboardแต่ยอดรวมครอบคลุมmonthrangeไม่เกิน1000orders; เกินlimitแจ้งข้อผิดพลาด ไม่แสดงยอดบางส่วนเป็นทั้งร้าน

สร้างไฟล์ส่งมอบทั้ง source/deploy พร้อม SHA-256 ด้วย `python scripts/package-release.py`. ใช้ไฟล์ `MarginSight-deploy-2026-10-15.zip` รุ่นส่งมอบที่ตรวจ manifest ก่อนอัปโหลด ไม่เลือก ZIPเก่าตามชื่อ latest โดยไม่มี hash. Bundlesและstatic exportมีแล้ว; ห้ามนำไฟล์ source ไปชี้ CodeUriแทนbundleโดยไม่build.

Auth regression gate: `python3 scripts/cloud-auth-diagnose.py --verify` ต้องผ่านGET/POSTpreflight204, foreignOriginไม่มีACAO, protectedGET401. OPTIONS routeไม่ใช้authorizerและhandlerตอบempty204ก่อนอ่านข้อมูล; CORSยังexactweborigin ไม่มีwildcard. ผูกร้านผู้ใช้ที่ระบุด้วย `cloud-link-verified-demo.py --email <user-provided-email>` เฉพาะบัญชีที่ยืนยันแล้วและstoreDEMO-001 ห้ามเลือกuserคนแรก/ปลอมsub/แก้password. scriptใช้outputsจากstackเต็ม ไม่ใช้foundationที่ไม่มีSeedFunction.
