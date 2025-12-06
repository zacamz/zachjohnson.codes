import { useCallback, useRef } from 'react';
import AsciiMotionAnimation from './ascii-motion-animation';

function WaveGif() {
  const playbackRef = useRef(null);
  const handleReady = useCallback((api) => {
    playbackRef.current = api;
  }, []);

  return (
    <div>
      <AsciiMotionAnimation
        autoPlay={true}
        onReady={handleReady}
      />
    </div>
  );
}
export default WaveGif;