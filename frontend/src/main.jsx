import React from 'react'
import ReactDOM from 'react-dom/client'
import WebPlayback from './components/WebPlayback/WebPlayback.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import App from './App/App.jsx'
import Login from './routes/Login.jsx';
import ErrorPage from "./error-page";
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
    <>
    {/* <App /> */}
    
    <Router>
          <Routes>
            <Route path='/' element={<App />} errorElement={<ErrorPage />} />
            <Route path = '/login' element={<Login />}/>
            <Route path='/app/*' element={<WebPlayback />} />
            
            <Route path='*' element={sessionStorage.getItem("loggedIn") !== true ? <Login /> : <Home /> }/>
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
