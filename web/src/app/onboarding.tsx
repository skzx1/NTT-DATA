'use client';
import {useState} from 'react';
import {logout} from '../lib/auth';
export default function Onboarding({create,busy,error,back}:{create:(name:string)=>Promise<void>;busy:boolean;error:string;back?:()=>void}){
 const [name,setName]=useState('');
 return <main className="login"><div className="brand"><span className="logo">M</span>MarginSight</div><form className="login-card" onSubmit={e=>{e.preventDefault();void create(name)}}><span className="eyebrow">เริ่มใช้ร้านของคุณ</span><h1>สร้างร้าน แล้วเริ่มบันทึกข้อมูล</h1><p>ร้านใหม่เป็นพื้นที่ส่วนตัวของบัญชีคุณ เริ่มจากข้อมูลว่าง แล้วเพิ่มสินค้า ต้นทุน และรายงานของร้านได้ทันที</p><label>ชื่อร้าน<input value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={80} required placeholder="เช่น ร้านกระเป๋าของฉัน" autoComplete="organization"/></label><button disabled={busy||name.trim().length<2} type="submit">{busy?'กำลังสร้างร้าน…':'สร้างร้านของฉัน'}</button>{error&&<p role="alert" className="notice">{error}</p>}<small>หนึ่งร้านส่วนตัวต่อบัญชี · รายงานและภาพบิลเข้าถึงได้เฉพาะผู้มีสิทธิ์ร้าน · ยังต้องตรวจความครบถ้วนของต้นทุนและรายการเงินหักก่อนใช้กำไร</small>{back&&<button type="button" className="secondary" onClick={back}>กลับร้านที่มีอยู่</button>}<button type="button" className="secondary" onClick={logout}>ออกจากระบบ</button></form></main>
}
