import {createContext,useContext,useState} from 'react';
import {X,CheckCircle2,Send,Loader2} from 'lucide-react';
import {apiSend} from '../lib/api';
const Ctx=createContext<any>({openEnquiry:()=>{}});
export const useEnquiry=()=>useContext(Ctx);
export function EnquiryProvider({children}:{children:any}){
 const[target,setTarget]=useState<any>(null);
 const[f,setF]=useState({customer_name:'',mobile:'',email:'',message:'',preferred_date:'',enquiry_type:'general'});
 const[err,setErr]=useState('');const[busy,setBusy]=useState(false);const[done,setDone]=useState(false);
 const openEnquiry=(t:any)=>{setTarget(t);setDone(false);setErr('');setF({customer_name:'',mobile:'',email:'',message:t?.defaultMessage||'',preferred_date:'',enquiry_type:t?.enquiry_type||'general'});};
 const submit=async(e:any)=>{e.preventDefault();setErr('');
  if(!f.customer_name.trim())return setErr('Please enter your name');
  if(f.mobile.replace(/\D/g,'').length<10)return setErr('Please enter a valid 10-digit mobile number');
  if(!f.message.trim())return setErr('Please write a short message');
  setBusy(true);
  try{await apiSend('/api/enquiries','POST',{...f,business_id:target?.business?.id||target?.business_id||null,business_name:target?.business?.name||target?.business_name||'SAMANVAYA',item_name:target?.item?.name||target?.item_name||null,item_type:target?.item_type||(target?.item?(target.type||'product'):'business'),item_id:target?.item?.id||null});setDone(true);}catch(x:any){setErr(x.message);}finally{setBusy(false);}};
 return(<Ctx.Provider value={{openEnquiry}}>{children}
 {target!==null&&(target!==undefined)&&(<div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center" role="dialog">
  <button aria-label="Close" className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" style={{background:'rgba(6,22,49,.62)'}} onClick={()=>setTarget(null)}/>
  <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl fade-up">
   <div className="sticky top-0 bg-white px-6 pt-5 pb-3 flex items-start justify-between border-b border-slate-100 z-10">
    <div><h3 className="font-extrabold text-lg" style={{color:'#0B1F4B'}}>{done?'Enquiry sent!':'Send an enquiry'}</h3><p className="text-sm text-slate-500">To <b>{target?.business?.name||target?.business_name||'SAMANVAYA'}</b>{target?.item?.name?` · ${target.item.name}`:''}</p></div>
    <button onClick={()=>setTarget(null)} className="p-2 rounded-full hover:bg-slate-100"><X size={20}/></button></div>
   {done?(<div className="p-8 text-center"><CheckCircle2 size={56} className="mx-auto" style={{color:'#0E9F8C'}}/><h4 className="font-bold text-lg mt-4" style={{color:'#0B1F4B'}}>Thank you, {f.customer_name.split(' ')[0]}!</h4><p className="text-slate-500 text-sm mt-2 leading-relaxed">Your enquiry has been saved and shared with the business. They will contact you on <b>{f.mobile}</b> shortly. No login was needed.</p><button className="btn-primary w-full mt-6" onClick={()=>setTarget(null)}>Done</button></div>):(
   <form onSubmit={submit} className="p-6 space-y-4">
    <div className="grid grid-cols-3 gap-2">{[['general','General'],['quotation','Quotation'],['booking','Booking']].map(([v,l])=>(<button type="button" key={v} onClick={()=>setF({...f,enquiry_type:v})} className={`py-2.5 rounded-xl text-sm font-bold border ${f.enquiry_type===v?'text-white border-transparent':'border-slate-200 text-slate-600'}`} style={f.enquiry_type===v?{background:'#0E9F8C'}:{}}>{l}</button>))}</div>
    <div><label className="label">Your name *</label><input className="input" placeholder="e.g. Priya Sharma" value={f.customer_name} onChange={e=>setF({...f,customer_name:e.target.value})}/></div>
    <div className="grid sm:grid-cols-2 gap-4"><div><label className="label">Mobile number *</label><input className="input" inputMode="tel" placeholder="10-digit mobile" value={f.mobile} onChange={e=>setF({...f,mobile:e.target.value})}/></div><div><label className="label">Email (optional)</label><input className="input" type="email" placeholder="you@email.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></div></div>
    {(target?.item?.name)&&<div><label className="label">Product / Service</label><input className="input bg-slate-50" value={target.item.name} readOnly/></div>}
    <div><label className="label">Preferred date (optional)</label><input className="input" type="date" value={f.preferred_date} onChange={e=>setF({...f,preferred_date:e.target.value})}/></div>
    <div><label className="label">Message *</label><textarea className="input" rows={4} placeholder="Hi, I am interested in… Please share details & pricing." value={f.message} onChange={e=>setF({...f,message:e.target.value})}/></div>
    {err&&<p className="text-sm bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3 font-medium">{err}</p>}
    <button disabled={busy} className="btn-teal w-full">{busy?<Loader2 className="animate-spin" size={18}/>:<Send size={18}/>} {busy?'Sending…':'Send enquiry'}</button>
    <p className="text-[11px] text-slate-400 text-center">By sending, you agree to be contacted by the business on call/WhatsApp.</p>
   </form>)}
  </div></div>)}
 </Ctx.Provider>);}
