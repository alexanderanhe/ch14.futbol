import './App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import HomePage from './pages/Home';
import Layout from './components/layout';
import UploadPage from './pages/Upload';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<Layout />}>
        <Route path="upload" element={<UploadPage />} />
        <Route index element={<HomePage />} />
      </Route>
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
