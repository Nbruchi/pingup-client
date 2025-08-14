import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Loading from "../components/Loading";
import UserCard from "../components/cards/UserCard";
import api from "../api/axios";
import { fetchUser } from "../app/features/userSlice";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const Discover = () => {
    const [input, setInput] = useState("");
    const { getToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState();
    const dispatch = useDispatch();

    const handleSearch = async (e) => {
        if (e.key === "Enter") {
            try {
                setUsers([]);
                setIsLoading(true);

                const { data } = await api.get(
                    "/users/discover",
                    { input },
                    {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`,
                        },
                    }
                );
                data.success ? setUsers(data.users) : toast.error(data.message);

                setInput("");
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        getToken().then((token) => dispatch(fetchUser(token)));
    }, [getToken, dispatch]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="p-6 max-w-6xl mx-auto">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-slate-900">
                        Discover People
                    </h1>
                    <p className="text-slate-600">
                        Connect with amazing people and grow your network
                    </p>
                </div>
                {/* Search */}
                <div className="mb-8 shadow-md rounded-md border border-slate-200/60 bg-white/80">
                    <div className="p-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 size-5" />
                            <input
                                type="text"
                                value={input}
                                onKeyUp={handleSearch}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Search people by name, username, bio or locaiton..."
                                className="pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm"
                            />
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <Loading height="60vh" />
                ) : users.length > 0 ? (
                    <div className="flex flex-wrap gap-6">
                        {users.map((user) => (
                            <UserCard key={user._id} user={user} />
                        ))}
                    </div>
                ) : (
                    <p>No connections found</p>
                )}
            </div>
        </div>
    );
};

export default Discover;
