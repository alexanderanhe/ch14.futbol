type IntersectionObserverFunction = {
  _handleIntersect?: (isIntersecting: boolean) => void
}

type VideoWithIntersectionObserver = 
  HTMLVideoElement & IntersectionObserverFunction
type VideoReference = React.RefObject<HTMLVideoElement> & {
  current: VideoWithIntersectionObserver
}

type ImageWithIntersectionObserver = 
  HTMLImageElement & IntersectionObserverFunction
type ImageReference = React.RefObject<HTMLImageElement> & {
  current: ImageWithIntersectionObserver
}

type Media = {
  _id: string
  title: string;
  description: string;
  codec_type: string;
  type: string;
  video_at: Date | string;
  created_at: Date | string;
  src?: string;
}