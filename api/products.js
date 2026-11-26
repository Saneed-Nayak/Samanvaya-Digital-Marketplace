import supabase from './db-client.js';
const clean=(s='')=>String(s).replace(/[,()*]/g,' ').trim();
export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
 if(req.method==='OPTIONS')return res.status(204).end();
 try{
  if(req.method==='GET'){
   const {id,business_id,category,city,q,active,sort='newest',limit='200'}=req.query;
   if(id){const {data,error}=await supabase.from('products').select('*').eq('id',Number(id)).single();if(error)throw error;return res.status(200).json(data);}
   let query=supabase.from('products').select('*');
   if(business_id)query=query.eq('business_id',Number(business_id));
   if(category)query=query.eq('category_name',category);
   if(city)query=query.eq('city',city);
   if(active==='true')query=query.eq('is_active',true);
   if(q){const s=clean(q);query=query.or(`name.ilike.%${s}%,description.ilike.%${s}%,business_name.ilike.%${s}%,category_name.ilike.%${s}%`);}
   if(sort==='price_low')query=query.order('price',{ascending:true,nullsFirst:false});else if(sort==='price_high')query=query.order('price',{ascending:false,nullsFirst:false});else if(sort==='rating')query=query.order('rating',{ascending:false,nullsFirst:false});else query=query.order('created_at',{ascending:false});
   const {data,error}=await query.limit(Math.min(Number(limit)||200,500));if(error)throw error;return res.status(200).json(data);
  }
  if(req.method==='POST'){const b=req.body||{};if(!b.name||!b.business_id)return res.status(400).json({error:'Product name and business required'});const {data,error}=await supabase.from('products').insert({business_id:Number(b.business_id),business_name:b.business_name||'',name:b.name,description:b.description||'',price:b.price!==''&&b.price!=null?Number(b.price):null,mrp:b.mrp?Number(b.mrp):null,unit:b.unit||'piece',image:b.image||null,category_name:b.category_name||'General',city:b.city||'',rating:b.rating?Number(b.rating):null,is_active:b.is_active!==false,views:0}).select().single();if(error)throw error;return res.status(201).json(data);}
  if(req.method==='PUT'){const {id,...rest}=req.body||{};if(!id)return res.status(400).json({error:'id required'});const allowed=['business_id','business_name','name','description','price','mrp','unit','image','category_name','city','rating','is_active','views'];const upd={};for(const k of allowed)if(rest[k]!==undefined)upd[k]=rest[k];if(upd.price==='')upd.price=null;const {data,error}=await supabase.from('products').update(upd).eq('id',id).select().single();if(error)throw error;return res.status(200).json(data);}
  if(req.method==='DELETE'){const {id}=req.body||{};const {error}=await supabase.from('products').delete().eq('id',id);if(error)throw error;return res.status(200).json({ok:true});}
  res.status(405).json({error:'Method not allowed'});
 }catch(err){res.status(500).json({error:err.message});}
}
