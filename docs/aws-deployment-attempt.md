# Actual AWS deployment history

14 October2026 / account109991964227 / ap-southeast-1 / user-approved directAIus-east-1

1. SAM1.166.2 lint/template valid; change set samcli-deploy1791986629สร้างแล้วผู้ใช้ยืนยันให้executeรวม7scopedIAMroles
2. marginsight-demo ROLLBACK_COMPLETE เพราะSSOChallengerAccessไม่มีiam:GetRolePolicyที่CF IAM::Role read/GetAttต้องใช้ บันทึกข้อผิดพลาด ไม่ขยายSSO/org/Marketplace
3. Allowedtwo-phasealternative: stackmarginsight foundationไม่มีIAMrole/function แล้วCreateRole/PutRolePolicy7rolesโดยphysicalresourceARNที่อนุญาต SAMfulltemplateอ้างroleARNตรง สำเร็จ UPDATE_COMPLETE; LambdaNode24arm64Active/Successful7functions
4. PublishprivateS3webผ่านCloudFrontOAC และnonsecretconfig.json; health200/no-tokenAPI401/directS3private403
5. RealSQS/Lambdaimport1000rowsพร้อมduplicatedelivery/overlap/conflictผ่าน OCRpipeline1ภาพMOCKอ่านquantity/amountตรงแต่name/unitผิด ไม่อ้างaccuracyร้านจริง
6. AWSserviceassistantพบempty-prefixDynamoDBqueryvalidationและThaifallbackไม่รู้จักคำว่าลดราคา แก้ทั้งสองและทดสอบซ้ำ ผลสุดท้ายดูverification.md

Retained4tables/2bucketsfromoldstack inventoriedในevidence/aws/aws-deployment-evidence.json ไม่มีการลบถาวร งบอ่านได้350USD/actual0แต่timestampbillingเก่า ต้องติดตามค่าใช้จ่ายจริง

เว็บ https://d2y04qc334m0rd.cloudfront.net API https://g57xlkfk6c.execute-api.ap-southeast-1.amazonaws.com

PARTIAL_WITH_EXTERNAL_BLOCKERS: positiveCognito/storebrowserworkflow, LINEliveและREALmerchantadapterยังต้องข้อมูลจากเจ้าของ
