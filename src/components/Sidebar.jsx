import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useSelector } from "react-redux";

const Sidebar = ({ open, setOpen }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.value);
    const { signOut } = useClerk();

    return (
        <div
            className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute max-sm:top-0 max-sm:bottom-0 max-sm:z-20 ${
                open ? "translate-x-0" : "max-sm:-translate-x-full"
            } transition-all duration-300 ease-in-out`}
        >
            <div className="w-full">
                <img
                    onClick={() => navigate("/")}
                    src={assets.logo}
                    alt="logo"
                    className="w-26 ml-7 my-2 cursor-pointer"
                />
                <hr className="border-gray-300 mb-8" />
                <MenuItems setOpen={setOpen} />
                <Link
                    to="/post"
                    className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer"
                >
                    <CirclePlus className="size-5" /> Create Post
                </Link>
            </div>
            <div className="w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between">
                <div className="flex gap-2 items-center cursor-pointer">
                    <UserButton />
                    <div>
                        <h1 className="text-sm font-medium">
                            {user.full_name}
                        </h1>
                        <p className="text-xs text-gray-500">
                            @{user.username}
                        </p>
                    </div>
                </div>
                <LogOut
                    className="w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                    onClick={signOut}
                />
            </div>
        </div>
    );
};

export default Sidebar;
