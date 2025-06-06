import './App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home';
import Layout from './components/layout';
import UploadPage from './pages/Upload';
import VideoPage from './pages/Video';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SignIn } from '@clerk/clerk-react';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="upload" element={<UploadPage />} />
        <Route path="video" element={<VideoPage />} />
        <Route index element={<HomePage />} />
      </Route>
      <Route path="sign-in" element={<SignIn />} />
    </Route>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
