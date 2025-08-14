import { Eye, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Messages = () => {
    const navigate = useNavigate();
    const { connections } = useSelector((state) => state.connections);

    return (
        <section className="relative min-h-screen bg-slate-50">
            <div className="p-6 mx-auto max-w-6xl">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-slate-900">
                        Messages
                    </h1>
                    <p className="text-slate-600">
                        Talk to your friends and family
                    </p>
                </div>
                {/* Connected users */}
                <div className="flex flex-col gap-3">
                    {connections.map((user) => (
                        <div
                            key={user._id}
                            className="flex max-w-xl flex-wrap gap-5 p-6 bg-white shadow rounded-md"
                        >
                            <img
                                src={user.profile_picture}
                                alt="profile photo"
                                className="rounded-full size-12 mx-auto"
                            />
                            <div className="flex-1">
                                <p className="font-medium text-slate-700">
                                    {user.full_name}
                                </p>
                                <p className="text-slate-500">
                                    @{user.username}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {user.bio}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <button
                                    className="size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer gap-1 duration-200"
                                    onClick={() =>
                                        navigate(`/messages/${user._id}`)
                                    }
                                >
                                    <MessageSquare className="size-4" />
                                </button>
                                <button
                                    className="size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer duration-200"
                                    onClick={() =>
                                        navigate(`/profile/${user._id}`)
                                    }
                                >
                                    <Eye className="size-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Messages;
