import {createContext,useContext,useEffect,useState} from 'react';
import supabase from '../lib/supabase';
const Ctx=createContext<any>({user:null,session:null,loading:true});
export function AuthProvider({children}:{children:any}){const[user,setUser]=useState<any>(null);const[session,setSession]=useState<any>(null);const[loading,setLoading]=useState(true);useEffect(()=>{supabase.auth.getSession().then(({data})=>{setSession(data.session);setUser(data.session?.user??null);setLoading(false);});const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s);setUser(s?.user??null);setLoading(false);});return()=>subscription.unsubscribe();},[]);return <Ctx.Provider value={{user,session,loading}}>{children}</Ctx.Provider>;}
export const useAuth=()=>useContext(Ctx);
