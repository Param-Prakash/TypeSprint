import { useRef } from 'react';

const useSound = (src, loop = false) => {
  const soundRef = useRef(new Audio(src));
  soundRef.current.loop = loop;

  const play = () => {
    soundRef.current.currentTime = 0;
    soundRef.current.play();
  };

  const stop = () => {
    soundRef.current.pause();
    soundRef.current.currentTime = 0;
  };

  return { play, stop };
};

export default useSound;
