type IntersectionObserverFunction = {
  _handleIntersect?: (isIntersecting: boolean) => void
}

type VideoWithIntersectionObserver = 
  HTMLVideoElement & IntersectionObserverFunction
type VideoReference = React.RefObject<HTMLVideoElement> & {
  current: VideoWithIntersectionObserver
}
type VideoContainerReference = React.RefObject<HTMLElement> & {
  current: VideoWithIntersectionObserver
}

type ImageWithIntersectionObserver = 
  HTMLImageElement & IntersectionObserverFunction
type ImageReference = React.RefObject<HTMLImageElement> & {
  current: ImageWithIntersectionObserver
}

type TypeMedia = {
  ext: string;
  mime: string;
};

type Thumbnail = {
  collage: string;
  images: string[];
  resolution: `${number}x${number}`;
  total: number;
};

type StreamProps = {
  codec_type: string;
  width: number;
  height: number;
  videoCodec: string;
  ratio: string;
};

type FormatProps = {
  format_name: string;
  format_long_name: string;
  start_time: string;
  duration: number;
  size: number;
  bit_rate: number;
  probe_score: number;
  tags: {
    major_brand: string;
    minor_version: string;
    compatible_brands: string;
    encoder: string;
  };
};

type Media = {
  _id: string;
  title: string;
  description: string;
  metadata: {
    duration: number;
    size: number;
    mime_type: string;
    extension: string;
    width: number;
    height: number;
    ratio: string;
  };
  thumbnail: {
    images?: string[];
    resolution: string;
    vframes: number;
  }

  createdAt: Date;

}