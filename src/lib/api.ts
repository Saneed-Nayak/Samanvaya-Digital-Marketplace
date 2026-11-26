export type Biz=Record<string,any>;
export const CITIES=['Mumbai','Delhi','Bengaluru','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad','Jaipur','Lucknow','Indore','Kochi','Coimbatore','Nagpur','Surat','Bhubaneswar','Patna','Chandigarh','Udaipur','Mysuru'];
export const STATES=['Maharashtra','Delhi','Karnataka','Telangana','Tamil Nadu','West Bengal','Gujarat','Rajasthan','Uttar Pradesh','Madhya Pradesh','Kerala','Punjab','Odisha','Bihar','Haryana','Andhra Pradesh'];
export async function apiGet(path:string){const r=await fetch(path);if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error||'Failed to load');}return r.json();}
export async function apiSend(path:string,method:string,body:any){const r=await fetch(path,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Request failed');return d;}
export const inr=(n:any)=>n==null||n===''?'Price on enquiry':'₹'+Number(n).toLocaleString('en-IN');
export const slugify=(s='')=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const initials=(s='')=>String(s).split(' ').slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'S';
export const FALLBACK='https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80';
export const dateIN=(d:any)=>d?new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}):'';
export const ADMIN_EMAIL='admin@samanvaya.in';
export async function uploadFile(file:File):Promise<string>{return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=async()=>{try{const base64=String(reader.result).split(',')[1];const d=await apiSend('/api/upload','POST',{fileName:file.name,fileBase64:base64,contentType:file.type});resolve(d.url);}catch(e){reject(e);}};reader.onerror=reject;reader.readAsDataURL(file);});}
