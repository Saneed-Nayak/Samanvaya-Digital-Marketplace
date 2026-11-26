import {Link} from 'react-router-dom';
import {MapPin,Phone,ArrowRight,Clock,BadgeCheck} from 'lucide-react';
import {RatingBadge,ICONS} from './ui';
import {FALLBACK,inr,initials} from '../lib/api';
import {useEnquiry} from './EnquiryModal';
export function BusinessCard({b}:{b:any}){return(<article className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_24px_-8px_rgba(11,31,75,.12)] overflow-hidden card-hover flex flex-col">
 <Link to={`/business/${b.slug}`} className="relative block"><img src={b.cover||b.logo||FALLBACK} alt={b.name} loading="lazy" className="h-44 w-full object-cover" onError={(e:any)=>{e.target.src=FALLBACK;}}/>
 <span className="absolute top-3 left-3 bg-white/95 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{color:'#0B1F4B'}}>{b.category_name}</span>
 {b.featured&&<span className="absolute top-3 right-3 text-white text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1" style={{background:'#0E9F8C'}}><BadgeCheck size={12}/>Featured</span>}</Link>
 <div className="p-4 flex flex-col flex-1">
  <div className="flex items-center gap-3 -mt-9 mb-2 relative"><span className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center font-extrabold text-white shrink-0 overflow-hidden" style={b.logo?{}:{background:'#0B1F4B'}}>{b.logo?<img src={b.logo} alt="" className="w-full h-full object-cover"/>:initials(b.name)}</span></div>
  <Link to={`/business/${b.slug}`}><h3 className="font-extrabold text-[17px] leading-snug hover:underline" style={{color:'#0B1F4B'}}>{b.name}</h3></Link>
  <div className="flex items-center gap-2 mt-1.5 flex-wrap"><RatingBadge r={b.rating} count={b.rating_count}/><span className="inline-flex items-center gap-1 text-xs text-slate-500"><MapPin size={12}/>{b.city}{b.state?`, ${b.state}`:''}</span></div>
  <p className="text-sm text-slate-500 clamp2 mt-2 flex-1">{b.description}</p>
  <div className="flex gap-2 mt-4"><Link to={`/business/${b.slug}`} className="btn-primary flex-1 !py-2.5 text-sm">View Business<ArrowRight size={15}/></Link>{b.phone&&<a href={`tel:${b.phone}`} className="btn-ghost !px-3.5" aria-label="Call"><Phone size={17}/></a>}</div>
 </div></article>);}
export function ProductCard({p}:{p:any}){const{openEnquiry}=useEnquiry();return(<article className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_24px_-8px_rgba(11,31,75,.12)] overflow-hidden card-hover flex flex-col">
 <Link to={`/products/${p.id}`}><img src={p.image||FALLBACK} alt={p.name} loading="lazy" className="h-44 w-full object-cover" onError={(e:any)=>{e.target.src=FALLBACK;}}/></Link>
 <div className="p-4 flex flex-col flex-1"><span className="text-[11px] font-bold tracking-wide uppercase" style={{color:'#0E9F8C'}}>{p.category_name}</span>
 <Link to={`/products/${p.id}`}><h3 className="font-bold mt-1 leading-snug" style={{color:'#0B1F4B'}}>{p.name}</h3></Link>
 <p className="text-xs text-slate-400 mt-0.5">by {p.business_name}{p.city?` · ${p.city}`:''}</p>
 <p className="text-sm text-slate-500 clamp2 mt-2 flex-1">{p.description}</p>
 <div className="flex items-end justify-between mt-3"><div><span className="font-extrabold text-lg" style={{color:'#0B1F4B'}}>{inr(p.price)}</span>{p.mrp&&Number(p.mrp)>Number(p.price||0)&&<span className="text-sm text-slate-400 line-through ml-2">{inr(p.mrp)}</span>}{p.price!=null&&<span className="text-xs text-slate-400"> /{p.unit||'piece'}</span>}</div>{p.rating&&<RatingBadge r={p.rating}/>}</div>
 <button onClick={()=>openEnquiry({business_id:p.business_id,business_name:p.business_name,item:p,type:'product',item_type:'product',defaultMessage:`Hi, I am interested in "${p.name}". Please share availability & best price.`})} className="btn-teal w-full mt-3 !py-2.5 text-sm">Enquire Now</button></div></article>);}
export function ServiceCard({s}:{s:any}){const{openEnquiry}=useEnquiry();return(<article className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_24px_-8px_rgba(11,31,75,.12)] overflow-hidden card-hover flex flex-col">
 <Link to={`/services/${s.id}`}><img src={s.image||FALLBACK} alt={s.name} loading="lazy" className="h-44 w-full object-cover" onError={(e:any)=>{e.target.src=FALLBACK;}}/></Link>
 <div className="p-4 flex flex-col flex-1"><span className="text-[11px] font-bold tracking-wide uppercase" style={{color:'#0E9F8C'}}>{s.category_name}</span>
 <Link to={`/services/${s.id}`}><h3 className="font-bold mt-1 leading-snug" style={{color:'#0B1F4B'}}>{s.name}</h3></Link>
 <p className="text-xs text-slate-400 mt-0.5">by {s.business_name}{s.city?` · ${s.city}`:''}</p>
 <p className="text-sm text-slate-500 clamp2 mt-2 flex-1">{s.description}</p>
 <div className="flex items-end justify-between mt-3"><div>{s.price!=null?<><span className="text-xs text-slate-400 block">Starting at</span><span className="font-extrabold text-lg" style={{color:'#0B1F4B'}}>{inr(s.price)}</span></>:<span className="font-bold" style={{color:'#0B1F4B'}}>Price on enquiry</span>}</div>{s.duration&&<span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full"><Clock size={12}/>{s.duration}</span>}</div>
 <button onClick={()=>openEnquiry({business_id:s.business_id,business_name:s.business_name,item:s,type:'service',item_type:'service',enquiry_type:'booking',defaultMessage:`Hi, I would like to book "${s.name}". Please confirm availability.`})} className="btn-teal w-full mt-3 !py-2.5 text-sm">Book / Enquire</button></div></article>);}
export function CategoryCard({c,count}:{c:any;count?:number}){const Icon=ICONS[c.icon]||ICONS.LayoutGrid;return(<Link to={`/explore?category=${encodeURIComponent(c.name)}`} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover shadow-[0_4px_20px_-8px_rgba(11,31,75,.10)] block">
 <div className="relative h-28 sm:h-32"><img src={c.image||FALLBACK} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" onError={(e:any)=>{e.target.src=FALLBACK;}}/><div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(6,22,49,.72),transparent 65%)'}}/>
 <span className="absolute bottom-2.5 left-3 inline-flex items-center gap-1.5 text-white font-bold text-[15px]"><span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'#0E9F8C'}}><Icon size={15}/></span>{c.name}</span></div>
 <div className="p-3"><p className="text-xs text-slate-500 clamp2 min-h-[32px]">{c.description}</p>{count!==undefined&&<p className="text-xs font-bold mt-1.5" style={{color:'#0E9F8C'}}>{count} businesses →</p>}</div></Link>);}
