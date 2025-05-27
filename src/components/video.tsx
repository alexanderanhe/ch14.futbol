import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntersectionVideo } from '../hooks/useIntersectionObserver'
import { usePreferencesContext } from '../context/preferences'
import Loader from './loader'

type VideoProps = {
  _id: string;
  title: string;
  description: string;
  video_at: string | Date;
  src: string;
  vtts: Record<string, string>;
  mime: string;
  autoPlay?: boolean;
}
export default function Video({ _id, title, description, video_at, src, vtts, mime, autoPlay }: VideoProps) {
  const video = useRef<HTMLVideoElement>(null) as VideoReference;
  const { current, ...events } = useIntersectionVideo({ title, description, video_at, video, src, type: mime });
  const [vttsBlob, setVttsBlob] = useState<string[][]>([])
  const v = async () => {
    const blobs = await Promise.all(
      Object.entries(vtts).map(async ([lang, src]) => {
        const req = await fetch(src);
        const content = await req.text();
        const blob = URL.createObjectURL(
          new Blob([content], {
            type: "text/vtt",
            endings: 'native',
          })
        );
        return [lang, blob]
      })
    );
    setVttsBlob(blobs);
  }

  useEffect(() => {
    v();
    if  (current) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      }
    }
  }, [video.current]);

  function handleKeyDown(event: KeyboardEvent) {
    const tagName = document.activeElement?.tagName.toLowerCase()
    const { togglePlay, toggleFullScreenMode, toggleTheaterMode, toggleMiniPlayerMode, toggleMute, skip, toggleCaptions } = events

    if (tagName === "input") return
    if (video.current?.paused) return

    switch (event.key.toLowerCase()) {
      case " ":
        break // if (tagName === "button") break
      case "k":
        togglePlay()
        break
      case "f":
        toggleFullScreenMode()
        break
      case "t":
        toggleTheaterMode()
        break
      case "i":
        toggleMiniPlayerMode()
        break
      case "m":
        toggleMute()
        break
      case "arrowleft":
      case "j":
        skip(-5)
        break
      case "arrowright":
      case "l":
        skip(5)
        break
      case "c":
        toggleCaptions()
        break
    }
  }
  return (
    <article className={`video-container ${current ? 'current' : ''}`} data-volume-level="high" data-id={_id}>
      <Controls video={video} {...events} />
      <video autoPlay={autoPlay} playsInline ref={video}>
        <source src={src} type="video/mp4" data-mime={ mime } />
        {vttsBlob?.map(([lang, vtt]) => (
          <track key={`vtt-${lang}`} kind="captions" srcLang={lang} src={vtt} />
        ))}
      </video>
      <Loader />
    </article>
  )
}

