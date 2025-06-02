import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Loader from "../components/loader";
import Video from "../components/video";

export default function VideoPage() {
  
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <Suspense fallback={<Loader />}>
        <Video />
      </Suspense>
    </ErrorBoundary>
  )
}