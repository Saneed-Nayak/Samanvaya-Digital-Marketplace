import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {Loader2,ShieldCheck,Store} from 'lucide-react';
import supabase from '../lib/supabase';
import {signInWithGoogle} from '../lib/googleAuth';
import {Logo} from '../components/ui';
import {ADMIN_EMAIL} from '../lib/api';
export function AuthPage({mode='login',admin=false}:{mode?:string;admin?:boolean}){const nav=useNavigate();const isSignup=mode==='signup';const[email,setEmail]=useState('');const[pw,setPw]=useState('');const[err,setErr]=useState('');const[msg,setMsg]=useState('');const[busy,setBusy]=useState(false);
 const submit=async(e:any)=>{e.preventDefault();setErr('');setMsg('');if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return setErr('Please enter a valid email');if(pw.length<6)return setErr('Password must be at least 6 characters');setBusy(true);try{
 if(isSignup){const{data,error}=await supabase.auth.signUp({email,password:pw});if(error)throw error;if(data.session){nav('/dashboard');}else setMsg('Account created! If email confirmation is on, please verify, then login.');}
 else{const{data,error}=await supabase.auth.signInWithPassword({email,password:pw});if(error)throw error;const em=data.user?.email;if(admin&&em!==ADMIN_EMAIL){await supabase.auth.signOut();throw new Error('This account does not have admin access.');}nav(admin||em===ADMIN_EMAIL?'/admin':'/dashboard');}
 }catch(x:any){setErr(x.message);}finally{setBusy(false);}};
 const demo=async(which:string)=>{setEmail(which==='admin'?ADMIN_EMAIL:'owner@samanvaya.in');setPw('password123');setMsg('Demo credentials filled — tap Login.');};
 return(<main className="min-h-[82vh] flex items-center justify-center px-4 py-12" style={{background:'#F8FAFC'}}><div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-2xl p-7 sm:p-9">
 <div className="flex justify-center"><Logo/></div>
 <h1 className="text-center text-2xl font-extrabold mt-6" style={{color:'#0B1F4B'}}>{admin?'Admin Login':isSignup?'Create owner account':'Business Owner Login'}</h1>
 <p className="text-center text-sm text-slate-500 mt-1.5">{admin?'Restricted access — SAMANVAYA operations team only.':isSignup?'Use the same email you registered your business with.':'Manage your business, products & enquiries.'}</p>
 <form onSubmit={submit} className="space-y-4 mt-6"><div><label className="label">Email</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@business.in" autoComplete="email"/></div><div><label className="label">Password</label><input className="input" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" autoComplete={isSignup?'new-password':'current-password'}/></div>
 {err&&<p className="text-sm bg-red-50 text-red-700 border border-red-100 rounded-xl px-4 py-3 font-medium">{err}</p>}{msg&&<p className="text-sm bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl px-4 py-3 font-medium">{msg}</p>}
 <button disabled={busy} className="btn-primary w-full !py-3">{busy?<Loader2 className="animate-spin" size={18}/>:admin?<ShieldCheck size={18}/>:<Store size={18}/>}{isSignup?'Create account':'Login'}</button></form>
 {!admin&&(<><div className="flex items-center gap-3 my-5"><span className="flex-1 h-px bg-slate-100"/><span className="text-xs text-slate-400 font-bold">OR</span><span className="flex-1 h-px bg-slate-100"/></div><button onClick={()=>signInWithGoogle('SAMANVAYA')} className="btn-ghost w-full"><span className="font-extrabold" style={{color:'#4285F4'}}>G</span>Continue with Google</button></>)}
 <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-6 text-sm"><p className="font-bold" style={{color:'#0B1F4B'}}>Try the demo</p><div className="grid grid-cols-2 gap-2 mt-3"><button onClick={()=>demo('owner')} className="btn-ghost !py-2 text-xs">Owner demo</button><button onClick={()=>demo('admin')} className="btn-ghost !py-2 text-xs">Admin demo</button></div><p className="text-[11px] text-slate-500 mt-2">owner@samanvaya.in · admin@samanvaya.in — password: password123</p></div>
 <p className="text-center text-sm text-slate-500 mt-6">{isSignup?<><span>Already have an account? </span><Link to="/login" className="font-bold" style={{color:'#0B7E6F'}}>Login</Link></>:admin?<Link to="/login" className="font-bold" style={{color:'#0B7E6F'}}>← Business owner login</Link>:<><span>New business? </span><Link to="/signup" className="font-bold" style={{color:'#0B7E6F'}}>Create account</Link><span> · </span><Link to="/list-your-business" className="font-bold" style={{color:'#0B7E6F'}}>List free</Link></>}</p>
 <p className="text-center text-xs text-slate-400 mt-3">Customers never need an account to browse or enquire.</p></div></main>);}
