import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Image, X } from "lucide-react";
import { toast } from "react-hot-toast";

const CreatePost = () => {
    const user = useSelector((state) => state.user.value);
    const [content, setContent] = useState("");
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!images.length && !content) {
            return toast.error("Please add at least one image or text");
        }
        setIsLoading(true);
        const postType =
            images.length && content
                ? "text_with_image"
                : images.length
                ? "image"
                : "text";
        try {
            const formData = new FormData();
            formData.append("content", content);
            formData.append("post_type", postType);
            images.map((image) => formData.append("images", image));

            const { data } = await api.post("/posts/add", formData, {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });

            if (data.success) {
                navigate("/");
            } else {
                console.error(data.message);
                throw new Error(data.message);
            }
        } catch (error) {
            console.error(error.message);
            throw new Error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="p-6 max-w-6xl mx-auto">
                {/* Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-slate-900">
                        Create Post
                    </h1>
                    <p className="text-slate-600">
                        Share your thoughts with the world
                    </p>
                </div>
                {/* Form */}
                <div className="max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4">
                    {/* Headers */}
                    <div className="flex items-center gap-3">
                        <img
                            className="size-12 rounded-full shadow"
                            src={user.profile_picture}
                            alt="profile image"
                        />
                        <div>
                            <p className="font-semibold">{user.full_name}</p>
                            <p className="text-sm text-gray-500">
                                @{user.username}
                            </p>
                        </div>
                    </div>
                    {/* Textarea */}
                    <textarea
                        value={content}
                        placeholder="What's happening"
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full resize-none max-h-2 mt-4 text-sm outline-none placeholder-gray-400"
                    />
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {images.map((image, i) => (
                                <div key={i} className="relative group">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        className="h-20 rounded-md"
                                        alt="post image"
                                    />
                                    <div
                                        onClick={() =>
                                            setImages(
                                                images.filter(
                                                    (_, index) => index !== i
                                                )
                                            )
                                        }
                                        className="absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer"
                                    >
                                        <X className="size-6 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                        <label
                            htmlFor="images"
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition duration-300 cursor-pointer"
                        >
                            <Image className="size-6" />
                        </label>
                        <input
                            type="file"
                            id="images"
                            accept="image/*"
                            hidden
                            multiple
                            onChange={(e) =>
                                setImages([...images, ...e.target.files])
                            }
                        />
                        <button
                            className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer"
                            disabled={isLoading}
                            onClick={() =>
                                toast.promise(handleSubmit(), {
                                    loading: "Uploading...",
                                    success: <p>Post Added</p>,
                                    error: <p>Post not uploaded</p>,
                                })
                            }
                        >
                            Publish Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
