# MarginSight — แยก Frontend / Backend

15 October 2026

| Repository | Local checkout | เจ้าของงาน |
|---|---|---|
| https://github.com/skzx1/MarginSight-Frontend | `repositories/MarginSight-Frontend` | Next.js static web, assets, preview snapshot, S3 publish/Cognito appearance |
| https://github.com/skzx1/MarginSight-Backend | `repositories/MarginSight-Backend` | API, canonical domain, import/OCR/AI/LINE/workers/storage และ SAM stack ทั้งชุด |

ทั้งสอง repo มี package.json/lockfile/CI/README/AGENT/AGENTS/plan และ AWS-HANDOFF.md แยกกัน ไม่ต้องมี sibling source ตอน build. ติดตั้งด้วย npm ci และตรวจด้วย npm run verify ในแต่ละ repo. Node.js24.

สูตร preview มาจาก export ของ Backend พร้อม generated JS/types และ SHA-256 manifest; Frontend เก็บ snapshot ที่ตรวจได้ ไม่เขียนสูตรซ้ำและไม่ import backend/src ข้าม repo. ถ้าแก้สูตรต้อง export/sync/commit ทั้งคู่ ผลร้านจริงยังใช้ Backend API.

Backend เป็นเจ้าของ stack `marginsight` เดิม รวม web bucket/CloudFront/Cognito; Frontend publish ไฟล์จาก stack outputs. ไม่ย้าย ownership resources ไม่สร้าง stack/roles ใหม่ ไม่เปลี่ยน AWS หรือข้อมูลร้านในรอบแยก source.

NTT-DATA ยังเก็บประวัติเดิม ไม่ลบ source/force-push; สอง repo เริ่ม history ใหม่จาก snapshot9d6f2b2 ตาม SOURCE.md. Local child checkouts ถูก .gitignore กันออกจาก repo เดิม และไม่ได้ copy credentials/.local/output/tmp/merchant files/private evidence ไป repo ใหม่.

VERIFIED_LOCAL: Backend43tests/TypeScript/bundled4handlers/template structure/package; Frontend5golden/artifact tests/TypeScript/secret policy/Nextstaticexport/package. npm ci ติดตั้งคนละชุดจาก lockfile ที่ตัดอีก workspace ออกแล้ว. Secret heuristic ไม่พบ candidatesทั้งสองrepo (ไม่ใช่การรับประกันว่า scanner ครอบคลุมทุกชนิด). ตรวจ staged boundaries/source เดิมและ IaC semantics ตรงต้นทาง. ไม่มี SAM/live AWS deployment test ของรอบนี้.

คู่มือสำหรับเพื่อนและ AI อยู่ [AWS-HANDOFF.md](../AWS-HANDOFF.md) ทั้ง repo เดิมและสอง repo ใหม่. โครงการยัง PARTIAL_WITH_EXTERNAL_BLOCKERS ตาม LINE/nativeplatform/realOCR/two-user full workflow เดิม.
