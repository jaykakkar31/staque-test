import React, { useEffect, useState } from 'react';
import videojs from 'video.js';

const VideoGrid = ({ gridSize, videoSource }) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const newVideos = [];

        for (let i = 0; i < gridSize * gridSize; i++) {
            const videoId = `video-${i}`;
            const player = videojs(videoId);

            player.src({
                src: videoSource,
                type: 'application/x-mpegURL', // HLS format
            });

            newVideos.push(player);
        }

        setVideos(newVideos);
        console.log("=-------------",newVideos[0].id);

        return () => {
            newVideos.forEach((video) => video.dispose());
        };
    }, [gridSize, videoSource]);

    // Function to play/pause a video
    const toggleVideoPlayback = (videoIndex) => {
        const video = videos[videoIndex];

        if (video.paused()) {
            video.play();
        } else {
            video.pause();
        }
    };

    return (
        <div>
            {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                <div key={i}>
                    <video
                        id={`video-${i}`}
                        className="video-js vjs-default-skin"
                        controls
                    >
      <source src="https://www.tutorialspoint.com/videos/sample720.m3u8" type="application/x-mpegURL"/>
                    </video>
                    <button onClick={() => toggleVideoPlayback(i)}>
                        Play/Pause
                    </button>
                </div>
            ))}
        </div>
    );
};

export default VideoGrid;
