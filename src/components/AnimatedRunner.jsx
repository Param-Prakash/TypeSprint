import { useEffect, useState, useRef } from 'react';
import "../styles/AnimatedRunner.css";

const frameCount = 8;
const frameDelay = 100;
const spriteWidth = 140; // Runner image width in pixels

const AnimatedRunner = ({ isRunning, progress }) => {
  const [frame, setFrame] = useState(1);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setFrame((prev) => (prev % frameCount) + 1);
      }, frameDelay);
    } else {
      setFrame(1);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  // Calculate pixel offset: move sprite from 0 to (containerWidth - spriteWidth)
  const maxOffset = containerWidth - spriteWidth;
  const runnerPosition = (progress / 100) * maxOffset;

  return (
    <div className="runner-window" ref={containerRef}>
      <img
        src={`/public/assets/runner/frame${frame}.png`}
        alt="runner"
        className="runner-sprite"
        style={{ left: `${runnerPosition}px` }}
      />
    </div>
  );
};

export default AnimatedRunner;