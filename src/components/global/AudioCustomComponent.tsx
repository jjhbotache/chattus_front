import { useState, useRef, useEffect } from 'react';
import {  motion } from 'framer-motion';
import styled from 'styled-components';
import { colors } from '../../globalStyle';

export default function AudioCustomComponent({src}:{src:string}) {
  // State variables
  const [isPlaying, setIsPlaying] = useState(false); // Indicates whether the audio is currently playing or not
  const [progress, setProgress] = useState(0); // Represents the progress of the audio playback
  const [currentTime, setCurrentTime] = useState('0:00'); // Represents the current time of the audio playback
  const [duration, setDuration] = useState('0:00');

  // Reference to the audio element
  const audioComponentRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add event listeners when the component mounts
    if (audioComponentRef.current) {
      audioComponentRef.current.addEventListener('timeupdate', updateProgress); // Update the progress of the audio playback
      updateDuration();
      return () => {
        // Remove event listeners when the component unmounts
        audioComponentRef.current?.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  // Toggle play/pause of the audio
  const togglePlayPause = () => {
    if (audioComponentRef.current) {
      if (isPlaying) {
        audioComponentRef.current.pause();
      } else {
        audioComponentRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateProgress = () => {
    if (audioComponentRef.current) {
      const currentProgress = (audioComponentRef.current.currentTime / audioComponentRef.current.duration) * 100;
      setCurrentTime(formatTime(audioComponentRef.current.currentTime));
      setProgress(currentProgress);
      
      updateDuration();
    }

    // If the audio has finished playing, reset the progress and time
    if (
      audioComponentRef.current &&
      audioComponentRef.current.currentTime === audioComponentRef.current.duration
    ) {
      setProgress(0);
      setCurrentTime('0:00');
      setIsPlaying(false);
    }
  };

  const resetAudOnSpecificSecond = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } }
  ) => {
    // Calculate the second where the user released the progress indicator
    if (!progressBarRef.current || !audioComponentRef.current) return;
    const progressBarWidth = progressBarRef.current?.offsetWidth;
    const sgsInPx = progressBarWidth! / audioComponentRef.current.duration;

    
    const secondsMoved = info.offset.x / sgsInPx;
    
    const currentSecond = audioComponentRef.current.currentTime + secondsMoved;

    audioComponentRef.current.currentTime = currentSecond;
    audioComponentRef.current.play();
    setIsPlaying(true);
    setProgress((currentSecond / audioComponentRef.current.duration) * 100);
    setCurrentTime(formatTime(currentSecond));
  };


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (audioComponentRef.current) {
      isPlaying 
        ? audioComponentRef.current.play()
        : audioComponentRef.current.pause();
    }
    
  }, [isPlaying]);

  return (
    <AudioContainer>
      <audio ref={audioComponentRef} src={src} />
      <div className="controls">
        <motion.button
          whileTap={{ scale: 1.5 }}
          onClick={togglePlayPause}
          className="play-pause-button"
        >
          {isPlaying ? 
            <i className="fi fi-sr-stop" /> :
            <i className="fi fi-sr-play" />
          }
        </motion.button>
        <div className="progress-bar" ref={progressBarRef}>
          <motion.div 
            
            className="progress"
            style={{ 
              width: `${progress}%`, 
            }}
          >
            <motion.div
              className="progress-indicator"
              drag="x"
              whileDrag={{ scale: 2 }}
              onDragStart={() => setIsPlaying(false)}
              onDragEnd={resetAudOnSpecificSecond}
              dragElastic={0}
              dragSnapToOrigin={true}
            />
          </motion.div>
        </div>
      </div>
      <div className="time-info">
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>
    </AudioContainer>
  );

  function updateDuration() {
    if (audioComponentRef.current && audioComponentRef.current.duration) {  
      audioComponentRef.current.duration != Infinity
        ? setDuration(formatTime(audioComponentRef.current.duration))
        : setDuration('0:00');
    }
  }
}


const AudioContainer = styled.div`
  width: 300px;
  max-width: 100%;
  box-sizing: border-box;
  padding: 10px;
  background-color: #282c34;
  border-radius: 8px;

  i{
    color: ${colors.shadow};
  }

  .controls {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .play-pause-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-right: 10px;
  }

  .progress-bar {
    flex: 1;
    height: 4px;
    background-color: #4f4f4f;
    border-radius: 2px;
    position: relative;
  }

  .progress {
    width: 100%;
    height: 100%;
    background-color: ${colors.shadow};
    border-radius: 2px;
    position: relative;
  }

  .progress-indicator {
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: ${colors.shadow};
    position: absolute;
    top: -150%;
    left: 0;
    
  }

  .time-info {
    display: flex;
    justify-content: space-between;
    color: #9f9f9f;
    font-size: 12px;
  }
`;