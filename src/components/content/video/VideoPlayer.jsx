import React, { useRef, lazy, Suspense } from 'react'
import VideoControls from './VideoControls'
import { useContentProtection } from '@/hooks/useContentProtection';
const MovingWatermark = lazy(() => import("./MovingWatermark"));
import { useAuth } from '../../../context/AuthContext';


function VideoPlayer({ url, id, setVideoDuration }) {
    const { user } = useAuth();
    useContentProtection(true);
    const videoRef = useRef(null);



    return (

        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
            <video
                key={id}
                ref={videoRef}
                className="w-full h-full object-contain"
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                playsInline
            >
                <source src={url} type="video/mp4" />
            </video>
            <Suspense fallback={null}>
                <MovingWatermark text={user.username} />
            </Suspense>

            <div className="absolute inset-0">
                <VideoControls videoRef={videoRef} setVideoDuration={setVideoDuration} />
            </div>
        </div>

    )
}

export default VideoPlayer
