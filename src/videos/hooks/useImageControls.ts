import { useState } from "react"

export default function useImageControls(
  imageRef: React.RefObject<HTMLImageElement>,
  isIntersecting: boolean,
  data: ImageData
) {
  const [loaded] = useState<boolean>(false);
  return {
    loaded,
    imageRef,
    isIntersecting,
    data,
  }
}