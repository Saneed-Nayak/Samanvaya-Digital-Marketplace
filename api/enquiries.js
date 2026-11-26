import supabase from './db-client.js';
export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
 if(req.method==='OPTIONS')return res.status(204).end();
 try{
  if(req.method==='GET'){
   let q=supabase.from('enquiries').select('*').order('created_at',{ascending:false});
   if(req.query.business_id)q=q.eq('business_id',Number(req.query.business_id));
   if(req.query.status)q=q.eq('status',req.query.status);
   if(req.query.enquiry_type)q=q.eq('enquiry_type',req.query.enquiry_type);
   const {data,error}=await q.limit(500);if(error)throw error;return res.status(200).json(data);
  }
  if(req.method==='POST'){
   const b=req.body||{};
   if(!b.customer_name||!String(b.customer_name).trim())return res.status(400).json({error:'Please enter your name'});
   const mobile=String(b.mobile||'').replace(/\D/g,'');
   if(mobile.length<10)return res.status(400).json({error:'Please enter a valid 10-digit mobile number'});
   if(!b.message||!String(b.message).trim())return res.status(400).json({error:'Please write a short message'});
   const {data,error}=await supabase.from('enquiries').insert({business_id:b.business_id?Number(b.business_id):null,business_name:b.business_name||'SAMANVAYA',customer_name:b.customer_name,mobile,email:b.email||null,item_name:b.item_name||null,item_type:b.item_type||'business',item_id:b.item_id?Number(b.item_id):null,message:b.message,preferred_date:b.preferred_date||null,enquiry_type:b.enquiry_type||'general',status:'New'}).select().single();if(error)throw error;return res.status(201).json(data);
  }
  if(req.method==='PUT'){const {id,...rest}=req.body||{};if(!id)return res.status(400).json({error:'id required'});const allowed=['status','message','preferred_date','enquiry_type'];const upd={};for(const k of allowed)if(rest[k]!==undefined)upd[k]=rest[k];const {data,error}=await supabase.from('enquiries').update(upd).eq('id',id).select().single();if(error)throw error;return res.status(200).json(data);}
  if(req.method==='DELETE'){const {id}=req.body||{};const {error}=await supabase.from('enquiries').delete().eq('id',id);if(error)throw error;return res.status(200).json({ok:true});}
  res.status(405).json({error:'Method not allowed'});
 }catch(err){res.status(500).json({error:err.message});}
}
