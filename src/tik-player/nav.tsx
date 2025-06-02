import { useEffect, useRef, useState } from "react"
import { usePreferencesContext } from "../tik-player/context/preferences";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { ChevronUpIcon, ChevronDownIcon, ArrowPathIcon, ArrowLongDownIcon, HeartIcon } from '@heroicons/react/24/outline';
import { nextItem, prevItem } from ".";
import classNames from "classnames";

export default function Nav() {
  const [ { loop, config }, dispatch] = usePreferencesContext();
  const [like, setLike] = useState<boolean>(false);
  const nav = useRef<HTMLDivElement>(null); // .nav
  const buttonUp = useRef<HTMLButtonElement>(null); // .nav button#up
  const buttonDown = useRef<HTMLButtonElement>(null); // .nav button#down
  const buttonLike = useRef<HTMLButtonElement>(null); // .nav button#like
  const buttonScrollDown = useRef<HTMLButtonElement>(null); // .nav button#scroll-down
  const colapsePanel = useRef<HTMLButtonElement>(null); // .nav button#scroll-down
  
  const fetchSimulate = async (like: boolean) => {
    try {
      buttonLike.current?.classList.add("disabled");
      const d = await new Promise((resolve, reject) => {
        setTimeout(() => Math.floor(Math.random() * 10) < 8 ? reject() : resolve(like), 500);
      });
      console.log("LIKE", d);
    } catch {
      console.log("UNDO LIKE");
      setLike(like => !like);
    } finally {
      buttonLike.current?.classList.remove("disabled");
    }
  }

  useEffect(() => {
    buttonUp.current?.addEventListener("click", prev);
    buttonDown.current?.addEventListener("click", next);
    buttonLike.current?.addEventListener("click", handleLike);
    buttonScrollDown.current?.addEventListener("click", handleAutoPlay);
    colapsePanel.current?.addEventListener("click", handleColapsePanel);
    return () => {
      buttonUp.current?.removeEventListener("click", prev);
      buttonDown.current?.removeEventListener("click", next);
      buttonLike.current?.removeEventListener("click", handleLike);
      buttonScrollDown.current?.removeEventListener("click", handleAutoPlay);
      colapsePanel.current?.removeEventListener("click", handleColapsePanel);
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
    dispatch({ type: "TOGGLE_LOOP" });
  }
  function handleColapsePanel() {
    dispatch({ type: "TOGGLE_PANEL" });
  }
  function handleLike() {
    console.log("SET LIKE", like)
    setLike(like => !like);
    fetchSimulate(like);
  }

  return (
    <div className="nav" ref={nav}>
      <button id="up" ref={buttonUp}>
        <ChevronUpIcon className="size-4" />
      </button>
      <button id="down" ref={buttonDown}>
        <ChevronDownIcon className="size-4" />
      </button>
      <button id="like" ref={buttonLike}>
        {like ? <HeartIconSolid className="size-4" /> : <HeartIcon className="size-4" />}
      </button>
      <button id="scroll-down" ref={buttonScrollDown}>
        { loop ? <ArrowPathIcon className="size-4" /> : <ArrowLongDownIcon className="size-4" /> }
      </button>
      <button id="colapse_panel" ref={colapsePanel} className={classNames([
        !config.panel_exist && "hidden"
      ])}>
        {config.panel ? <ChevronDoubleRightIcon className="size-4" /> : <ChevronDoubleLeftIcon className="size-4" /> }
      </button>
    </div>
  )
}