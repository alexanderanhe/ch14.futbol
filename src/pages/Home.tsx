import { Suspense } from 'react';
import Feed from '../components/feed';

export default function HomePage() {
  return (
    <Suspense fallback={<p>Cargando</p>}>
      <Feed />
    </Suspense>
  )
}