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
    mime_type: string;
  };
  thumbnail: {
    resolution: string;
    vframes: number;
  }
  // borrar
  external: boolean;
  origin: string;
  fileName: string;
  type: TypeMedia;
  format?: FormatProps;
  stream?: StreamProps;
  thumbnails?: Thumbnail;
  createdAt: Date;
  deleted?: boolean;
}