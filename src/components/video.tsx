import { use, useState } from "react";
import { goItem, VideoContainer, VideoPlayer } from "../tik-player";
import { fetchData } from "../data";
import Nav from "../tik-player/nav";
import NoImage from "../assets/no-image.webp"
import { useAuth } from "@clerk/clerk-react";

export default function Video() {
  const { getToken } = useAuth();
  const token = use(getToken());
  const data = use(fetchData('/video?', token ?? '')) as Media[];
  const [media] = useState<Media[]>(data);
  const VIDEO_API_URL = `${import.meta.env.VITE_API_URL}/video/stream`;
  const THUMB_API_URL = `${import.meta.env.VITE_API_URL}/video/thumbnail`;
  const TRACK_API_URL = `${import.meta.env.VITE_API_URL}/video/vtt`;
  if (data.length === 0) {
    return (<p>No hay videos</p>);
  }
  return (
    <VideoContainer panel={<Panel data={media} />}>
      {media.map((m: Media, i) => (
        <VideoPlayer
          key={`video-${m._id}-${i}`}
          data={{
            // poster: `data:image/jpg;base64,${m.thumbnails?.images?.[0]}`,
            thumbnails: {
              images: [],
              collage: `${THUMB_API_URL}/${m._id}`,
              total: m.thumbnail.vframes,
              resolution: m.thumbnail.resolution,
            },
          }}
          id={`video-${m._id}-${i}`}
          watermark={<WaterMark />}
        >
          <source data-src={`${VIDEO_API_URL}/${m._id}`} type={ m.metadata.mime_type } />
          {Object.entries({ "en": `${TRACK_API_URL}/${m._id}`}).map(([lang, vtt]) => (
            <track key={`vtt-${lang}`} kind="captions" srcLang={lang} data-src={vtt} />
          ))}
        </VideoPlayer>
      ))}
      <Nav />
    </VideoContainer>
  )
}

function Panel({data}: {data: Media[]}) {
  const go = (id: string) => (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const item = document?.getElementById(id) as HTMLElement;
    if (item) goItem(item);
    return false;
  }
  return (
    <>
    {data.map((media, i) => (
      <div key={`panel-${media._id}`} className="flex flex-col gap-2 p-2 ">
        <a href={`#video-${media._id}-${i}`} onClick={go(`video-${media._id}-${i}`)} className="opacity-80 hover:opacity-100">
          <img className={`w-full rounded-2xl object-cover aspect-video bg-gray-200`} src={
            media.thumbnail?.images?.length
            ? `${media.thumbnail?.images?.[0]}`
            : NoImage
            } alt={media.title} draggable="false" />
          <h3>{media.title}</h3>
        </a>
      </div>
    ))}
    </>
  )
}

function WaterMark() {
  return (
    <span className="font-monka">ch14</span>
  )
}