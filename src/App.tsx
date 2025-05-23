import { Suspense } from 'react';
import './App.css'
import Feed from './components/feed';

function App() {
  return (
    <>
      <Suspense fallback={<p>Cargando</p>}>
        <Feed />
      </Suspense>
    </>
  )
}

export default App
