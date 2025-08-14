import { useNavigate } from "react-router-dom";
import {
    MessageSquare,
    UserCheck,
    UserPlus,
    UserRoundPen,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { fetchConnections } from "../app/features/connectionsSlice";
import api from "../api/axios";
import toast from "react-hot-toast";

const Connections = () => {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("Followers");
    const { followers, following, connections, pendingConnections } =
        useSelector((state) => state.connections);
    const dataArray = [
        { label: "Followers", value: followers, icon: Users },
        { label: "Following", value: following, icon: UserCheck },
        { label: "Pending", value: pendingConnections, icon: UserRoundPen },
        { label: "Connections", value: connections, icon: UserPlus },
    ];

    useEffect(() => {
        getToken().then((token) => dispatch(fetchConnections(token)));
    }, [dispatch, getToken]);

    const handleUnfollow = async (userId) => {
        try {
            const { data } = await api.put(
                "/users/unfollow",
                { id: userId },
                {
                    headers: { Authorization: `Bearer ${await getToken()}` },
                }
            );

            if (data.success) {
                toast.success(data.message);
                dispatch(fetchConnections(await getToken()));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

     const acceptConnection = async (userId) => {
         try {
             const { data } = await api.post(
                 "/users/accept",
                 { id: userId },
                 {
                     headers: { Authorization: `Bearer ${await getToken()}` },
                 }
             );

             if (data.success) {
                 toast.success(data.message);
                 dispatch(fetchConnections(await getToken()));
             } else {
                 toast.error(data.message);
             }
         } catch (error) {
             toast.error(error.message);
         }
     };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-6 max-w-6xl mx-auto">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-slate-900">
                        Connections
                    </h1>
                    <p className="text-slate-600">
                        Manage your network and discover new connections
                    </p>
                </div>
                {/* Counts */}
                <div className="mb-8 gap-6 flex flex-wrap">
                    {dataArray.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-center items-center gap-1 border h-20 w-40 border-gray-200 bg-white shadow rounded-md"
                        >
                            <b>{item.value.length}</b>
                            <p className="text-slate-600">{item.label}</p>
                        </div>
                    ))}
                </div>
                {/* Tabs */}
                <div className="inline-flex flex-wrap items-center border border-gray-200 rounded-md p-1 bg-white shadow-sm">
                    {dataArray.map((tab) => {
                        const Icon = tab.icon;

                        return (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTab(tab.label)}
                                className={`flex cursor-pointer items-center px-3 py-1 text-sm rounded-md transition-colors ${
                                    activeTab === tab.label
                                        ? "bg-white font-medium text-black"
                                        : "text-gray-500 hover:text-black"
                                }`}
                            >
                                <Icon className="size-4" />
                                <span className="ml-1">{tab.label}</span>
                                {tab.value.length !== undefined && (
                                    <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                                        {tab.value.length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                {/* Connections */}
                <div className="mt-8 gap-6 flex flex-wrap">
                    {dataArray
                        .find((item) => item.label === activeTab)
                        .value.map((user) => (
                            <div
                                key={user._id}
                                className="w-full max-w-88 flex gap-5 p-6 bg-white shadow rounded-md"
                            >
                                <img
                                    src={user.profile_picture}
                                    alt="profile photo"
                                    className="size-12 rounded-full mx-auto shadow-md"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-slate-700">
                                        {user.full_name}
                                    </p>
                                    <p className="text-slate-500">
                                        @{user.username}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {user.bio.slice(0, 30)}...
                                    </p>
                                    <div className="flex max-sm:flex-col gap-2 mt-4">
                                        <button
                                            onClick={() =>
                                                navigate(`/profile/${user._id}`)
                                            }
                                            className="p-2 w-full text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer duration-300"
                                        >
                                            View Profile
                                        </button>
                                        {activeTab === "Following" && (
                                            <button className="p-2 w-full text-sm rounded bg-slate-100 hover:bg-slate-200 active:scale-95 transition text-black cursor-pointer duration-300" onClick={() => handleUnfollow(user._id)}>
                                                Unfollow
                                            </button>
                                        )}
                                        {activeTab === "Pending" && (
                                            <button className="p-2 w-full text-sm rounded bg-slate-100 hover:bg-slate-200 active:scale-95 transition text-black cursor-pointer duration-300" onClick={()=> acceptConnection(user._id)}>
                                                Accept
                                            </button>
                                        )}
                                        {activeTab === "Connections" && (
                                            <button
                                                className="p-2 w-full text-sm rounded bg-slate-100 hover:bg-slate-200 active:scale-95 transition text-black cursor-pointer duration-300 flex items-center justify-center gap-1"
                                                onClick={() =>
                                                    navigate(
                                                        `/messages/${user._id}`
                                                    )
                                                }
                                            >
                                                <MessageSquare className="size-4" />{" "}
                                                Message
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Connections;
