# MarginSight

เว็บ: https://d2y04qc334m0rd.cloudfront.net

สถานะ: **PARTIAL_WITH_EXTERNAL_BLOCKERS** เว็บและบริการ AWS ถูก deploy แล้ว ปุ่มเข้าเดโมระบบเต็มสร้างร้าน MOCK แยกต่อรอบอายุ 2 ชั่วโมง และมีตัวเลือกลองคำนวณแบบอ่านอย่างเดียว บัญชีใหม่สมัครและยืนยันอีเมลผ่าน Cognito แล้วตั้งชื่อร้านส่วนตัวว่างได้เอง ข้อมูลร้านไม่เปิดสาธารณะ

## เริ่มในเครื่อง

ใช้ Node.js 24 และ npm ติดตั้งด้วย `npm ci` แล้ว `npm run dev` เปิด http://localhost:4050 เลือกทดลองร้านจำลอง ระบบ local ใช้ข้อมูลสองร้านเพื่อทดสอบสิทธิ์ บัญชี local ใช้เข้าสู่ AWS ไม่ได้

ตรวจทั้งหมดด้วย `node scripts/verify.mjs` ตรวจการทำงาน HTTP ของ local ที่เปิดอยู่ด้วย `npm run smoke:local` โดย smoke นี้ต้องใช้ข้อมูล seed ชุดเริ่มต้น; local ที่นำเข้าไฟล์เพิ่มแล้วใช้ browser workflow หรือ test fixture แยก (ดู verification)

## เอกสาร

- [สรุปสำหรับ AWS Cloud Coaching: บริการ โมเดล และข้อมูล](docs/coaching-session-02.md) · [PDF 6 หน้า](docs/coaching/MarginSight-AWS-Coaching-2026-10-15.pdf)
- [สถานะและสิ่งที่ยังขาด](docs/status.md)
- [ผลทดสอบและขอบเขตหลักฐาน](docs/verification.md)
- [วิธีใช้](docs/usage.md)
- [นโยบายคำนวณ](docs/calculation-policy.md)
- [รูปแบบไฟล์](docs/data-contracts.md)
- [ขึ้นระบบ / ปิดการใช้งาน / rollback](docs/deployment.md)
- [งบและรายการทรัพยากร](docs/cost-log.md)
- [แผนครบระบบ](plan.md) และ [ข้อกำหนด agent](AGENT.md)

โปรแกรมใช้สูตรเดียวกันทั้งเว็บ API ผู้ช่วย และ LINE: เงินเป็นสตางค์ ค่าบริการจริงแทนประมาณการ ต้นทุนมีเวอร์ชันตามวัน และข้อมูลที่ขาดไม่ถูกเติมเป็นศูนย์ รายงาน mock-v1 เป็นรูปแบบสังเคราะห์ ยังไม่ใช่ตัวเชื่อม Shopee/Lazada/TikTok จริง

## ผลสำคัญ

43 กรณีทดสอบในเครื่องผ่าน พร้อม TypeScript, static export และ bundled Lambda ระบบ AWS ผ่าน health/การปฏิเสธผู้ไม่ล็อกอิน/ไฟล์ S3 private และการนำเข้า 1,000 แถวผ่าน SQS/Lambda รวมงานซ้ำ รายงานซ้อน และข้อมูลขัดแย้ง

OCR เรียกโมเดลจริงกับบิลสังเคราะห์หนึ่งภาพ: จำนวนและยอดตรง แต่ชื่อสินค้าและหน่วยผิด ต้องแก้และยืนยันด้วยคน ไม่ใช่หลักฐานความแม่นยำบิลร้านจริง ดูผลดิบใน `docs/evidence/aws/`

ไฟล์ส่งมอบสร้างด้วย `python scripts/package-release.py`: source ZIP มีโค้ด/lockfile/plan/AGENT/fixtures/คู่มือ และ deployment ZIP มี bundle/static web พร้อมค่า SHA-256 ใน release manifest ไม่มี credentials หรือ node_modules.

สมัครใช้งานเอง: สมัคร → ยืนยันอีเมล → ล็อกอิน → ตั้งชื่อร้าน → เพิ่มสินค้า/ต้นทุน → นำเข้าไฟล์แบบ MarginSight (`merchant-v1`, REAL พร้อมยืนยันสิทธิ์ข้อมูล). หนึ่งร้านส่วนตัวต่อบัญชี ไม่มีสินค้า/ค่าบริการจำลองถูกเติมในร้านใหม่. รายงานแพลตฟอร์มยังต้องจัดคอลัมน์ตามแบบฟอร์ม ไม่ใช่ native marketplace adapter.

ผู้ช่วยใช้pre-trained Amazon Nova Liteผ่านBedrock ไม่ได้fine-tuneหรือฝึกเพิ่มด้วยข้อมูลร้าน. Trainingpipeline/SageMakerไม่ได้ถูกสร้างในระบบนี้.

ก่อนอัปโหลด GitHub: ดู [ผลตรวจ secrets และไฟล์ที่กันออก](docs/github-safety.md). เอกสารต้นฉบับและหลักฐาน AWS เก็บไว้ในเครื่องตาม .gitignore.


ปุ่ม **เข้าเดโมระบบเต็ม** เปิดร้าน MOCK แยกสำหรับรอบทดลอง โดยไม่ต้องสมัครหรือกรอกรหัสผ่าน (session2ชั่วโมง). ใช้เมนูหลักและbackendเดียวกับระบบร้าน; LINEยังต้องมีChannel. ข้อมูลร้านจริงใช้Cognitoตามเดิม. ดูขอบเขต/สถานะ deploy ใน docs/status.md.
