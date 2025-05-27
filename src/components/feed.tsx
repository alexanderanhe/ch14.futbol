import { use, useEffect, useRef, useState } from 'react';
import styles from './feed.module.css';
import VideoContainer from './video'
import ImageContainer from './image'
import FeedNav from './nav';
import { PreferencesContextProvider } from '../context/preferences';
import { fetchData } from '../data';

export default function Feed() {
  const data = use(fetchData('/video?')) as Media[];
  const [media, setMedia] = useState<Media[]>(data);
  if (data.length === 0) {
    return (<p>No hay videos</p>);
  }

  return (
    <PreferencesContextProvider>
      <Section addMedia={setMedia}>
        { media?.map((media: Media, i) => (
          media.codec_type.includes('video')
          ? <VideoContainer key={`feed-${media._id}-${i}`} {...media} autoPlay={!i} src={`${import.meta.env.VITE_API_URL}/video/stream/${media._id}`} mime={media.type} />
          : <ImageContainer key={`feed-${media._id}-${i}`} {...media} src={`/api/image/${media._id}`} mime={media.type} />
        ))}
      </Section>
      <FeedNav />
    </PreferencesContextProvider>
  )
}

function Section({ children, addMedia }: { children: React.ReactNode, addMedia: (media: (Media[] | ((prev: Media[]) => Media[]))) => void }) {
  const section = useRef<HTMLDivElement>(null);
  const [skip, setSkip] = useState(0);


  useEffect(() => {
    if (!section.current) return;
    section.current?.addEventListener("scrollend", handleScrollend);
    return () => {
      section.current?.removeEventListener("scrollend", handleScrollend);
    }
  }, [section.current]);

  async function handleScrollend() {
    if (!section.current) return;
    const scrollRest = section.current.scrollHeight - section.current.scrollTop - section.current.clientHeight;
    if (scrollRest < 100 && section.current.dataset.loading !== "true") {
      section.current.dataset.loading = "true";
      try {
        const request = await fetch(`${import.meta.env.VITE_API_URL}/video?skip=${skip}&limit=10`);
        const data = await request.json();
        if (data.length === 0) {
          section.current.removeEventListener("scrollend", handleScrollend);
          return;
        };
        const videos = (data?.map((video: Media) => ({
          ...video,
          created_at: new Date(video.created_at).toLocaleString(),
        })) ?? []) as Media[];
        setSkip(skip => skip + 10);
        addMedia((prev: Media[]) => [...prev, ...videos]);
        section.current.dataset.loading = "false";
      } catch (error) {
        console.error(error);
      }
    }
  }

  return <section className={`${styles.feed} no-scrollbar`} ref={section}>
    { children }
  </section>
}