import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Icon, Button } from '@/components/ui';
import { logo } from '@/assets';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.5, 2];

const VideoControls = ({ videoRef, setVideoDuration }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [skipValue, setSkipValue] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimerRef = React.useRef(null);


  const resetControlsTimer = useCallback(() => {
    setShowControls(true);

    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);


    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => {
        if (!isOpen) { // Don't hide if speed menu is open
          setShowControls(false);
        }
      }, 3000);
    }
  }, [isPlaying, isOpen]);


  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [isPlaying, resetControlsTimer]);



  const lastTap = React.useRef(0);

  const handleTouch = (e) => {
    resetControlsTimer();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const video = videoRef.current;
    if (!video) return;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Get horizontal position of the tap
      const touchX = e.touches[0].clientX;
      const screenWidth = window.innerWidth;

      if (touchX > screenWidth / 2) {
        // Right side double tap
        video.currentTime += 5;
        triggerSkipUI('forward');
      } else {
        // Left side double tap
        video.currentTime -= 5;
        triggerSkipUI('back');
      }
    }
    lastTap.current = now;
  };

  // --- Utilities ---
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Core Handlers ---
  const updateVolume = useCallback((newVolume) => {
    const video = videoRef.current;
    if (!video) return;
    const clampedVolume = Math.min(1, Math.max(0, newVolume));
    video.volume = clampedVolume;
    setVolume(clampedVolume);
    setIsMuted(clampedVolume === 0);
    video.muted = clampedVolume === 0;
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    const targetVolume = isMuted ? (volume > 0 ? volume : 0.5) : 0;
    updateVolume(targetVolume);
  }, [isMuted, volume, updateVolume]);

  const toggleFullscreen = useCallback(async () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();


        if (window.screen.orientation && window.screen.orientation.lock) {

          await window.screen.orientation.lock('landscape').catch(err => {
            console.warn("Orientation lock ignored: ", err.message);
          });
        }
      } else {
        await document.exitFullscreen();

        if (window.screen.orientation && window.screen.orientation.unlock) {
          window.screen.orientation.unlock();
        }
      }
    } catch (error) {
      console.error("Fullscreen/Rotation Error:", error);
    }
  }, [videoRef]);


  // Trigger skip ui 

  const triggerSkipUI = (direction) => {
    setSkipValue(direction);

    setTimeout(() => setSkipValue(null), 600);
  }

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // --- Keyboard Shortcuts ---
  useKeyboardShortcuts({
    'f': toggleFullscreen,
    ' ': togglePlay,
    'k': togglePlay,
    'm': toggleMute,
    'arrowright': () => {
      videoRef.current.currentTime += 5;
      triggerSkipUI('forward');
    },
    'arrowleft': () => {
      videoRef.current.currentTime -= 5;
      triggerSkipUI('back')
    },
    'arrowup': () => updateVolume(volume + 0.1),
    'arrowdown': () => updateVolume(volume - 0.1),
  }, [volume, isMuted, togglePlay, toggleFullscreen, toggleMute]);

  // --- Dynamic Icons ---
  const speedIcon = useMemo(() => {
    if (speed < 1) return "mdi:speedometer-slow";
    if (speed > 1) return "mdi:speedometer";
    return "mdi:speedometer-medium";
  }, [speed]);

  // --- Video Event Listeners ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    const handleSync = () => {
      setIsPlaying(!video.paused);
      setCurrentTime(video.currentTime);
      setDuration(video.duration || 0);
      setVideoDuration(video.duration)
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleFS = () => setIsFullscreen(!!document.fullscreenElement);


    const handleVisibility = () => {
      if (document.hidden && !video.paused) video.pause();
    };

    video.addEventListener('play', handleSync);
    video.addEventListener('pause', handleSync);
    video.addEventListener('timeupdate', handleSync);
    video.addEventListener('loadedmetadata', handleSync);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('volumechange', handleSync);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('seeking', handleWaiting);
    video.addEventListener('seeked', handlePlaying);
    document.addEventListener('fullscreenchange', handleFS);
    document.addEventListener('visibilitychange', handleVisibility);


    return () => {
      video.removeEventListener('play', handleSync);
      video.removeEventListener('pause', handleSync);
      video.removeEventListener('timeupdate', handleSync);
      video.removeEventListener('loadedmetadata', handleSync);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('volumechange', handleSync);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('seeking', handleWaiting);
      video.removeEventListener('seeked', handlePlaying);
      document.removeEventListener('fullscreenchange', handleFS);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [videoRef]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [isOpen]);

  return (
    <div
      onMouseMove={resetControlsTimer}
      onTouchMove={resetControlsTimer}
      className="absolute inset-0 w-full h-full overflow-hidden select-none"
      style={{ cursor: showControls ? 'default' : 'none' }}
    >

      <div
        onTouchStart={handleTouch}
        onClick={togglePlay}
        className="absolute inset-0 z-0"
      />


      {/* Buffering Spinner */}

      {isBuffering && (
        <div className="absolute inset-0 flex items-center bg-black/20 justify-center pointer-events-none z-40">
          <div className="flex flex-col items-center gap-3">
            <Icon
              name="mingcute:loading-3-fill"
              className="text-primary animate-spin"
              height="50"
              width="50"
            />
          </div>
        </div>
      )}  


      {/* skip ui */}


      {skipValue && (
        <div className='absolute inset-0 flex items-center justify-center pointer-events-none z-50'>
          <div className="flex flex-col items-center animate-out fade-out zoom-out duration-500 ease-in-out fill-mode-forwards">
            <div className="bg-black/40 p-5 rounded-full backdrop-blur-sm border border-white/10">
              <Icon
                name={skipValue === 'forward' ? "material-symbols:forward-5" : "material-symbols:replay-5"}
                className="text-white"
                height="20"
                width="20"
              />
            </div>
            <span className="text-white font-bold mt-2 drop-shadow-md">
              {skipValue === 'forward' ? '+5s' : '-5s'}
            </span>
          </div>
        </div>
      )}

      {/* controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          absolute bottom-0 left-0 right-0 z-20 
          bg-linear-to-t from-black/80 via-black/40 to-transparent 
          px-4 py-4 flex flex-col gap-2 group/controls 
          transition-all duration-300 ease-in-out
          ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
        `}
      >

        {/* Progress Bar Container */}
        <div className="relative w-full h-1 bg-white/10 flex items-center group/progress">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="any"
            value={currentTime}
            onChange={handleSeek}
            className="absolute z-30 w-full h-full appearance-none bg-transparent cursor-pointer accent-red-600"
          />

          {/* Visual Track: Buffered */}
          <div
            className="absolute z-10 h-full bg-white/30 rounded-full transition-all"
            style={{ width: `${(buffered / duration) * 100}%` }}
          />

          {/* Visual Track: Played */}
          <div
            className="absolute z-20 h-full bg-red-600 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              frontIconName={isPlaying && !isBuffering ? "iconoir:pause-solid" : "iconoir:play-solid"}
              frontIconHeight="18"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              bgClass="bg-black/50"
              textClass="text-white"
            />

            {/* Volume Group */}
            <div className="hidden sm:flex items-center group/volume gap-2 bg-black/50 hover:bg-white/10 rounded-full p-1 pr-3 transition-all">
              <Button
                frontIconName={isMuted ? 'mingcute:volume-off-fill' : 'mingcute:volume-fill'}
                frontIconHeight="18"
                onClick={toggleMute}
                className="p-1 ml-3"
                bgClass=""
                textClass="text-white"
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => updateVolume(parseFloat(e.target.value))}
                className="
                w-0 items-center opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100
                transition-all duration-300
                appearance-none h-1 rounded-full
                bg-white/30 accent-white
              "
              />
            </div>

            {/* Time Display */}
            <div className="px-2 py-2 text-xs md:text-sm font-medium bg-black/50 hover:bg-white/10 rounded-full text-white tabular-nums flex items-center gap-1 select-none">
              <span>{formatTime(currentTime)}</span>
              <span className="opacity-60 "> / </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center bg-black/50 hover:bg-black/60 px-3 py-1 rounded-full gap-1">
            {/* Logo - Hidden on mobile to save space */}
            <img src={logo} alt="Logo" className="block h-7 p-0.5 bg-white rounded-sm ml-2 opacity-80 hover:opacity-100 transition-opacity" />

            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="flex items-center gap-1 px-2 py-1 text-white hover:bg-white/10 rounded-full transition-colors text-sm font-medium"
              >
                <Icon name={speedIcon} height="18" width="18" />
                <span>{speed}x</span>
              </button>

              {isOpen && (
                <div className="absolute bottom-full mb-2 z-30 right-0 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden min-w-[80px]">
                  {SPEED_OPTIONS.map((s) => (
                    <button
                      key={s}
                      className={`w-full px-4 py-2 text-left text-xs lg:text-sm hover:bg-white/10 transition-colors ${speed === s ? 'text-red-500 bg-white' : 'text-white'}`}
                      onClick={() => {
                        videoRef.current.playbackRate = s;
                        setSpeed(s);
                      }}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              frontIconName={isFullscreen ? "mingcute:fullscreen-exit-fill" : "mingcute:fullscreen-fill"}
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-2 hover:bg-white/10 text-white rounded-full transition-colors"
              bgClass=""
              textClass=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VideoControls);