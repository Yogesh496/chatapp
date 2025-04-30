import { Camera, Mail, Pencil, User } from "lucide-react";
import { useEffect, useState } from "react";
import userPlaceholder from "../../../assets/images/user.png";
import SideBar from "../../../components/SideBar";
import { useThemeStore } from "../../public/store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const { theme } = useThemeStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [editingFullName, setEditingFullName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newFullName, setNewFullName] = useState(authUser?.fullName || "");
  const [newEmail, setNewEmail] = useState(authUser?.email || "");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSave = () => {
    if (newFullName !== authUser?.fullName || newEmail !== authUser?.email) {
      console.log("Updated Profile Data: ", {
        fullName: newFullName,
        email: newEmail,
      });
      updateProfile({ fullName: newFullName, email: newEmail });
    }
    setEditingFullName(false);
    setEditingEmail(false);
  };

  return (
    <div
      className={`bg-base-200 min-h-screen ${theme === "dark" ? "dark" : ""}`}
    >
      <div className="flex h-screen">
        <SideBar active="Profile" />

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div
            className={`bg-base-100 rounded-lg shadow-lg max-w-3xl mx-auto p-6 ${
              isMobileView ? "mt-0" : "mt-4"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-6 text-center">Profile</h2>

            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="relative">
                <img
                  src={selectedImg || authUser?.profilePic || userPlaceholder}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                />

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-[#69aa92] hover:bg-[#82c6ad] text-white p-2 rounded-full cursor-pointer shadow-md hover:scale-105 transition-transform duration-200"
                >
                  <Camera size={20} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>

              <p className="text-sm text-gray-500">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>

            {/* Profile Details Section */}
            <div className="space-y-6 max-w-md mx-auto">
              {/* Full Name */}
              <div className="p-4 rounded-lg bg-base-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Full Name</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {editingFullName ? (
                    <input
                      type="text"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Your full name"
                    />
                  ) : (
                    <p className="px-3 py-2 flex-1 rounded-lg border border-gray-300 bg-white">
                      {authUser?.fullName || "Not set"}
                    </p>
                  )}
                  <button
                    onClick={() => setEditingFullName((prev) => !prev)}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-lg bg-base-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Email Address</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {editingEmail ? (
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Your email address"
                    />
                  ) : (
                    <p className="px-3 py-2 flex-1 rounded-lg border border-gray-300 bg-white">
                      {authUser?.email || "Not set"}
                    </p>
                  )}
                  <button
                    onClick={() => setEditingEmail((prev) => !prev)}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Save Button */}
              {(editingFullName || editingEmail) && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}

              {/* Account Information Section */}
              <div className="mt-8 p-5 rounded-lg bg-base-200 shadow-sm">
                <h3 className="text-lg font-medium mb-4">
                  Account Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-gray-300">
                    <span>Member Since</span>
                    <span>{authUser?.createdAt?.split("T")[0] || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Account Status</span>
                    <span className="text-green-600 font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
