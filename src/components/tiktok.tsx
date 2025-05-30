import { use, useState } from "react";
import { VideoContainer, VideoPlayer } from "../videos";
import { fetchData } from "../data";
import FeedNav from "./nav";

export default function Tiktok() {
  const data = use(fetchData('/video?')) as Media[];
  const [media] = useState<Media[]>(data);
  const VIDEO_API_URL = `${import.meta.env.VITE_API_URL}/video/stream`;
  if (data.length === 0) {
    return (<p>No hay videos</p>);
  }
  return (
    <VideoContainer>
      {media.map((m: Media, i) => (
        <VideoPlayer
          key={`video-${m._id}-${i}`}
          data={{
            poster: `url(data:image/jpg;base64,${m.thumbnails?.images?.[0]}`,
            thumbnails: m.thumbnails,
          }}
          autoPlay={!i}
        >
          <source src={`${VIDEO_API_URL}/${m._id}`} type={ m.type.mime } />
          {/* {Object.entries(vtts).map(([lang, vtt]) => (
            <track key={`vtt-${lang}`} kind="captions" srcLang={lang} src={vtt} />
          ))} */}
        </VideoPlayer>
      ))}
      <FeedNav />
    </VideoContainer>
  )
}