import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from "react-dom/client";
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';
// import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';
import Layout from './Layout';
import SignUp from './components/signUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import Home from './components/Home/Home';
import LikedVideos from './components/LikedVideos/LikedVideos';
import WatchedHistory from './components/WatchedHistory/WatchedHistory';
import Subscriptions from './components/Subscriptions/Subscriptions';
import Collections from './components/Collections/Collections';
import UserContextProvider from './context/UserContextProvider';
import UploadFile from './components/UploadFiles/UploadFile';
import HomePage from './components/HomePage/HomePage';
import YourChannel from './components/YourChannel/YourChannel';
import Playlists from './components/Playlists/Playlists';
import RandomChannel from './components/RandomChannel/RandomChannel';
import WatchVideo from './components/WatchVideo/WatchVideo';
import UserProfileSettings from './components/UserSettings/UserProfileSettings';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import SearchResults from './components/SearchResults/SearchResults';

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
    <Route index element={<Home/>} />
    <Route path='/search' element={<SearchResults/>} />

    <Route path='/:username' element={<RandomChannel/>} />
    <Route path="/watch/:videoId" element={<WatchVideo/>} />

    <Route
      path='/dashboard'
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route path='/channel/:username' element={<YourChannel/>} />
    <Route
      path='/likedvideos'
      element={
        <ProtectedRoute>
          <LikedVideos />
        </ProtectedRoute>
      }
    />
    <Route
      path='/history'
      element={
        <ProtectedRoute>
          <WatchedHistory />
        </ProtectedRoute>
      }
    />
    <Route path='/collections' element={<Collections/>} />
    <Route
      path='/subscriptions'
      element={
        <ProtectedRoute>
          <Subscriptions />
        </ProtectedRoute>
      }
    />
    <Route
      path='/settings/profile'
      element={
        <ProtectedRoute>
          <UserProfileSettings />
        </ProtectedRoute>
      }
    />

    <Route path='/channel/:username' element={<YourChannel/>} >
    <Route index element={<HomePage/>} />
    {/* //TODO  */}
    <Route path='/channel/:username/home/videos/:videoId' element={<YourChannel/>} />
    <Route path='/channel/:username/playlists' element={<Playlists/>} />
    </Route>

    <Route
      index
      path='/channel/upload'
      element={
        <ProtectedRoute>
          <UploadFile />
        </ProtectedRoute>
      }
    />
    </Route>

    <Route path='/signup' element={<SignUp/>} />
    <Route path='/signin' element={<SignIn/>} />

    </>
    

  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
