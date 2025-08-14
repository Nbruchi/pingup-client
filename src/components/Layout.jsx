import { useState } from "react";
import Sidebar from "./Sidebar";
import Loading from "./Loading";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";

const Layout = () => {
    const user = useSelector((state) => state.user.value);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return user ? (
        <div className="w-full flex h-screen">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className="flex-1 bg-slate-50">
                <Outlet />
            </div>
            {sidebarOpen ? (
                <X
                    className="absolute top-3 right-3 p-2 z-[100] bg-white rounded-md shadow size-10 text-gray-600 sm:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            ) : (
                <Menu
                    className="absolute top-3 right-3 p-2 z-[100] bg-white rounded-md shadow size-10 text-gray-600 sm:hidden"
                    onClick={() => setSidebarOpen(true)}
                />
            )}
        </div>
    ) : (
        <Loading />
    );
};

export default Layout;
