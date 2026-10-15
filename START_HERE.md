> สถานะ15ต.ค.2026: มีapplicationและAWSdeploymentแล้ว ดู README.md และ docs/status.md สำหรับผลปัจจุบัน เนื้อหาpackเอกสารเดิมด้านล่างเป็นประวัติตอนจัดทำ

# เริ่มงานกับ AI coding agent

แพ็กเกจฉบับ 4 เตรียมสำหรับสร้าง MarginSight ครบระบบ ไม่มี application ที่ deploy แล้วแนบมา

## ข้อความสำหรับใช้เริ่มงาน

อ่าน AGENTS.md, AGENT.md และ plan.md แล้วลงมือสร้าง MarginSight ครบ P0/P1 ตามแผน
ทำ source, fixtures, tests, หน้าเว็บ, API, database, import CSV/XLSX, margin/TTR,
fee rules/enrollment/reconciliation/export, AI assistant, OCR draft/confirm และ LINE
พร้อม SAM/deployment scripts และเอกสารใช้งาน อย่าหยุดแค่โครงโปรเจกต์หรือ mock UI

ให้ดำเนินการ deploy ในบัญชี AWS ของทีมที่ฉันยืนยัน ภายใน Region/งบคงเหลือที่ระบุ
ตรวจ account, permissions, cost และ change set ก่อน execute ใช้สิทธิ์ที่ฉันอนุญาต
อย่าลบบัญชี/ข้อมูลหรือทรัพยากรอื่นโดยไม่มีคำสั่ง หากยังไม่มี config ให้ถามเฉพาะ
ข้อมูลที่ขาดและทำงานส่วนที่ไม่พึ่งข้อมูลนั้นต่อ ห้ามขอรหัสผ่านหรือสร้างหลักฐาน PASS
โดยไม่ได้ทดสอบ แจ้งสถานะและข้อจำกัดตาม plan.md

## ข้อมูลที่ผู้ใช้ต้องระบุเมื่อจะ deploy

- AWS team account ID/SSO profile ที่ยืนยันแล้ว และ Region ที่อนุญาต
- ยอดเครดิตใช้จริง/คงเหลือและเพดานทดลองที่ยอมรับ
- วิธีเข้าถึง LINE channel configuration ผ่าน secret store เพื่อทดสอบ live
- รายงานร้านที่ได้รับอนุญาต หากต้องการพิสูจน์ข้อมูลจริง; ถ้ายังไม่มีใช้ MOCK แบบติดป้าย

ส่งข้อมูลลับผ่านช่องทางจัดเก็บที่เหมาะสม ไม่แปะ access key/password/LINE secret ในแชต
เมื่อไม่มีข้อมูลภายนอกบางส่วน agent ยังต้องทำโค้ด/ทดสอบ local ให้ครบและบอก live checks ที่ขาด
