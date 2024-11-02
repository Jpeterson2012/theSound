import React from 'react'
import ReactDOM from 'react-dom/client'
import WebPlayback from './components/WebPlayback/WebPlayback.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import App from './App/App.jsx'
import Login from './routes/Login.jsx';
import ErrorPage from "./error-page";
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './routes/Home.jsx';
import './index.css'
import UserData from './routes/UserData.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
    <>
    {/* <App /> */}
    <Router>
    <ScrollToTop />
          <Routes>
            <Route path='/' element={<App />} errorElement={<ErrorPage />} />
            <Route path = '/login' element={<Login />}/>
            <Route path='/app/*' element={<UserData />} />
            
            {/* <Route path='*' element={<WebPlayback /> }/> */}
          </Routes>
        </Router>
        
    </>
  
)



// const router = createBrowserRouter([
  
//   {
//     path: "/",
//     element: <App />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path:"/login",
//     element: <Login />
//   },
//   {
//     path: "/home",
//     element: <Home />
//   },
//   {
//     path: "/album/:id",
//     element: <Album />
//   },
//   {
//     path: "/webplayer",
//     element: <WebPlayer />
//   },
// ]);
//Strict method causes 2 renders for testing purposes
// ReactDOM.createRoot(document.getElementById('root')).render(
//   // <React.StrictMode>
//     <>
//     <RouterProvider router={router} />
//     {/* {<App /> } */}
//     {/* <WebPlayback /> */}
//     </>
//   // {</React.StrictMode>}
// )
