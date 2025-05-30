import { Suspense } from "react";
import Loader from "../components/loader";
import Tiktok from "../components/tiktok";

export default function VideoPage() {
  
  return (
    <Suspense fallback={<Loader />}>
      <Tiktok />
    </Suspense>
  )
}