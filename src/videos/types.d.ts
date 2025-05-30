export type VideoData = {
    title?: string;
    author?: string;
    album?: string;
    poster?: string;
    thumbnails?: {
      collage: string;
      total: number;
      images: string[];
      resolution: string;
    };
  };

  export type ImageData = {
    src: string;
  }