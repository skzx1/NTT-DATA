# Validation plan

ไม่มี interview, ROI หรือ willingness-to-pay ที่ยืนยันใน implementation นี้. แยกการทดสอบ synthetic transactions ออกจาก merchant pilot.

ขอ authorized order/finance/cost samples โดยลบ customer identifiers; ตรวจ column meaning, seller receivable vs payout, campaign enrollment, actual fee IDs, tax/VAT, rounding. ทำ adapter version และ expected ledger อย่างอิสระก่อนเปิด REAL.

ทดสอบว่าแม่ค้านำเข้ารายงาน 1,000 แถวและเติมต้นทุนสินค้า 100 รายการด้วย CSV/bill mapping ได้เร็วเท่าใด วัด missing-cost coverage, duplicate/conflict comprehension, error-correction success และการอธิบายตัวเลขกลับได้. ไม่ใช้ forecast profit เป็น adoption evidence.

OCR: Thai supplier billsหลายรูปแบบที่ผู้ใช้อนุญาต, clean/blur/unit-pack/discount/total mismatch. วัด field accuracy และ manual correction time; ไม่มี sample จริงจึงไม่ประกาศ accuracy. Assistant eval: Thai slang, ambiguous SKU, missing cost, price/discount, misleading document instructions, tool timeout, wrong-number fallback. LINEต้องlive linked replyจึงผ่านexternalgate.
