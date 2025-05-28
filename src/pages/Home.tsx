import { Suspense } from 'react';
import Feed from '../components/feed';
import Loader from '../components/loader';

export default function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <Feed />
    </Suspense>
  )
}