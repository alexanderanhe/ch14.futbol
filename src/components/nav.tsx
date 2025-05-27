import { useEffect, useRef } from "react"
import { usePreferencesContext } from "../context/preferences";
import { nextItem, prevItem } from "../hooks/useIntersectionObserver";
import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function FeedNav() {
  const [ { autoPlay }, dispatch] = usePreferencesContext();
  const nav = useRef<HTMLDivElement>(null); // .nav
  const buttonUp = useRef<HTMLButtonElement>(null); // .nav button#up
  const buttonDown = useRef<HTMLButtonElement>(null); // .nav button#down
  const buttonLike = useRef<HTMLButtonElement>(null); // .nav button#like
  const buttonCollage = useRef<HTMLButtonElement>(null); // .nav button#collage
  const buttonScrollDown = useRef<HTMLButtonElement>(null); // .nav button#scroll-down
  const buttonNew = useRef<HTMLButtonElement>(null); // .nav button#new

  useEffect(() => {
    buttonUp.current?.addEventListener("click", prev);
    buttonDown.current?.addEventListener("click", next);
    buttonScrollDown.current?.addEventListener("click", handleAutoPlay);
    return () => {
      buttonScrollDown.current?.removeEventListener("click", handleAutoPlay);
    }
  }, [])

  function prev() {
    const currentItem = document.querySelector(".current") as HTMLElement;
    prevItem(currentItem);
  }
  function next() {
    const currentItem = document.querySelector(".current") as HTMLElement;
    nextItem(currentItem);
  }
  function handleAutoPlay() {
    dispatch({ type: "TOGGLE_AUTOPLAY" });
  }

  return (
    <div className="nav" ref={nav}>
      <button id="up" ref={buttonUp}>
        <svg viewBox="0 0 1024 1024" className="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M903.232 768l56.768-50.432L512 256l-448 461.568 56.768 50.432L512 364.928z" fill="currentColor" /></svg>
      </button>
      <button id="down" ref={buttonDown}>
        <svg viewBox="0 0 1024 1024" className="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="currentColor" /></svg>
      </button>
      <button id="like" ref={buttonLike}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button id="scroll-down" ref={buttonScrollDown}>
        { autoPlay ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 15C5 16.8565 5.73754 18.6371 7.05029 19.9498C8.36305 21.2626 10.1435 21.9999 12 21.9999C13.8565 21.9999 15.637 21.2626 16.9498 19.9498C18.2625 18.6371 19 16.8565 19 15V9C19 7.14348 18.2625 5.36305 16.9498 4.05029C15.637 2.73754 13.8565 2 12 2C10.1435 2 8.36305 2.73754 7.05029 4.05029C5.73754 5.36305 5 7.14348 5 9V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 11L12 14L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <ArrowPathIcon className="size-7" />
        )}
      </button>
      <button id="collage" ref={buttonCollage}>
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20.954 20.954">
          <g>
            <g>
              <g>
                <path fill="currentColor" d="M20.851,7.169l-7.705-3.681c-0.09-0.042-0.197-0.004-0.24,0.084l-1.677,3.51h0.913l1.232-2.579
                  l6.679,3.191l-2.088,4.372l-1.177-0.561v2.311l0.723,0.346c0.091,0.043,0.197,0.004,0.241-0.084l3.185-6.668
                  C20.98,7.32,20.941,7.212,20.851,7.169z"/>
              </g>
              <g>
                <path fill="currentColor" d="M0.103,7.126l7.705-3.68c0.09-0.043,0.197-0.005,0.24,0.083l1.678,3.51H8.812L7.58,4.46
                  L0.901,7.651l2.089,4.372l1.176-0.561v2.311l-0.723,0.346c-0.09,0.045-0.197,0.004-0.24-0.084L0.018,7.366
                  C-0.025,7.277,0.013,7.17,0.103,7.126z"/>
              </g>
              <g>
                <path fill="currentColor" d="M16.06,7.684H5.216c-0.126,0-0.229,0.102-0.229,0.228v9.385c0,0.125,0.103,0.229,0.229,0.229
                  h10.845c0.127,0,0.229-0.104,0.229-0.229V7.912C16.29,7.786,16.187,7.684,16.06,7.684z M15.434,14.877h-0.688
                  c-0.4-1.025-0.893-2.463-1.641-2.271c-0.876,0.223-1.315,2.271-1.315,2.271s-0.446-2.311-1.683-3.549
                  c-1.238-1.237-2.437,3.549-2.437,3.549H6.033V8.723h9.401V14.877z"/>
              </g>
              <g>
                <circle fill="currentColor" cx="7.55" cy="10.042" r="0.767"/>
              </g>
              <g>
                <path fill="currentColor" d="M12.697,10.584c0.172,0,0.332-0.019,0.476-0.048c0.167,0.071,0.372,0.115,0.592,0.115
                  c0.564,0,1.023-0.276,1.023-0.616c0-0.341-0.459-0.618-1.023-0.618c-0.212,0-0.409,0.04-0.572,0.106
                  c-0.067-0.065-0.157-0.106-0.257-0.106h-0.149c-0.189,0-0.339,0.144-0.361,0.328c-0.458,0.048-0.798,0.213-0.798,0.413
                  C11.627,10.393,12.106,10.584,12.697,10.584z"/>
              </g>
            </g>
          </g>
        </svg>
      </button>
      <button id="new" ref={buttonNew}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect fill="currentColor" fillOpacity="0.01"/>
          <path d="M11.6777 20.271C7.27476 21.3181 4 25.2766 4 30C4 35.5228 8.47715 40 14 40C14.9474 40 15.864 39.8683 16.7325 39.6221" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M36.0547 20.271C40.4577 21.3181 43.7324 25.2766 43.7324 30C43.7324 35.5228 39.2553 40 33.7324 40V40C32.785 40 31.8684 39.8683 30.9999 39.6221" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M36 20C36 13.3726 30.6274 8 24 8C17.3726 8 12 13.3726 12 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.0654 27.881L23.9999 20.9236L31.1318 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24 38V24.4618" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}