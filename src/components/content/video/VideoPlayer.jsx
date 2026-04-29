import React, { useEffect, useRef, lazy, Suspense, useState } from 'react'
import VideoControls from './VideoControls'
import { useContentProtection } from '@/hooks/useContentProtection';
const MovingWatermark = lazy(() => import("./MovingWatermark"));
import { useAuth } from '../../../context/AuthContext';
import { Icon, Button } from '@/components/ui';

function VideoPlayer({ url, id, setVideoDuration }) {

    const [videoLoading, setVideoLoading] = useState(true);
    const [videoError, setVideoError] = useState(null);

    const { user } = useAuth();
    useContentProtection(true);
    const videoRef = useRef(null);

    // reset on url change
    useEffect(() => {
        setVideoLoading(true);
        setVideoError(null);
    }, [url]);

    const handleError = (e) => {
        const code = e.target.error?.code;
        let message = "Failed to load video";
        if (code === 1) message = "Video loading was aborted";
        if (code === 2) message = "Network error while loading video";
        if (code === 3) message = "Video decoding failed";
        if (code === 4) message = "Video unavailable or link has expired";
        setVideoError(message);
        setVideoLoading(false);
    };

    const handleRetry = () => {
        setVideoError(null);
        setVideoLoading(true);
        // force reload by resetting src
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    return (
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">

            {/* ✅ loading overlay */}
            {videoLoading && !videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black z-10">
                    <Icon
                        name="line-md:loading-twotone-loop"
                        height="40" width="40"
                        className="text-primary"
                    />
                    <p className="text-white text-caption">Loading video...</p>
                </div>
            )}

            {/* error overlay */}
            {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black z-10">
                    <Icon name="mdi:video-off" height="40" width="40" className="text-red-400" />
                    <p className="text-white text-caption">{videoError}</p>
                    <Button
                        buttonName="Retry"
                        className="px-4 py-1 rounded text-sm"
                        onClick={handleRetry}
                    />
                </div>
            )}

            {/* video — always in DOM so it loads in background */}
            <video
                key={id}
                ref={videoRef}
                className={`w-full h-full object-contain ${videoLoading || videoError ? "invisible" : "visible"}`}
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                playsInline
                onCanPlay={() => setVideoLoading(false)}   // enough data buffered
                onLoadedMetadata={(e) => {
                    setVideoDuration?.(e.target.duration);
                }}
                onError={handleError}                       // AWS/network errors
            >
                <source src={url} type="video/mp4" />
            </video>

            {/* watermark + controls — only show when loaded */}
            {!videoLoading && !videoError && (
                <>
                    <Suspense fallback={null}>
                        <MovingWatermark text={user.username} />
                    </Suspense>
                    <div className="absolute inset-0">
                        <VideoControls videoRef={videoRef} setVideoDuration={setVideoDuration} />
                    </div>
                </>
            )}

        </div>
    );
}

export default VideoPlayer;