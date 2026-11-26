import supabase from './db-client.js';
const clean=(s='')=>String(s).replace(/[,()*]/g,' ').trim();
const slugify=(s='')=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export default async function handler(req,res){
 res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
 if(req.method==='OPTIONS')return res.status(204).end();
 try{
  if(req.method==='GET'){
   const {status,category,category_id,city,state,q,featured,slug,owner_email,owner_id,sort='newest',limit='100',page}=req.query;
   if(slug){const {data,error}=await supabase.from('businesses').select('*').eq('slug',slug).single();if(error)throw error;return res.status(200).json(data);}
   let query=supabase.from('businesses').select('*',{count:'exact'});
   if(status)query=query.eq('status',status);
   if(category)query=query.eq('category_name',category);
   if(category_id)query=query.eq('category_id',Number(category_id));
   if(city)query=query.eq('city',city);
   if(state)query=query.eq('state',state);
   if(featured==='true')query=query.eq('featured',true);
   if(owner_email)query=query.eq('owner_email',owner_email);
   if(owner_id)query=query.eq('owner_id',owner_id);
   if(q){const s=clean(q);query=query.or(`name.ilike.%${s}%,description.ilike.%${s}%,category_name.ilike.%${s}%,subcategory.ilike.%${s}%,address.ilike.%${s}%`);}
   if(sort==='rating')query=query.order('rating',{ascending:false,nullsFirst:false});
   else if(sort==='popular')query=query.order('views',{ascending:false});
   else if(sort==='name')query=query.order('name',{ascending:true});
   else query=query.order('created_at',{ascending:false});
   const lim=Math.min(Number(limit)||100,500);
   if(page){const p=Math.max(1,Number(page));query=query.range((p-1)*lim,p*lim-1);}else query=query.limit(lim);
   const {data,error,count}=await query;if(error)throw error;return res.status(200).json({items:data,total:count??data.length});
  }
  if(req.method==='POST'){
   const b=req.body||{};
   if(!b.name||!b.owner_name||!b.phone)return res.status(400).json({error:'Business name, owner name and mobile number are required'});
   let slug=b.slug||slugify(b.name+'-'+(b.city||''));
   const {data:ex}=await supabase.from('businesses').select('id').eq('slug',slug);
   if(ex&&ex.length)slug=slug+'-'+Math.floor(1000+Math.random()*9000);
   const payload={owner_id:b.owner_id||null,owner_name:b.owner_name,owner_email:b.owner_email||b.email||null,owner_phone:b.owner_phone||b.phone,name:b.name,slug,category_id:b.category_id?Number(b.category_id):null,category_name:b.category_name||'General',subcategory:b.subcategory||null,description:b.description||'',address:b.address||'',city:b.city||'',state:b.state||'',pincode:b.pincode||'',phone:b.phone,email:b.email||null,whatsapp:b.whatsapp||b.phone,website:b.website||null,logo:b.logo||null,cover:b.cover||null,gallery:Array.isArray(b.gallery)?b.gallery:[],hours:b.hours||{},features:b.features||'',rating:b.rating||null,rating_count:b.rating_count||0,views:0,status:b.status||'pending',featured:!!b.featured,plan:b.plan||'Free',plan_expiry:b.plan_expiry||null,established:b.established?Number(b.established):null};
   const {data,error}=await supabase.from('businesses').insert(payload).select().single();if(error)throw error;return res.status(201).json(data);
  }
  if(req.method==='PUT'){
   const {id,increment_views,...rest}=req.body||{};
   if(!id)return res.status(400).json({error:'id required'});
   if(increment_views){const {data:cur}=await supabase.from('businesses').select('views').eq('id',id).single();const {data,error}=await supabase.from('businesses').update({views:(cur?.views||0)+1}).eq('id',id).select().single();if(error)throw error;return res.status(200).json(data);}
   const allowed=['owner_id','owner_name','owner_email','owner_phone','name','slug','category_id','category_name','subcategory','description','address','city','state','pincode','phone','email','whatsapp','website','logo','cover','gallery','hours','features','rating','rating_count','views','status','featured','plan','plan_expiry','established'];
   const upd={};for(const k of allowed)if(rest[k]!==undefined)upd[k]=rest[k];
   const {data,error}=await supabase.from('businesses').update(upd).eq('id',id).select().single();if(error)throw error;return res.status(200).json(data);
  }
  if(req.method==='DELETE'){
   const {id}=req.body||{};if(!id)return res.status(400).json({error:'id required'});
   await supabase.from('products').delete().eq('business_id',id);await supabase.from('services').delete().eq('business_id',id);await supabase.from('enquiries').delete().eq('business_id',id);
   const {error}=await supabase.from('businesses').delete().eq('id',id);if(error)throw error;return res.status(200).json({ok:true});
  }
  res.status(405).json({error:'Method not allowed'});
 }catch(err){console.error(err);res.status(500).json({error:err.message});}
}
