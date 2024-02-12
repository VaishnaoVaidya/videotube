import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';
import Layout from './Layout';
import SignUp from './components/signUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import Home from './components/Home/Home';
import MyContent from './components/MyContent/MyContent';
import LikedVideos from './components/LikedVideos/LikedVideos';
import WatchedHistory from './components/WatchedHistory/WatchedHistory';
import Subscriptions from './components/Subscriptions/Subscriptions';
import Collections from './components/Collections/Collections';
// import { CookiesProvider } from 'react-cookie';
import Channel from './components/channel/Channel';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Layout/>,
//     children: [
//       {
//         path: "",
//         element: <Home />
//       },
//       {
//         path: "about",
//         element: <About />
//       },
//       {
//         path: "contact",
//         element: <Contact />
//       }
//     ]
//   }
// ])

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<Layout/>} >

    <Route path='/' element={<Home/>} />
    <Route path='/mycontent' element={<MyContent/>} />
    <Route path='/likedvideos' element={<LikedVideos/>} />
    <Route path='/history' element={<WatchedHistory/>} />
    <Route path='/collections' element={<Collections/>} />
    <Route path='/subscriptions' element={<Subscriptions/>} />
    <Route path='/channel/:username' element={<Channel/>} >
    <Route path='/channel/:username/home' element={<Channel/>} />
    <Route path='/channel/:username/playlist' element={<Channel/>} />
    </Route>
    </Route>
    <Route path='/signup' element={<SignUp/>} />
    <Route path='/signin' element={<SignIn/>} />

    </>
    

  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <CookiesProvider> */}
    <RouterProvider router={router} />
    {/* </CookiesProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
