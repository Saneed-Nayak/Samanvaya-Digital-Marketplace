import supabase from './db-client.js';
const slugify=(s='')=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
 if(req.method==='OPTIONS')return res.status(204).end();
 try{
  if(req.method==='GET'){
   let q=supabase.from('categories').select('*').order('sort_order',{ascending:true});
   if(req.query.active==='true')q=q.eq('is_active',true);
   if(req.query.parent_id!==undefined)q=req.query.parent_id==='null'?q.is('parent_id',null):q.eq('parent_id',Number(req.query.parent_id));
   const {data,error}=await q;if(error)throw error;return res.status(200).json(data);
  }
  if(req.method==='POST'){const b=req.body||{};if(!b.name)return res.status(400).json({error:'Name required'});const {data,error}=await supabase.from('categories').insert({name:b.name,slug:b.slug||slugify(b.name),icon:b.icon||'Grid3x3',image:b.image||null,description:b.description||'',parent_id:b.parent_id?Number(b.parent_id):null,sort_order:b.sort_order?Number(b.sort_order):99,is_active:b.is_active!==false}).select().single();if(error)throw error;return res.status(201).json(data);}
  if(req.method==='PUT'){const {id,...rest}=req.body||{};if(!id)return res.status(400).json({error:'id required'});const allowed=['name','slug','icon','image','description','parent_id','sort_order','is_active'];const upd={};for(const k of allowed)if(rest[k]!==undefined)upd[k]=rest[k];const {data,error}=await supabase.from('categories').update(upd).eq('id',id).select().single();if(error)throw error;return res.status(200).json(data);}
  if(req.method==='DELETE'){const {id}=req.body||{};const {error}=await supabase.from('categories').delete().eq('id',id);if(error)throw error;return res.status(200).json({ok:true});}
  res.status(405).json({error:'Method not allowed'});
 }catch(err){res.status(500).json({error:err.message});}
}
