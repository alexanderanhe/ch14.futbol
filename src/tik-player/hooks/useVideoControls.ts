import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePreferencesContext } from '../context/preferences';
import type { VideoData } from '../types';

export default function useVideoControls(
  videoRef: React.RefObject<HTMLVideoElement>,
  isIntersecting: boolean,
  data: VideoData,
) {
  const playPauseBtn = useRef<HTMLButtonElement>(null); // .play-pause-btn
  const theaterBtn = useRef<HTMLButtonElement>(null); // .theater-btn
  const fullScreenBtn = useRef<HTMLButtonElement>(null); // .full-screen-btn
  const miniPlayerBtn = useRef<HTMLButtonElement>(null); // .mini-player-btn
  const muteBtn = useRef<HTMLButtonElement>(null); // .mute-btn
  const captionsBtn = useRef<HTMLButtonElement>(null); // .captions-btn
  const speedBtn = useRef<HTMLButtonElement>(null); // .speed-btn
  const currentTimeElem = useRef<HTMLDivElement>(null); // .current-time
  const totalTimeElem = useRef<HTMLDivElement>(null); // .total-time
  const previewImg = useRef<HTMLDivElement>(null); // .preview-img
  const thumbnailImg = useRef<HTMLImageElement>(null); // .thumbnail-img
  const volumeSlider = useRef<HTMLInputElement>(null); // .volume-slider
  const timelineContainer = useRef<HTMLDivElement>(null); // .timeline-container
  
  const [preferences, dispatch] = usePreferencesContext();
  const [lazy, setLazy] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  let isScrubbing = false;
  let wasPaused = false;

  // Movement actions
  const next = () => nextItem(videoRef.current.parentElement as HTMLElement);
  // const prev = () => prevItem(videoRef.current.parentElement as HTMLElement);

  // Play / pause actions
  const eventListenerPlay = () => {
    videoRef.current.parentElement?.classList.remove("paused");
    setIsPlaying(true);
  }
  const eventListenerPause = () => {
    videoRef.current.parentElement?.classList.add("paused");
    videoRef.current.parentElement?.classList.toggle("waiting", false);
    setIsPlaying(false);
  }
  const togglePlay = () => {
    const { current: videoEl } = videoRef
    if (!videoEl.paused) { videoEl.pause() } else videoEl.play();
  };
  const toggleWaiting = () => {
    videoRef.current.parentElement?.classList
      .toggle("waiting", videoRef.current.readyState < 3)
  }
  const videoTimeUpdateHandler = () => {
    if (!videoRef.current || !currentTimeElem.current) return;
    currentTimeElem.current.textContent = formatDuration(videoRef.current.currentTime);
    const percent = videoRef.current.currentTime / videoRef.current.duration;
    timelineContainer.current?.style.setProperty("--progress-position", `${isNaN(percent) ? 0 : percent}`)
  };

  // Volume actions
  const handleVolume = () => {
    if (!videoRef.current || !volumeSlider.current) return;
    const volume = videoRef.current.volume;
    volumeSlider.current.value = `${volume}`;
    let volumeLevel;
    if (videoRef.current.muted || volume === 0) {
      volumeSlider.current.value = '0';
      volumeLevel = "muted";
    } else if (volume >= 0.5) {
      volumeLevel = "high";
    } else {
      volumeLevel = "low";
    }
    if (videoRef.current.parentElement) {
      videoRef.current.parentElement.dataset.volumeLevel = volumeLevel
    }
  }
  const handleVolumeInput = (event: Event) => {
    if (videoRef.current) {
      const value = (event as unknown as React.ChangeEvent<HTMLInputElement>).target.value;
      videoRef.current.volume = parseFloat(value ?? 0)
      dispatch({ type: "SET_VOLUME", payload: parseFloat(value) });
      if (value === '0') {
        videoRef.current.muted = value === '0'
        dispatch({ type: "TOGGLE_MUTED" });
      } else {
        dispatch({ type: "TOGGLE_MUTED", payload: false });
      }
    }
  }
  const toggleMute = () => {
    // videoRef.current.muted = !videoRef.current.muted
    dispatch({ type: "TOGGLE_MUTED" })
  }
  const handleEnded = useCallback(() => {
    if (!preferences.loop
        && videoRef.current.parentElement?.nextElementSibling) {
      if (!fullscreen) next();
    }
    console.log({loop: preferences.loop, fullscreen})
  }, [preferences.loop])

  // buttons controls
  const handlePlaybackSpeed = () => {
    if (!videoRef.current || !speedBtn.current) return;
    let newPlaybackRate = videoRef.current.playbackRate + 0.25
    if (newPlaybackRate > 2) newPlaybackRate = 0.25
    videoRef.current.playbackRate = newPlaybackRate
    if (speedBtn.current) speedBtn.current.textContent = `${newPlaybackRate}x`
  }
  const toggleCaptions = () => {
    const captions = videoRef.current.textTracks[0]
    const isHidden = captions.mode === "hidden"
    captions.mode = isHidden ? "showing" : "hidden"
    videoRef.current.parentElement?.classList.toggle("captions", isHidden)
  }

  // Timeline handlers
  const toggleScrubbing = (e: MouseEvent) => {
    const videoEl = videoRef.current as HTMLVideoElement;
    const videoContainer = videoEl?.parentElement;

    const rect = timelineContainer.current?.getBoundingClientRect()
    if (!rect || !videoEl) return;
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    isScrubbing = (e.buttons & 1) === 1;
    videoContainer?.classList.toggle("scrubbing", isScrubbing)
    if (isScrubbing) {
      wasPaused = videoEl?.paused;
      videoEl.pause()
    } else {
      videoEl.currentTime = percent * videoRef.current?.duration
      if (!wasPaused) videoRef.current?.play()
    }
    handleTimelineUpdate(e)
  }
  const handleTimelineUpdate = (e: MouseEvent) => {
    const videoEl = videoRef.current as HTMLVideoElement;
    const videoContainer = videoEl?.parentElement;
    if (!videoContainer || !data.thumbnails) return;
    const { resolution, total } = data.thumbnails;
    const [width, height] = resolution.split('x');

    const rect = timelineContainer.current?.getBoundingClientRect()
    if (!rect || !videoEl) return;
    const percent = isNaN(Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width)
      ? 0 : Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width
    const previewImgNumber = Math.max(
      1,
      Math.floor(percent * (total + 1))
    )
    if (!previewImg.current) return;
    const previewImgEl = previewImg.current;
    previewImgEl.style.setProperty("--w", `${width}px`);
    previewImgEl.style.setProperty("--w", `${width}px`);
    previewImgEl.style.setProperty("--h", `${height}px`);
    previewImgEl.style.setProperty("--p", `${previewImgNumber}`);
    timelineContainer.current?.style.setProperty("--preview-position", `${percent}`)

    if (isScrubbing && thumbnailImg.current) {
      const thumbnailImgEl = thumbnailImg.current;
      e.preventDefault()
      thumbnailImgEl.style.setProperty("--w", `${width}px`);
      thumbnailImgEl.style.setProperty("--w", `${width}px`);
      thumbnailImgEl.style.setProperty("--h", `${height}px`);
      thumbnailImgEl.style.setProperty("--p", `${previewImgNumber}`);
      timelineContainer.current?.style.setProperty("--progress-position", `${percent}`)
    }
  }

  // Video size handlers
  const toggleFullscreenChange = () => {
    videoRef.current.parentElement?.classList.toggle("fullscreen", document.fullscreenElement != null)
  }
  const togglePictureInPicture = () => {
    videoRef.current.parentElement?.classList.toggle("mini-player")
  }
  const toggleMiniPlayerMode = () => {
    if (videoRef.current.parentElement?.classList.contains("mini-player")) {
      document.exitPictureInPicture()
    } else {
      videoRef.current.requestPictureInPicture()
    }
  }
  const toggleFullScreenMode = () => {
    const videoEl = videoRef.current as HTMLVideoElement;
    const videoContainer = videoEl?.parentElement;
    if (!fullscreen) {
      videoContainer?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }
  const handleFullScreenChange = () => {
    setFullscreen(!!document.fullscreenElement);
  }
  const handleVideoLoaded = () => {
    if (!videoRef.current) return
    const videoEl = videoRef.current;
    if (videoEl.duration && totalTimeElem.current) {
      totalTimeElem.current.textContent = formatDuration(videoEl?.duration ?? 0);
    }
    if (!videoEl.textTracks.length && captionsBtn.current) {
      captionsBtn.current.style.display = "none";
    }
    if (videoEl.textTracks.length) {
      const captions = videoEl.textTracks[0];
      captions.mode = "hidden";
    }
  }
  const handleDblclick = () => {
    console.log("DOUBLE CLICK");
  }

  useEffect(() => {
    if (!videoRef.current) return
    const videoEl = videoRef.current;
    const videoContainer = videoEl?.parentElement;

    // playing
    videoEl.addEventListener("click", togglePlay, true);
    videoEl.addEventListener("play", eventListenerPlay, true);
    videoEl.addEventListener("pause", eventListenerPause, true);
    playPauseBtn.current?.addEventListener("click", togglePlay);
    videoEl.addEventListener("waiting", toggleWaiting, true);
    videoEl.addEventListener("playing", toggleWaiting, true);
    videoEl.addEventListener("ended", handleEnded, true);
    videoEl.addEventListener("timeupdate", videoTimeUpdateHandler, true);

    // volume
    muteBtn.current?.addEventListener("click", toggleMute);
    volumeSlider.current?.addEventListener("input", handleVolumeInput);
    videoEl?.addEventListener("volumechange", handleVolume, true);

    // button controls
    speedBtn.current?.addEventListener("click", handlePlaybackSpeed);
    captionsBtn.current?.addEventListener("click", toggleCaptions);

    // Timeline handlers
    timelineContainer.current?.addEventListener("mousemove", handleTimelineUpdate)
    timelineContainer.current?.addEventListener("mousedown", toggleScrubbing)
    videoContainer?.addEventListener("mouseup", e => isScrubbing && toggleScrubbing(e))
    videoContainer?.addEventListener("mousemove", e => isScrubbing && handleTimelineUpdate(e))

    // Video size handlers
    fullScreenBtn.current?.addEventListener("click", toggleFullScreenMode)
    miniPlayerBtn.current?.addEventListener("click", toggleMiniPlayerMode)
    videoEl.addEventListener("fullscreenchange", toggleFullscreenChange, true);
    videoEl.addEventListener("enterpictureinpicture", togglePictureInPicture, true);
    videoEl.addEventListener("leavepictureinpicture", togglePictureInPicture, true);
    videoEl.addEventListener("loadeddata", handleVideoLoaded);
    videoEl.addEventListener("dblclick", handleDblclick);

    // document
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    // document.addEventListener("keydown", handleKeyDown);

    return () => {
      // playing
      videoEl.removeEventListener("click", togglePlay, true);
      videoEl.removeEventListener("play", eventListenerPlay, true);
      videoEl.removeEventListener("pause", eventListenerPause, true);
      playPauseBtn.current?.removeEventListener("click", togglePlay);
      videoEl.removeEventListener("waiting", toggleWaiting, true);
      videoEl.removeEventListener("playing", toggleWaiting, true);
      videoEl.removeEventListener("ended", handleEnded, true);
      videoEl.removeEventListener("timeupdate", videoTimeUpdateHandler, true);

      // volume
      muteBtn.current?.removeEventListener("click", toggleMute);
      volumeSlider.current?.removeEventListener("input", handleVolumeInput);
      videoEl?.removeEventListener("volumechange", handleVolume, true);

      // button controls
      speedBtn.current?.removeEventListener("click", handlePlaybackSpeed);
      captionsBtn.current?.removeEventListener("click", toggleCaptions);

      // Timeline handlers
      timelineContainer.current?.removeEventListener("mousemove", handleTimelineUpdate)
      timelineContainer.current?.removeEventListener("mousedown", toggleScrubbing)
      videoContainer?.removeEventListener("mouseup", e => isScrubbing && toggleScrubbing(e))
      videoContainer?.removeEventListener("mousemove", e => isScrubbing && handleTimelineUpdate(e))

      // Video size handler
      fullScreenBtn.current?.removeEventListener("click", toggleFullScreenMode)
      miniPlayerBtn.current?.removeEventListener("click", toggleMiniPlayerMode)
      videoEl.removeEventListener("fullscreenchange", toggleFullscreenChange, true);
      videoEl.removeEventListener("enterpictureinpicture", togglePictureInPicture, true);
      videoEl.removeEventListener("leavepictureinpicture", togglePictureInPicture, true);
      videoEl.removeEventListener("loadeddata", handleVideoLoaded);
      videoEl.removeEventListener("dblclick", handleDblclick);

      // document
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      // document.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleEnded]);

  const fetchTracks = async (target: HTMLTrackElement) => {
    const src = target.dataset.src ?? target.src;
    const req = await fetch(src);
    const content = await req.text();
    const blob = URL.createObjectURL(
      new Blob([content], { type: "text/vtt", endings: 'native',})
    );
    target.src = blob;
  }

  useEffect(() => {
    if (!videoRef.current) return
    const videoEl = videoRef.current;
    if (isIntersecting) {
      if (!lazy) {
        for (const child in videoEl.children) {
          const videoChild = videoEl.children[child] as HTMLSourceElement | HTMLTrackElement;
          if (typeof videoChild.tagName === 'string' && videoChild.tagName === 'SOURCE') {
            videoChild.src = `${videoChild.dataset.src}`;
          } else if (typeof videoChild.tagName === 'string' && videoChild.tagName === 'TRACK') {
            fetchTracks(videoChild as HTMLTrackElement);
          }
        }
        setLazy(true);
        videoEl.load();
      }
      videoEl.currentTime = 0;
      videoEl.play();
    } else videoEl.pause()
  }, [isIntersecting])

  useEffect(() => {
    if (!videoRef.current) return
    const videoEl = videoRef.current;
    videoEl.loop = preferences.loop;
    videoEl.muted = preferences.muted;
    videoEl.volume = preferences.volume;
  }, [videoRef, preferences]);

  useEffect(() => {
    if (!videoRef.current) return
    const videoEl = videoRef.current;
    videoEl.poster = data.poster ?? '';
  }, [])

  return {
    playPauseBtn,
    theaterBtn,
    fullScreenBtn,
    miniPlayerBtn,
    muteBtn,
    captionsBtn,
    speedBtn,
    currentTimeElem,
    totalTimeElem,
    previewImg,
    thumbnailImg,
    volumeSlider,
    timelineContainer,
    isPlaying
  }
}

// function prevItem (item: HTMLElement) {
//   const next = item.previousElementSibling as HTMLElement
//   if (next) {
//     const top = next.offsetTop;
//     (item.parentElement  as HTMLElement).scrollTo({ top: top, behavior:"smooth" });
//   }
// }
function nextItem (item: HTMLElement) {
  const next = item.nextElementSibling as HTMLElement
  if (next) {
    const top = next.offsetTop;
    (item.parentElement  as HTMLElement).scrollTo({ top: top, behavior:"smooth" });
  }
}

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