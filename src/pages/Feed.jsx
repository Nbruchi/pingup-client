import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { assets } from "../assets/assets";
import StoriesBar from "../components/StoriesBar";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import PostCard from "../components/cards/PostCard";
import RecentMessages from "../components/RecentMessages";

const Feed = () => {
    const { getToken } = useAuth();
    const [feeds, setFeeds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchFeeds = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get("/posts/feed", {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });

            if (data.success) {
                setFeeds(data.posts);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeeds();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
                    {/* Stories and posts */}
                    <div>
                        <StoriesBar />
                        <div className="p-4 space-y-6">
                            {feeds.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    </div>
                    {/* Recent messages */}
                    <div className="max-xl:hidden sticky top-0">
                        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow">
                            <h3 className="text-slate-800 font-semibold">
                                Sponsored
                            </h3>
                            <img
                                src={assets.sponsored_img}
                                alt="sponsored image"
                                className="w-72 h-52 rounded-md"
                            />
                            <p className="text-slate-600">Email Marketing</p>
                            <p className="text-slate-400">
                                Supercharge your marketing with a powerful,
                                easy-to-use platform built for results
                            </p>
                        </div>
                        <RecentMessages />
                    </div>
                </div>
            )}
        </>
    );
};

export default Feed;
