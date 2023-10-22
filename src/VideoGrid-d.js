import React, { useEffect } from 'react';
import videojs from 'video.js';

const VideoGrid = ({ gridSize, videoSource }) => {
    useEffect(() => {
        const videos = [];

        for (let i = 0; i < gridSize * gridSize; i++) {
            const videoId = `video-${i}`;
            videos.push(videojs(videoId));
        }

        videos.forEach((video) => {
            video.src({
                src: videoSource,
                type: 'application/x-mpegURL', // HLS format (M3U8)
            });
            video.play(); // Start playing the video
        });

        return () => {
            videos.forEach((video) => video.dispose());
        };
    }, [gridSize, videoSource]);

    return (
        <div>
            {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                <video
                    id={`video-${i}`}
                    className="video-js vjs-default-skin"
                    controls
                    key={i}
                />
            ))}
        </div>
    );
};

export default VideoGrid;
