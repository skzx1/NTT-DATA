# ประเมินก่อน deploy — 14 October 2026

Target: 109991964227 / ap-southeast-1. AI inference เฉพาะ us-east-1 ได้รับอนุญาตจากผู้ใช้. ไม่ใช้ cross-region inference profile, Marketplace, GPU, NAT, EC2, RDS, provisioned capacity.

Workload สำหรับต้นแบบต่อเดือน: ผู้ใช้ 5 คน, 10,000 API requests, 1,000 ออเดอร์, 20,000 writes และ 100,000 reads (รวม retries/snapshots), storage ไม่เกิน 1 GB, web transfer 1 GB, logs 100 MB, AI ไม่เกิน 30 calls/ร้าน/วัน × 2 ร้าน. Tokens ประมาณ 6,000 input/500 output ต่อ call รวม OCR; ภาพจริงอาจใช้ต่างจากนี้.

ประมาณแบบไม่พึ่ง Free Tier/เครดิต: ค่า core อยู่ระดับ $1–5 ต่อเดือนสำหรับ workload นี้; ตั้งเงินเผื่อทดลอง $25 จากเครดิตรวมทีม $350. เป็น planning allowance ไม่ใช่ใบเสนอราคาจาก AWS Calculator และไม่ใช่ hard billing cap. ไม่รวม traffic abuse, ข้อมูลโตเกินสมมติฐาน, retry ผิดปกติ, VAT/exchange rate. ต้องตรวจ actual spend หลัง deploy.

| ส่วน | วิธีประหยัด / สมมติฐาน |
|---|---|
| Lambda | arm64 512 MB, 20/28/60s timeout, ไม่มี provisioned concurrency; 10,000 × 0.5s ≈ 2,500 GB-s บวก workers |
| HTTP API | 10,000 requests; เริ่ม throttle 5/s burst 10 |
| DynamoDB | on-demand 4 tables, GSI 1, Query ไม่มี Scan, ข้อมูลต้นแบบไม่เกิน 1 GB |
| S3/CloudFront | private buckets/OAC, assets cache, upload expire 30 วัน, prototype traffic 1 GB |
| SQS | batch 1, worker max concurrency 2, DLQ after 5 deliveries; รวม idle polling ในเงินเผื่อ |
| Bedrock | Nova Lite direct us-east-1, 30 calls/store/day, output 500 tokens, overall assistant deadline 20s |
| Cognito/logs | ผู้ใช้ 5 คน, log retention 7 วัน ไม่บันทึก JWT/ภาพ/ข้อมูลลูกค้า |

Budget ที่ตรวจในบัญชีจริง: `Hackathon-Team10`, limit $350, ANNUALLY, ActualSpend $0.0, LastUpdatedTime 2026-10-14T10:47:06Z. นี่เป็น spend ล่าสุดที่บริการรายงาน ไม่ยืนยันยอดเรียลไทม์. หน้า Credits $0 ไม่ใช้แทน budget ของผู้จัด.

Lambda account quota = 10 concurrent/unreserved. Reserved concurrency จะผิดเงื่อนไข minimum unreserved 100 จึงไม่ขอเพิ่ม quota ไม่สร้าง reservation; ใช้ SQS max 2 และ shared account quota แทน.

แหล่งตรวจราคาและคำนวณใหม่เมื่อ workload เปลี่ยน:
- [AWS Pricing Calculator](https://calculator.aws/)
- [Lambda pricing](https://aws.amazon.com/lambda/pricing/)
- [HTTP API pricing](https://aws.amazon.com/api-gateway/pricing/)
- [DynamoDB pricing](https://aws.amazon.com/dynamodb/pricing/)
- [Bedrock pricing](https://aws.amazon.com/bedrock/pricing/)

Operator stop: set AIEnabled=false, disable queue event source mappings, set API throttling lower or Lambda concurrency 0 to stop processing after reviewing pending jobs. Retained S3/DynamoDB still have storage cost; list inventory before cleanup. Budget alerts do not guarantee hard spending cap.
