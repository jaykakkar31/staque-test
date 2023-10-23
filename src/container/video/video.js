import React from "react";
import * as Styled from "./video.styled";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const Video = () => {
    const [gridSize, setGridSize] = React.useState({ rows: null, columns: null });
    const [videos, setVideos] = React.useState([]); // An array to store video instances
    const [inactiveTimer, setInactiveTimer] = React.useState(60000);
    const [isTabActive, setIsTabActive] = React.useState(true);
    const [isBuffering, setIsBuffering] = React.useState(false);
    let videoSources = [];

    React.useEffect(() => {
        initializeVideoPlayers();
        const handleChangeVisibility = () => {
            if (document.hidden) {
                setTimeout(() => {
                    videos.forEach((video) => {
                        video?.pause();
                    });
                    setIsTabActive(false);
                }, 2000);
                // Tab is inactive, so pause all videos
            } else {
                // Tab is active, so resume video playback
                videos.forEach((video) => {
                    video?.play();
                });
                setIsTabActive(true);
            }
        };

        document.addEventListener("visibilitychange", handleChangeVisibility);
    }, [document,gridSize]);

    // Function to initialize Video.js players in the grid
    const initializeVideoPlayers = () => {
        const { rows, columns } = gridSize;
        const totalVideos = rows * columns;
        // Create video sources for HLS streams (update with your actual stream URLs)
        let val =process.env.REACT_APP_VIDEO_URL
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
                        loadingSpinner: false,
                    });
                    // video.play()

                    video?.on("playing", handleVideoPlaying);
                    video?.on("ended", handleVideoEnded);
                    let videoEl = document.getElementById(
                        `video-player-${index}`
                    );
                    video.on("waiting", () => {
                        // Set the buffering state and display the loader
                        setIsBuffering(true);
                    });
                    return video;
                }
            );

            setVideos(newVideos);
        }
    };

    // Function to handle video playing
    const handleVideoPlaying = () => {
        // Clear the inactive timer when a video starts playing
        clearTimeout(inactiveTimer);
        setIsBuffering(false);
    };

    // Function to handle video ended
    const handleVideoEnded = (event) => {
        const video = event.target;
        // Restart the video when it ends
        video.currentTime(0);
        video?.play();
        setIsBuffering(false);
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

    const handleGridSizeChange = (event, name) => {
        let num = event.target.value === "" ? 0 : parseInt(event.target.value);
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
    const handlePlayAll = () => {
        videos.forEach((video) => {
            video.play();
        });
    };
    const handlePauseAll = () => {
        videos.forEach((video) => {
            video.pause();
        });
    };
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
                        min={1}
                        onChange={(e) => handleGridSizeChange(e, "row")}
                    />
                    <input
                        placeholder="Enter no of columns"
                        type="number"
                        min={1}
                        value={gridSize.columns}
                        onChange={(e) => handleGridSizeChange(e, "column")}
                    />
                </div>
            ) : (
                <div>
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
                                        autoPlay
                                        muted
                                        onClick={() =>
                                            toggleFullscreen(videos[index])
                                        }
                                    >
                                        {isBuffering && (
                                            <div className="loader"></div>
                                        )}
                                    </video>
                                </Styled.Grid>
                            )
                        )}
                    </div>

                    <Styled.Button onClick={handlePlayAll}>
                        Play all
                    </Styled.Button>
                    <Styled.Button onClick={handlePauseAll}>
                        Pause all
                    </Styled.Button>
                </div>
            )}
        </div>
    );
};

export default Video;
