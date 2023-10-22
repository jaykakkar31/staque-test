import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import * as Styled from "./app.styled";
// import "videojs-contrib-media-sources"
let videoSources = [];
const VideoWallApp = () => {
    // var mediaSource = new videojs.MediaSource({ mode: 'html5' });

    const [gridSize, setGridSize] = useState({ rows: 0, columns: 0 });
    const [videos, setVideos] = useState([]); // An array to store video instances
    const [inactiveTimer, setInactiveTimer] = useState(6000);
    const [isTabActive, setIsTabActive] = useState(true);
    const visibilityChangeRef = useRef(null);
    useEffect(() => {
        // Initialize video players when gridSize changes

        initializeVideoPlayers();

        visibilityChangeRef.current = () => {
            if (document.hidden) {
                setTimeout(() => {
                    videos.forEach((video) => {
                        video.pause();
                    });
                    setIsTabActive(false);
                }, 10000);
                // Tab is inactive, so pause all videos
            } else {
                // Tab is active, so resume video playback
                videos.forEach((video) => {
                    video.play();
                });
                setIsTabActive(true);
            }
        };

        // Cleanup when unmounting
        // return () => {
        //     // videos.forEach((video) => {
        //     //     video.dispose();
        //     // });
        // };
    }, [gridSize]);

    // Function to initialize Video.js players in the grid
    const initializeVideoPlayers = () => {
        const { rows, columns } = gridSize;
        const totalVideos = rows * columns;
        // Create video sources for HLS streams (update with your actual stream URLs)
        let val =
            "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8";
        console.log("-----------", videoSources.length);
        if (videoSources.length < rows * columns) {
            for (let i = 1; i <= rows * columns; i++) {
                videoSources.push(val);
            }

            // Create Video.js instances for each grid cell
            const newVideos = Array.from(
                { length: totalVideos },
                (_, index) => {
                    const video = videojs(`video-player-${index}`);
                    video.src({
                        src: videoSources[index % videoSources.length],
                        type: "application/x-mpegURL",
                    });
                    // video.play()
                    video?.on("playing", handleVideoPlaying);
                    video?.on("ended", handleVideoEnded);
                    return video;
                }
            );

            console.log("------------", newVideos);
            setVideos(newVideos);
        }
    };

    // Function to handle video playing
    const handleVideoPlaying = () => {
        // Clear the inactive timer when a video starts playing
        clearTimeout(inactiveTimer);
    };

    // Function to handle video ended
    const handleVideoEnded = (event) => {
        const video = event.target;
        // Restart the video when it ends
        video.currentTime(0);
        video?.play();
    };

    // Function to toggle fullscreen mode for a video
    const toggleFullscreen = (video) => {
        if (video.isFullscreen()) {
            video.exitFullscreen();
        } else {
            video.requestFullscreen();
        }
    };

    // Event listener for mousemove to detect user activity
    const handleMouseMove = () => {
        if (inactiveTimer) {
            // If the inactive timer is set, the user has been inactive, so resume video playback
            videos &&
                videos?.forEach((video) => {
                    video?.play();
                });
            clearTimeout(inactiveTimer);
        }

        const newInactiveTimer = setTimeout(() => {
            // Stop video playback if the user is inactive for 1 minute
            videos &&
                videos?.forEach((video) => {
                    video?.pause();
                });
        }, 60000); // 1 minute in milliseconds
        setInactiveTimer(newInactiveTimer);

        // Set a new inactive timer
    };

    // Function to change grid size
    const changeGridSize = (rows, columns) => {
        // setVideos([]);
        setGridSize({ rows, columns });
    };

    const handleGridSizeChange = (event, name) => {
        let num = event.target.value === "" ? null : event.target.value;
        console.log("----------", num);
        if (name === "row") {
            setGridSize((prev) => {
                return { ...prev, rows: num };
            });
        } else {
            setGridSize((prev) => {
                return { ...prev, columns: num };
            });
        }
    };
    console.log("CaLLED-------", gridSize);

    return (
        <div>
            {!gridSize.columns || !gridSize.rows ? (
                <div>
                    <h1>Video Wall Application</h1>
                    <label>Select Grid Size:</label>
                    <input
                        placeholder="Enter no of rows"
                        type="number"
                        value={gridSize.rows}
                        onChange={(e) => handleGridSizeChange(e, "row")}
                    />
                    <input
                        placeholder="Enter no of columns"
                        type="number"
                        value={gridSize.columns}
                        onChange={(e) => handleGridSizeChange(e, "column")}
                    />

                    {/* <button onClick={() => changeGridSize(2, 2)}>2x2 Grid</button>
                <button onClick={() => changeGridSize(3, 3)}>3x3 Grid</button>
                <button onClick={() => changeGridSize(4, 4)}>4x4 Grid</button> */}
                </div>
            ) : (
                <div className="video-grid" onMouseMove={handleMouseMove}>
                    {Array.from(
                        { length: gridSize?.rows * gridSize?.columns },
                        (_, index) => (
                            <Styled.Grid
                                key={index}
                                columns={100 / gridSize?.columns}
                            >
                                <video
                                    id={`video-player-${index}`}
                                    className="video-js vjs-default-skin"
                                    // controls
                                    autoPlay
                                    muted
                                    onClick={() =>
                                        toggleFullscreen(videos[index])
                                    }
                                ></video>
                                {/* <button
                                onClick={() => toggleFullscreen(videos[index])}
                            >
                                Toggle Fullscreen
                            </button> */}
                            </Styled.Grid>
                        )
                    )}
                    <button>Play all</button>
                    <button>Pause all</button>
                </div>
            )}
        </div>
    );
};

export default VideoWallApp;
