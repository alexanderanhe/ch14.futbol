import { useEffect, useState } from 'react'
import { usePreferencesContext } from '../context/preferences'

type UseIntersectionVideoProps = {
  video: VideoReference;
  videoContainer: VideoContainerReference;
  videoData: Media;
}
type UseIntersectionImageProps = {
  image: ImageReference
  src: string
  type: string
  timeout?: number
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.9
}

let observer: IntersectionObserver | null = null;
// let currPath: string = "";
const isClient = typeof window !== "undefined";
if (isClient) {
  // currPath = window.location.pathname.split("/").slice(0, 2).join("/");
  observer = new window.IntersectionObserver((entries) => {
    entries
      .forEach(entry => {
        const target = entry.target as (HTMLVideoElement | HTMLImageElement | Element) & IntersectionObserverFunction
        const { isIntersecting } = entry
        if (target._handleIntersect) {
          target._handleIntersect(isIntersecting);
          // isIntersecting && window.history.pushState({}, "", `${currPath}/${target.parentElement?.dataset.id ?? ""}`)
        }
      })
  }, options)
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

export function useIntersectionVideo ({ video, videoContainer, videoData }: UseIntersectionVideoProps) {
  const [preferences, dispatch] = usePreferencesContext();
  const [playing, setPlaying] = useState<boolean>(false);
  const [current, setCurrent] = useState<boolean>(false);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [wasPaused, setWasPaused] = useState<boolean>(false);
  const { title, description, thumbnails} = videoData;

  const next = () => nextItem(video.current.parentElement as HTMLElement);
  const prev = () => prevItem(video.current.parentElement as HTMLElement);

  useEffect(() => {
    if (!video.current) return
    const videoEl = video.current;
    const timelineContainer = videoContainer.current.querySelector(".timeline-container") as HTMLDivElement;

    observer?.observe(videoEl)
    videoEl._handleIntersect = (isIntersecting: boolean) => {
      const { current: videoEl } = video
      if (isIntersecting) {
        videoEl.play();
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title,
            // artist: "Podcast Host",
            album: description,
            artwork: [{ src: videoEl.poster }],
          });
        }
      } else videoEl.pause();
      videoEl.parentElement?.classList.toggle("current", isIntersecting);
      setCurrent(isIntersecting);
    }

    videoEl.addEventListener("click", togglePlay, true);
    videoEl.addEventListener("play", eventListenerPlay, true);
    videoEl.addEventListener("pause", eventListenerPause, true);
    videoEl.addEventListener("waiting", toggleWaiting, true);
    videoEl.addEventListener("playing", toggleWaiting, true);
    videoEl.addEventListener("ended", handleEnded, true);
    videoEl.addEventListener("fullscreenchange", toggleFullscreenChange, true);
    videoEl.addEventListener("enterpictureinpicture", togglePictureInPicture, true);
    videoEl.addEventListener("leavepictureinpicture", togglePictureInPicture, true);
    timelineContainer?.addEventListener("mousemove", handleTimelineUpdate)
    timelineContainer?.addEventListener("mousedown", toggleScrubbing)
    videoContainer.current.addEventListener("mouseup", e => isScrubbing && toggleScrubbing(e))
    videoContainer.current.addEventListener("mousemove", e => isScrubbing && handleTimelineUpdate(e))
    return () => {
      videoEl.removeEventListener("click", togglePlay, true);
      videoEl.removeEventListener("play", eventListenerPlay, true);
      videoEl.removeEventListener("pause", eventListenerPause, true);
      videoEl.removeEventListener("waiting", toggleWaiting, true);
      videoEl.removeEventListener("playing", toggleWaiting, true);
      videoEl.removeEventListener("ended", handleEnded, true);
      videoEl.removeEventListener("fullscreenchange", toggleFullscreenChange, true);
      videoEl.removeEventListener("enterpictureinpicture", togglePictureInPicture, true);
      videoEl.removeEventListener("leavepictureinpicture", togglePictureInPicture, true);
      timelineContainer?.removeEventListener("mousemove", handleTimelineUpdate)
      timelineContainer?.removeEventListener("mousedown", toggleScrubbing)
      videoContainer.current?.removeEventListener("mouseup", e => {
        if (isScrubbing) toggleScrubbing(e)
      })
      videoContainer.current?.removeEventListener("mousemove", e => {
        if (isScrubbing) handleTimelineUpdate(e)
      })
    }
  }, [video.current]);

  useEffect(() => {
    if (video.current) {
      video.current.loop = !preferences.autoPlay;
      video.current.muted = preferences.muted;
      video.current.volume = preferences.volume;
    }
  }, [video.current, preferences]);

  function toggleMute() {
    // video.current.muted = !video.current.muted
    dispatch({ type: "TOGGLE_MUTED" })
  }
  function eventListenerPlay() {
    video.current.parentElement?.classList.remove("paused");
    setPlaying(true);
  }
  function togglePlay() {
    const { current: videoEl } = video
    console.log("CLICK", playing)
    if (playing) {
      videoEl.pause()
    } else videoEl.play()
  };
  function eventListenerPause() {
    video.current.parentElement?.classList.add("paused");
    video.current.parentElement?.classList.toggle("waiting", false);
    setPlaying(false);
  }
  function toggleMiniPlayerMode() {
    if (video.current.parentElement?.classList.contains("mini-player")) {
      document.exitPictureInPicture()
    } else {
      video.current.requestPictureInPicture()
    }
  }
  function toggleTheaterMode() {
    video.current.parentElement?.classList.toggle("theater")
  }
  function toggleFullScreenMode() {
    if (document.fullscreenElement == null) {
      video.current.parentElement?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
  function toggleWaiting() {
    video.current.parentElement?.classList
      .toggle("waiting", video.current.readyState < 3)
  }
  function toggleFullscreenChange() {
    video.current.parentElement?.classList.toggle("fullscreen", document.fullscreenElement != null)
  }
  function togglePictureInPicture() {
    video.current.parentElement?.classList.toggle("mini-player")
  }
  function toggleCaptions() {
    const captions = video.current.textTracks[0]
    const isHidden = captions.mode === "hidden"
    captions.mode = isHidden ? "showing" : "hidden"
    video.current.parentElement?.classList.toggle("captions", isHidden)
  }
  function handleEnded() {
    if (preferences.autoPlay && video.current.parentElement?.nextElementSibling) {
      next();
    }
  }
  function skip(duration: number) {
    video.current.currentTime += duration
  }

  function toggleScrubbing(e: MouseEvent) {
    if (!videoContainer.current) return;
    const videoContainerEl = videoContainer.current;
    const videoEl = video.current as HTMLVideoElement;
    const timelineContainer = videoContainerEl.querySelector(".timeline-container") as HTMLDivElement

    const rect = timelineContainer?.getBoundingClientRect()
    if (!rect || !videoEl) return;
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    setIsScrubbing((e.buttons & 1) === 1)
    videoContainerEl.classList.toggle("scrubbing", isScrubbing)
    if (isScrubbing) {
      setWasPaused(videoEl?.paused);
      videoEl.pause()
    } else {
      videoEl.currentTime = percent * video.current?.duration
      if (!wasPaused) video.current?.play()
    }
    handleTimelineUpdate(e)
  }

  function handleTimelineUpdate(e: MouseEvent) {
    console.log(thumbnails)
    if (!videoContainer.current || !thumbnails) return;
    const videoContainerEl = videoContainer.current;
    const previewImg = videoContainerEl.querySelector(".preview-img") as HTMLDivElement;
    const thumbnailImg = videoContainerEl.querySelector(".thumbnail-img") as HTMLImageElement;
    const timelineContainer = videoContainerEl.querySelector(".timeline-container") as HTMLDivElement
    const [thumbnail] = thumbnails;
    const { image: prevImageSource, resolution, total} = thumbnail;
    const [width, height] = resolution.split('x');

    const rect = timelineContainer?.getBoundingClientRect()
    if (!rect || !video.current) return;
    const percent = isNaN(Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width)
      ? 0 : Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    const previewImgNumber = Math.max(
      1,
      Math.floor(percent * (total + 1))
    )

    previewImg.style.backgroundImage = prevImageSource;
    previewImg.style.setProperty("--w", `${width}px`);
    previewImg.style.setProperty("--w", `${width}px`);
    previewImg.style.setProperty("--h", `${height}px`);
    previewImg.style.setProperty("--p", `${previewImgNumber}`);
    timelineContainer.style.setProperty("--preview-position", `${percent}`)

    if (isScrubbing) {
        e.preventDefault()
        thumbnailImg.style.backgroundImage = prevImageSource;
        thumbnailImg.style.setProperty("--w", `${width}px`);
        thumbnailImg.style.setProperty("--w", `${width}px`);
        thumbnailImg.style.setProperty("--h", `${height}px`);
        thumbnailImg.style.setProperty("--p", `${previewImgNumber}`);
        timelineContainer?.style.setProperty("--progress-position", `${percent}`)
      }
  }

  return {
    playing,
    current,
    next,
    prev,
    skip,
    togglePlay,
    toggleMute,
    toggleMiniPlayerMode,
    toggleTheaterMode,
    toggleFullScreenMode,
    toggleWaiting,
    toggleFullscreenChange,
    togglePictureInPicture,
    toggleCaptions,
    handleEnded,
  }
}

export function useIntersectionImage ({ image, timeout }: UseIntersectionImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [current, setCurrent] = useState(false);
  const next = () => nextItem(image.current.parentElement as HTMLElement);
  const prev = () => prevItem(image.current.parentElement as HTMLElement);
  const [preferences] = usePreferencesContext();

  useEffect(() => {
    if (!image.current) return
    let timer: ReturnType<typeof setTimeout>;
    observer?.observe(image.current)
    image.current._handleIntersect = (isIntersecting) => {
      const { current: imageEl } = image;
      imageEl.parentElement?.classList.toggle("current", isIntersecting);
      setCurrent(isIntersecting);
      if (isIntersecting) {
        setLoaded(true);
        if (preferences.autoPlay) {
          timer = setTimeout(() => {
            if (imageEl?.parentElement && imageEl.parentElement.nextElementSibling) {
              next();
            }
          }, timeout ?? 10000);
        } else {
          clearTimeout(timer);
        }
      }
    }
    const errorHandle = () => image.current?.parentElement?.classList.add('error');
    image.current.addEventListener("load", () => toggleLoaded, true);
    image.current?.addEventListener("error", () => errorHandle, true);
    return () => {
      image.current?.removeEventListener("load", () => toggleLoaded, true);
      image.current?.removeEventListener("error", () => errorHandle, true);
      clearTimeout(timer)
    };
  }, [image.current]);
  
  function toggleLoaded() {
    setLoaded(!loaded)
  }
  return {
    loaded,
    current,
    prev,
    next,
  }
}