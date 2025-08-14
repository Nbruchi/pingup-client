import { BadgeCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const StoryViewer = ({ viewStory, setViewStory }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer, progressInterval;

        if (viewStory && viewStory.media_type !== "video") {
            setProgress(0);

            const duration = 10000;
            const setTime = 100;
            let elapsed = 0;

            progressInterval = setInterval(() => {
                elapsed += setTime;
                setProgress((elapsed / duration) * 100);
            }, setTime);

            // Close story after 10 sec
            timer = setTimeout(() => {
                setViewStory(null);
            }, duration);

            return () => {
                clearTimeout(timer);
                clearInterval(progressInterval);
            };
        }
    }, [viewStory, setViewStory]);

    if (!viewStory) return null;

    const renderContent = () => {
        switch (viewStory.media_type) {
            case "image":
                return (
                    <img
                        src={viewStory.media_url}
                        alt="story img"
                        className="max-w-full max-h-screen object-contain"
                    />
                );
            case "video":
                return (
                    <video
                        onEnded={() => setViewStory(null)}
                        src={viewStory.media_url}
                        className="max-h-screen"
                        controls
                        autoPlay
                    />
                );
            case "text":
                return (
                    <div className="w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center">
                        {viewStory.content}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className="fixed inset-0 h-screen bg-black/90 z-110 flex items-center justify-center"
            style={{
                backgroundColor:
                    viewStory.media_type === "text"
                        ? viewStory.background_color
                        : "#000000",
            }}
        >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
                <div
                    className="h-full bg-white transition-all duration-100 linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            {/* User info */}
            <div className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50">
                <div className="text-white font-medium flex items-center gap-1.5">
                    <span>{viewStory.user?.full_name}</span>
                    <BadgeCheck size={18} />
                </div>
            </div>
            {/* Close Button */}
            <button
                className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none"
                onClick={() => setViewStory(null)}
            >
                <X className="size-8 cursor-pointer hover:scale-110 transition" />
            </button>
            {/* Content wrapper */}
            <div className="flex items-center justify-center max-w-[90vw] max-h-[90vh]">
                {renderContent()}
            </div>
        </div>
    );
};

export default StoryViewer;
