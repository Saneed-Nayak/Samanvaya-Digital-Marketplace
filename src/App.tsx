import {BrowserRouter,Routes,Route,Navigate,Outlet} from 'react-router-dom';
import {AuthProvider,useAuth} from './contexts/AuthContext';
import {Navbar,Footer,BottomNav} from './components/layout';
import {EnquiryProvider} from './components/EnquiryModal';
import Home from './pages/Home';
import Explore from './pages/Explore';
import BusinessDetail from './pages/BusinessDetail';
import {ProductsPage,ServicesPage,ItemDetail} from './pages/Market';
import {CategoriesPage,HowItWorksPage,AboutPage,ContactPage} from './pages/Info';
import ListBusiness from './pages/ListBusiness';
import {AuthPage} from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
function PublicLayout({children}:{children?:any}){return(<><Navbar/>{children||<Outlet/>}<Footer/><BottomNav/></>);}
function Protected({children,admin=false}:{children:any;admin?:boolean}){const{user,loading}=useAuth();if(loading)return(<div className="min-h-screen flex items-center justify-center font-semibold text-slate-500">Loading…</div>);if(!user)return <Navigate to={admin?'/admin/login':'/login'} replace/>;return children;}
export default function App(){return(<AuthProvider><EnquiryProvider><BrowserRouter><Routes>
 <Route element={<PublicLayout/>}>
  <Route path="/" element={<Home/>}/>
  <Route path="/explore" element={<Explore/>}/>
  <Route path="/business/:slug" element={<BusinessDetail/>}/>
  <Route path="/products" element={<ProductsPage/>}/>
  <Route path="/products/:id" element={<ItemDetail kind="products"/>}/>
  <Route path="/services" element={<ServicesPage/>}/>
  <Route path="/services/:id" element={<ItemDetail kind="services"/>}/>
  <Route path="/categories" element={<CategoriesPage/>}/>
  <Route path="/how-it-works" element={<HowItWorksPage/>}/>
  <Route path="/about" element={<AboutPage/>}/>
  <Route path="/contact" element={<ContactPage/>}/>
  <Route path="/list-your-business" element={<ListBusiness/>}/>
  <Route path="/login" element={<AuthPage mode="login"/>}/>
  <Route path="/signup" element={<AuthPage mode="signup"/>}/>
  <Route path="/admin/login" element={<AuthPage mode="login" admin/>}/>
 </Route>
 <Route path="/dashboard" element={<Protected><Dashboard/></Protected>}/>
 <Route path="/admin" element={<Protected admin><Admin/></Protected>}/>
 <Route path="*" element={<PublicLayout><main className="py-24 text-center px-4"><h1 className="text-4xl font-extrabold" style={{color:'#0B1F4B'}}>404</h1><p className="text-slate-500 mt-2">This page wandered off. Let's get you back to the marketplace.</p><a href="/" className="btn-primary mt-6">Go home</a></main></PublicLayout>}/>
</Routes></BrowserRouter></EnquiryProvider></AuthProvider>);}
