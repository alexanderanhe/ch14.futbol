import { useRef } from 'react';
import { useIntersectionImage } from '../hooks/useIntersectionObserver';
import styles from './image.module.css';
import Loader from './loader';

export default function Container({ _id, src, mime }: { _id: string, src: string, mime: string }) {
  const image = useRef<HTMLImageElement>(null) as ImageReference;
  const { current, loaded } = useIntersectionImage({ image, src, type: mime });
  return (
    <article className={`${styles["container"]} ${current ? 'current' : ''} ${!loaded ? 'waiting' : ''}`} data-id={ _id }>
      <img ref={image} />
      <div className={styles["controls-container"]}></div>
      <Loader />
    </article>
  )
}