import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import moment from "moment";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import StoryModal from "./modals/StoryModal";
import StoryViewer from "./modals/StoryViewer";
import toast from "react-hot-toast";

const StoriesBar = () => {
    const { getToken } = useAuth();
    const [stories, setStories] = useState([]);
    const [viewStory, setViewStory] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchStories = async () => {
        const token = await getToken();

        try {
            const { data } = await api.get("/stories/get", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setStories(data.stories);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchStories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl px-4 no-scrollbar overflow-x-auto">
            <div className="flex gap-4 pb-5">
                {/* Add story card */}
                <div
                    className="rounded-lg shadow-sm min-w-32 max-w-32 min-h-40 max-h-40 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white cursor-pointer"
                    onClick={() => setShowModal(true)}
                >
                    <div className="h-full flex flex-col items-center justify-center p-4">
                        <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
                            <Plus className="size-5 text-white" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 text-center">
                            Create Story
                        </p>
                    </div>
                </div>
                {stories.map((story, index) => (
                    <div
                        key={index}
                        className={`relative rounded-lg shadow min-w-32 max-w-32 min-h-40 max-h-40 cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95`}
                        onClick={() => setViewStory(story)}
                    >
                        <img
                            src={story.user.profile_picture}
                            alt="story author"
                            className="absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow"
                        />
                        <p className="absolute top-16 left-3 text-white/60 truncate text-sm max-w-24">
                            {story.content}
                        </p>
                        <p className="absolute text-white bottom-1 right-2 z-10 text-xs">
                            {moment(story.createdAt).fromNow()}
                        </p>
                        {story.media_type !== "text" && (
                            <div className="absolute inset-0 z-1 rounded-lg bg-black overflow-hidden">
                                {story.media_type === "image" ? (
                                    <img
                                        src={story.media_url}
                                        alt="story img"
                                        className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
                                    />
                                ) : (
                                    <video
                                        src={story.media_url}
                                        className="h-full w-full object-cover hover:scale-110 transition duration-500 opacity-70 hover:opacity-80"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {showModal && (
                <StoryModal
                    setShowModal={setShowModal}
                    fetchStories={fetchStories}
                />
            )}
            {viewStory && (
                <StoryViewer
                    viewStory={viewStory}
                    setViewStory={setViewStory}
                />
            )}
        </div>
    );
};

export default StoriesBar;
