import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../app/features/userSlice";

const ProfileModal = ({ setShowEdit }) => {
    const { getToken } = useAuth();
    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        cover_photo: null,
        full_name: user.full_name,
    });

    const editProfile = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();

            const userData = new FormData();

            const {
                full_name,
                username,
                bio,
                location,
                profile_picture,
                cover_photo,
            } = editForm;

            userData.append("username", username);
            userData.append("full_name", full_name);
            userData.append("bio", bio);
            userData.append("location", location);
            profile_picture && userData.append("profile", profile_picture);
            cover_photo && userData.append("cover", cover_photo);

            dispatch(updateUser({ userData, token }));
            setShowEdit(false);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="fixed top-0 bottom-0 right-0 left-0 z-110 h-screen overflow-y-scroll no-scrollbar bg-black/50">
            <div className="max-w-2xl sm:py-6 mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Edit Profile
                    </h1>

                    <form
                        className="space-y-4"
                        onSubmit={(e) =>
                            toast.promise(editProfile(e), {
                                loading: "Saving...",
                            })
                        }
                    >
                        <div className="flex items-start justify-between">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-start gap-3">
                                <label
                                    htmlFor="profile_picture"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Profile Picture
                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        id="profile_picture"
                                        className="w-full rounded-lg p-3 border border-gray-200"
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                profile_picture:
                                                    e.target.files[0],
                                            })
                                        }
                                    />
                                    <div className="group/profile relative">
                                        <img
                                            src={
                                                editForm.profile_picture
                                                    ? URL.createObjectURL(
                                                          editForm.profile_picture
                                                      )
                                                    : user.profile_picture
                                            }
                                            alt="profile image"
                                            className="size-24 rounded-full object-cover mt-2"
                                        />
                                        <div className="absolute hidden group-hover/profile:flex top-0 right-0 left-0 bottom-0 bg-black/20 rounded-full items-center justify-center">
                                            <Pencil className="size-5 text-white" />
                                        </div>
                                    </div>
                                </label>
                            </div>
                            {/* Cover photo */}
                            <div className="flex flex-col items-start gap-3">
                                <label
                                    htmlFor="cover_photo"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Cover Photo
                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        id="cover_photo"
                                        className="w-full rounded-lg p-3 border border-gray-200"
                                        onChange={(e) =>
                                            setEditForm({
                                                ...editForm,
                                                cover_photo: e.target.files[0],
                                            })
                                        }
                                    />
                                    <div className="group/cover relative">
                                        <img
                                            src={
                                                editForm.cover_photo
                                                    ? URL.createObjectURL(
                                                          editForm.cover_photo
                                                      )
                                                    : user.cover_photo
                                            }
                                            alt="cover image"
                                            className="w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2"
                                        />
                                        <div className="absolute hidden group-hover/cover:flex top-0 right-0 left-0 bottom-0 bg-black/20 rounded-lg items-center justify-center">
                                            <Pencil className="size-5 text-white" />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="full_name"
                            >
                                Name
                            </label>
                            <input
                                id="full_name"
                                type="text"
                                placeholder="Edit your name"
                                value={editForm.full_name}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        full_name: e.target.value,
                                    })
                                }
                                className="p-3 w-full border border-gray-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="Edit your username"
                                value={editForm.username}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        username: e.target.value,
                                    })
                                }
                                className="p-3 w-full border border-gray-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="bio"
                            >
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                rows={3}
                                placeholder="Edit your name"
                                value={editForm.bio}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        bio: e.target.value,
                                    })
                                }
                                className="p-3 w-full border border-gray-200 rounded-lg"
                            />
                        </div>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="location"
                            >
                                Location
                            </label>
                            <input
                                id="location"
                                type="text"
                                placeholder="Edit your location"
                                value={editForm.location}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        location: e.target.value,
                                    })
                                }
                                className="p-3 w-full border border-gray-200 rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end space-x-3 pt-16">
                            <button
                                type="button"
                                onClick={() => setShowEdit(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-colors text-white cursor-pointer"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