export function Controls({
  video,
  togglePlay,
  toggleCaptions,
  toggleMute,
}: {
  video: React.RefObject<HTMLVideoElement>,
  togglePlay: () => void,
  toggleCaptions: () => void,
  toggleMute: () => void,
}) {
  const [ , dispatch] = usePreferencesContext();
  const playPauseBtn = useRef<HTMLButtonElement>(null); // .play-pause-btn
  const theaterBtn = useRef<HTMLButtonElement>(null); // .theater-btn
  const fullScreenBtn = useRef<HTMLButtonElement>(null); // .full-screen-btn
  const miniPlayerBtn = useRef<HTMLButtonElement>(null); // .mini-player-btn
  const muteBtn = useRef<HTMLButtonElement>(null); // .mute-btn
  const captionsBtn = useRef<HTMLButtonElement>(null); // .captions-btn
  const speedBtn = useRef<HTMLButtonElement>(null); // .speed-btn
  const currentTimeElem = useRef<HTMLDivElement>(null); // .current-time
  const totalTimeElem = useRef<HTMLDivElement>(null); // .total-time
  const previewImg = useRef<HTMLImageElement>(null); // .preview-img
  const thumbnailImg = useRef<HTMLImageElement>(null); // .thumbnail-img
  const volumeSlider = useRef<HTMLInputElement>(null); // .volume-slider
  const timelineContainer = useRef<HTMLDivElement>(null); // .timeline-container

  const videoLoadedDataHandler = useCallback(() => {
    if (video.current?.duration && totalTimeElem.current) {
      totalTimeElem.current.textContent = formatDuration(video.current?.duration ?? 0);
    }
    if (video.current?.textTracks.length) {
      const captions = video.current.textTracks[0];
      captions.mode = "hidden";
    }
  }, [video.current?.duration, totalTimeElem.current]);
  const changePlaybackSpeed = useCallback(() => {
    if (!video.current || !speedBtn.current) return;
    let newPlaybackRate = video.current.playbackRate + 0.25
    if (newPlaybackRate > 2) newPlaybackRate = 0.25
    video.current.playbackRate = newPlaybackRate
    if (speedBtn.current) speedBtn.current.textContent = `${newPlaybackRate}x`
  }, [video.current?.playbackRate, speedBtn.current]);
  const initCaptions = useCallback(() => {
    if (!captionsBtn.current) return;
    if (!video.current?.textTracks.length) {
      captionsBtn.current.style.display = "none";
    }
  }, [video.current, captionsBtn.current]);

  useEffect(() => {
    const videoTimeUpdateHandler = () => {
      if (!video.current || !currentTimeElem.current) return;
      currentTimeElem.current.textContent = formatDuration(video.current.currentTime);
      const percent = video.current.currentTime / video.current.duration;
      timelineContainer.current?.style.setProperty("--progress-position", `${isNaN(percent) ? 0 : percent}`)
    };
    playPauseBtn.current?.addEventListener("click", togglePlay);
    speedBtn.current?.addEventListener("click", changePlaybackSpeed);
    captionsBtn.current?.addEventListener("click", toggleCaptions);
    muteBtn.current?.addEventListener("click", toggleMute);
    volumeSlider.current?.addEventListener("input", handleVolumeInput);
    video.current?.addEventListener("timeupdate", videoTimeUpdateHandler, true);
    video.current?.addEventListener("volumechange", handleVolume, true);
    videoLoadedDataHandler();
    initCaptions();
    
    return () => {
      playPauseBtn.current?.removeEventListener("click", togglePlay);
      speedBtn.current?.removeEventListener("click", changePlaybackSpeed);
      captionsBtn.current?.removeEventListener("click", toggleCaptions);
      muteBtn.current?.removeEventListener("click", toggleMute);
      volumeSlider.current?.removeEventListener("input", handleVolumeInput);
      video.current?.removeEventListener("timeupdate", videoTimeUpdateHandler, true);
      video.current?.removeEventListener("volumechange", handleVolume, true);
    }
  }, [
    playPauseBtn.current,
    speedBtn.current,
    videoLoadedDataHandler,
    initCaptions,
    video.current,
  ]);

  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  })
  function formatDuration(time: number) {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)
    if (hours === 0) {
      return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
      return `${hours}:${leadingZeroFormatter.format(
        minutes
      )}:${leadingZeroFormatter.format(seconds)}`
    }
  }
  function handleVolume() {
    if (!video.current || !volumeSlider.current) return;
    const volume = video.current.volume;
    volumeSlider.current.value = `${volume}`;
    let volumeLevel;
    if (video.current.muted || volume === 0) {
      volumeSlider.current.value = '0';
      volumeLevel = "muted";
    } else if (volume >= 0.5) {
      volumeLevel = "high";
    } else {
      volumeLevel = "low";
    }
    if (video.current.parentElement) {
      video.current.parentElement.dataset.volumeLevel = volumeLevel
    }
  }
  function handleVolumeInput(event: Event) {
    if (video.current) {
      const value = (event as unknown as React.ChangeEvent<HTMLInputElement>).target.value;
      video.current.volume = parseFloat(value ?? 0)
      dispatch({ type: "SET_VOLUME", payload: parseFloat(value) });
      if (value === '0') {
        video.current.muted = value === '0'
        dispatch({ type: "TOGGLE_MUTED" });
      }
    }
  }
  return (
    <>
      <div className="thumbnail-img" ref={thumbnailImg}></div>
      <div className="absolute bottom-0 flex justify-end w-full font-monka opacity-40 hover:opacity-100 p-2">ch14</div>
      <div className="video-controls-container">
        <div className="timeline-container" ref={timelineContainer}>
          <div className="timeline">
            <img className="preview-img" ref={previewImg} />
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
            <input className="volume-slider" type="range" min="0" max="1" step="any" defaultValue={video.current?.volume} ref={volumeSlider} />
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
    </>
  )
}