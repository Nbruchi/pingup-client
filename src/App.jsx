import { Route, Routes, useLocation } from "react-router-dom";
import {
    Login,
    Feed,
    Messages,
    ChatBox,
    Connections,
    Discover,
    Profile,
    CreatePost,
} from "./pages";
import { useEffect, useRef } from "react";
import Layout from "./components/Layout";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUser } from "./app/features/userSlice";
import { useClerk, useUser } from "@clerk/clerk-react";
import { fetchConnections } from "./app/features/connectionsSlice";
import { addMessage } from "./app/features/messagesSlice";
import Notification from "./components/Notification";

const App = () => {
    const dispatch = useDispatch();
    const { user } = useUser();
    const pathname = useLocation();
    const { getToken } = useClerk();
    const pathnameRef = useRef(pathname);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                const token = await getToken();
                dispatch(fetchUser(token));
                dispatch(fetchConnections(token));
            }
        };

        fetchData();
    }, [user, getToken, dispatch]);

    useEffect(() => {
        pathnameRef.current = pathname;
    }, [pathname]);

    useEffect(() => {
        if (user) {
            const eventSource = new EventSource(
                `${import.meta.env.VITE_BACKEND_URL}/messages/${user._id}`
            );

            eventSource.onmessage = (event) => {
                const message = JSON.parse(event.data);

                if (
                    pathnameRef.current ===
                    `/messages/${message.from_user_id._id}`
                ) {
                    dispatch(addMessage(message));
                } else {
                    toast.custom(
                        (t) => <Notification t={t} message={message} />,
                        { position: "bottom-right", duration: 5000 }
                    );
                }
            };
            return () => eventSource.close();
        }
    }, [user, dispatch]);

    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/" element={user ? <Layout /> : <Login />}>
                    <Route index element={<Feed />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="messages/:userId" element={<ChatBox />} />
                    <Route path="connections" element={<Connections />} />
                    <Route path="post" element={<CreatePost />} />
                    <Route path="discover" element={<Discover />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile/:profileId" element={<Profile />} />
                </Route>
            </Routes>
        </>
    );
};

export default App;
