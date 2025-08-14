import { ArrowLeft, Sparkle, Text, Upload } from "lucide-react";
import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const StoryModal = ({ setShowModal, fetchStories }) => {
    const backgrounds = [
        "#4f46e5",
        "#7c3aed",
        "#db2777",
        "#e11d48",
        "#ca8a04",
        "#0d9488",
    ];
    const [text, setText] = useState("");
    const [media, setMedia] = useState(null);
    const [mode, setMode] = useState("text");
    const { getToken } = useAuth();
    const [previewUrl, setPreviewUrl] = useState(null);
    const [background, setBackground] = useState(backgrounds[0]);

    const MAX_VIDEO_DURATION = 60; //1 minute
    const MAX_VIDEO_SIZE = 50; //Mbs

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith("video")) {
                if (file.size > MAX_VIDEO_SIZE * 1024 * 1024) {
                    toast.error(`Video size can't exceed 50Mbs`);
                    setMedia(null);
                    setPreviewUrl(null);
                    return;
                }
                const video = document.createElement("video");
                video.src = URL.createObjectURL(file);
                video.preload = "metadata";
                video.onloadedmetadata = () => {
                    URL.revokeObjectURL(video.src);
                    if (video.duration > MAX_VIDEO_DURATION) {
                        toast.error(`Video duration cannot exceed 1 minute`);
                        setMedia(null);
                        setPreviewUrl(null);
                    } else {
                        setMedia(file);
                        setPreviewUrl(URL.createObjectURL(file));
                        setText("");
                        setMode("media");
                    }
                };
                video.src = URL.createObjectURL(file);
            } else if (file.type.startsWith("image")) {
                setMedia(file);
                setPreviewUrl(URL.createObjectURL(file));
                setText("");
                setMode("media");
            }
        }
    };

    const handleCreateStory = async () => {
        const media_type =
            mode === "media"
                ? media?.type.startsWith("image")
                    ? "image"
                    : "video"
                : "text";

        if (media_type === "text" && !text) {
            throw new Error("Please enter some text");
        }

        let formData = new FormData();
        formData.append("content", text);
        formData.append("media_type", media_type);
        formData.append("media", media);
        formData.append("background_color", background);

        const token = await getToken();

        try {
            const { data } = await api.post("/stories/create", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (data.success) {
                setShowModal(false);
                toast.success("Story created successfully");
                fetchStories();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white p-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-4 flex items-center justify-between">
                    <button
                        onClick={() => setShowModal(false)}
                        className="text-white p-2 cursor-pointer"
                    >
                        <ArrowLeft />
                    </button>
                    <h2 className="text-lg font-semibold">Create Story</h2>
                </div>
                <div
                    className="rounded-lg h-96 flex items-center justify-center relative"
                    style={{ backgroundColor: background }}
                >
                    {mode === "text" && (
                        <textarea
                            className="bg-transparent text-white w-full h-full p-6 text-lg resize-none hover:outline-none"
                            placeholder="What's on your mind?"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    )}
                    {mode === "media" &&
                        previewUrl &&
                        (media?.type.startsWith("image") ? (
                            <img
                                src={previewUrl}
                                className="object-contain max-h-full"
                                alt="preview img"
                            />
                        ) : (
                            <video
                                src={previewUrl}
                                className="object-contain max-h-full"
                            />
                        ))}
                </div>
                <div className="flex mt-4 gap-2">
                    {backgrounds.map((color) => (
                        <button
                            key={color}
                            className="size-6 rounded-full ring cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => setBackground(color)}
                        />
                    ))}
                </div>
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => {
                            setMode("text");
                            setMedia(null);
                            setPreviewUrl(null);
                        }}
                        className={`flex flex-1 justify-center items-center gap-2 p-2 rounded ${
                            mode === "text"
                                ? "bg-white text-black"
                                : "bg-zinc-800"
                        }`}
                    >
                        <Text size={18} /> Text
                    </button>
                    <label
                        className={`flex flex-1 justify-center items-center gap-2 p-2 rounded ${
                            mode === "media"
                                ? "bg-white text-black"
                                : "bg-zinc-800"
                        }`}
                    >
                        <input
                            onChange={(e) => handleMediaUpload(e)}
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                        />
                        <Upload size={18} /> Photo/Video
                    </label>
                </div>
                <button
                    className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer duration-300"
                    onClick={() =>
                        toast.promise(handleCreateStory(), {
                            loading: "Saving...",
                        })
                    }
                >
                    <Sparkle size={18} /> Create Story
                </button>
            </div>
        </div>
    );
};

export default StoryModal;
