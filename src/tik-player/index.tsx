import classNames from "classnames";
import { PreferencesContextProvider, usePreferencesContext } from "./context/preferences";
import useIntersection from "./hooks/useIntersection";
import Loader from "./loader";
import styles from './styles.module.css';
import useVideoControls from "./hooks/useVideoControls";
import { useEffect, useRef } from "react";
import useImageControls from "./hooks/useImageControls";
import type { ImageData, VideoData } from "./types";

type VideoContainerPorps = {
  scrollEnd?: () => Promise<void>;
  children: React.ReactNode;
  panel?: React.ReactNode;
}
export function VideoContainer({scrollEnd, panel, children}: VideoContainerPorps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  async function handleScrollend() {
    if (!scrollEnd) return;
    if (!sectionRef.current) return;
    const scrollRest = sectionRef.current.scrollHeight - sectionRef.current.scrollTop - sectionRef.current.clientHeight;
    if (scrollRest < 100 && sectionRef.current.dataset.loading !== "true") {
      sectionRef.current.dataset.loading = "true";
      await scrollEnd();
      sectionRef.current.dataset.loading = "false";
    }
  }

  useEffect(() => {
    if (!sectionRef.current) return;
    sectionRef.current?.addEventListener("scrollend", handleScrollend);
    return () => {
      sectionRef.current?.removeEventListener("scrollend", handleScrollend);
    }
  }, []);

  return (
    <PreferencesContextProvider>
      <div className={styles.main}>
        <section ref={sectionRef} className={`${styles.feed} ${styles['no-scrollbar']}`}>
          { children }
        </section>
        {panel ? <Panel>{panel}</Panel> : null}
      </div>
    </PreferencesContextProvider>
  )
}

function Panel({children}: {children: React.ReactNode; }) {
  const [{config}, dispatch] = usePreferencesContext();
  useEffect(() => {
    if (!config.panel_exist)
      dispatch({ type: "SET_CONFIG", payload: { panel_exist: true }});
  }, [config])
  if (!config.panel) return;
  return (
    <div className={`${styles.panel} ${styles['no-scrollbar']}`}>
      {children}
    </div>
  )
}

type VideoProps = React.ComponentPropsWithoutRef<"video"> & {
  data: VideoData;
  watermark?: React.ReactNode;
  children?: React.ReactNode;
}
export function VideoPlayer({children, data, watermark, ...props}: VideoProps) {
  const [preferences] = usePreferencesContext();
  const {elementRef: videoRef, isIntersecting: current} = useIntersection({
    root: null,
    rootMargin: '0px',
    threshold: 0.9
  });
  const {
    playPauseBtn,
    thumbnailImg,
    timelineContainer,
    previewImg,
    volumeSlider,
    muteBtn,
    currentTimeElem,
    totalTimeElem,
    captionsBtn,
    speedBtn,
    miniPlayerBtn,
    theaterBtn,
    fullScreenBtn,
  } = useVideoControls(
    videoRef as React.RefObject<HTMLVideoElement>,
    current,
    data
  );
  // if (current) {
  //   dispatch({ type: 'SET_CURRENT_VIDEO', payload: videoRef.current?.parentElement})
  // }
  return (
    <article
      className={classNames(styles['video-container'], 'video-container group select-none', [
        current && 'current',
      ])}
      data-volume-level="high"
    >
      <div className="thumbnail-img w-[var(--w)] h-[var(--h)] bg-no-repeat bg-position-[calc(mod((var(--p)_-_1),_10)_*_var(--w)_*_-1)_calc(((var(--p)_-_mod(var(--p),_10))_/_10)_*_var(--h))]"
        style={{ '--p': '4', '--w': '120px', '--h': '67px', backgroundImage: `url(${data.thumbnails?.collage})`} as React.CSSProperties}
        ref={thumbnailImg}
      />
      <div className="absolute bottom-0 flex justify-end w-full opacity-40 hover:opacity-100 p-2">{watermark}</div>
      <div className="video-controls-container">
        <div className="timeline-container" ref={timelineContainer}>
          <div className="timeline">
            <div className="preview-img w-[var(--w)] h-[var(--h)] bg-no-repeat bg-position-[calc(mod((var(--p)_-_1),_10)_*_var(--w)_*_-1)_calc(((var(--p)_-_mod(var(--p),_10))_/_10)_*_var(--h))]"
              style={{ '--p': '4', '--w': '120px', '--h': '67px', backgroundImage: `url(${data.thumbnails?.collage})`} as React.CSSProperties}
              ref={previewImg}
            />
            <div className="thumb-indicator"></div>
          </div>
        </div>
        <div className="controls">
          <button className="play-pause-btn" ref={playPauseBtn}>
            <svg className="play-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
            <svg className="pause-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          </button>
          <div className="volume-container">
            <button className="mute-btn" ref={muteBtn}>
              <svg className="volume-high-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
              </svg>
              <svg className="volume-low-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z" />
              </svg>
              <svg className="volume-muted-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z" />
              </svg>
            </button>
            <input className="volume-slider" type="range" min="0" max="1" step="any" defaultValue={preferences.volume} ref={volumeSlider} />
          </div>
          <div className="duration-container">
            <div className="current-time" ref={currentTimeElem}>0:00</div>
            /
            <div className="total-time" ref={totalTimeElem}>00:00</div>
          </div>
          <button className="captions-btn" ref={captionsBtn}>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z" />
            </svg>
          </button>
          <button className="speed-btn wide-btn" ref={speedBtn}>
            1x
          </button>
          <button className="mini-player-btn" ref={miniPlayerBtn}>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"/>
            </svg>
          </button>
          <button className="theater-btn" ref={theaterBtn} hidden>
            <svg className="tall" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
            </svg>
            <svg className="wide" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/>
            </svg>
          </button>
          <button className="full-screen-btn" ref={fullScreenBtn}>
            <svg className="open" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
            <svg className="close" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
          </button>
        </div>
      </div>
      <video playsInline ref={videoRef as React.RefObject<HTMLVideoElement>} {...props}>{children}</video>
      <Loader />
    </article>
  );
}

type ImagePlayerProps = React.ComponentPropsWithoutRef<"img"> & {
  data: ImageData;
}
export function ImagePlayer({data, ...props}: ImagePlayerProps) {
  const {elementRef: imageRef, isIntersecting: current} = useIntersection({
    root: null,
    rootMargin: '0px',
    threshold: 0.9
  });
  const { loaded } = useImageControls(
    imageRef as React.RefObject<HTMLImageElement>,
    current,
    data
  )
  return (
    <article className={`${styles["image-container"]} ${current ? 'current' : ''} ${!loaded ? 'waiting' : ''}`}>
      <img ref={imageRef as React.RefObject<HTMLImageElement>} {...props} />
      <div className={"controls-container"}></div>
      <Loader />
    </article>
  )
}

export const prevItem = (item: HTMLElement) => {
  const next = item.previousElementSibling as HTMLElement
  if (next) {
    const top = next.offsetTop;
    (item.parentElement  as HTMLElement).scrollTo({ top: top, behavior:"smooth" });
  }
}
export const nextItem = (item: HTMLElement) => {
  const next = item.nextElementSibling as HTMLElement
  if (next) {
    const top = next.offsetTop;
    (item.parentElement  as HTMLElement).scrollTo({ top: top, behavior:"smooth" });
  }
}
export const goItem = (itemVideo: HTMLElement) => {
  const item = itemVideo.parentElement as HTMLElement;
  if (!item) return;
  const top = item.offsetTop;
  (item.parentElement  as HTMLElement).scrollTo({ top: top, behavior:"smooth" });
}