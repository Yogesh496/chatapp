import { Bell, ChevronRight, Palette, UserX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/SideBar";
import { useAuthStore } from "../public/store/useAuthStore";
import { useChatStore } from "../public/store/useChatStore";
import { useThemeStore } from "../public/store/useThemeStore";

const Settings = () => {
  const { blockedUsers, getBlockedUsers, unblockUser } = useChatStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { theme, setTheme } = useThemeStore();
  const [activePanel, setActivePanel] = useState("settings");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notifications_enabled") !== "false"
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      await getBlockedUsers();
    };
    fetchBlockedUsers();
  }, [getBlockedUsers]);

  const handleUnblock = async (userId) => {
    await unblockUser(userId);
    await getBlockedUsers();
  };

  const handleLogout = () => {
    logout();
    navigate("/login-user");
  };

  const toggleNotifications = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem("notifications_enabled", newValue.toString());

    if (newValue && "Notification" in window) {
      Notification.requestPermission();
    }
  };

  return (
    <div
      className={`bg-base-200 min-h-screen ${theme === "dark" ? "dark" : ""}`}
    >
      <div className="flex h-screen">
        <SideBar />

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div
            className={`bg-base-100 rounded-lg shadow-lg max-w-3xl mx-auto p-6 ${
              isMobileView ? "mt-0" : "mt-4"
            }`}
          >
            {/* Main Settings Panel */}
            {activePanel === "settings" && (
              <div>
                <h2 className="text-2xl font-semibold mb-8 text-center md:text-left">
                  Settings
                </h2>

                {/* Theme Option */}
                <div className="mb-8 p-4 bg-base-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Palette size={22} className="text-primary" />
                    <h3 className="text-lg font-medium">Appearance</h3>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-sm">Light</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={theme === "dark"}
                        onChange={(e) =>
                          setTheme(e.target.checked ? "dark" : "light")
                        }
                      />
                      <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full transition-colors">
                        <div
                          className="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out"
                          style={{
                            transform: `translateX(${
                              theme === "dark" ? "100%" : "0%"
                            })`,
                          }}
                        />
                      </div>
                    </label>
                    <span className="text-sm">Dark</span>
                  </div>
                </div>

                {/* Notifications Option */}
                <div className="mb-8 p-4 bg-base-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Bell size={22} className="text-primary" />
                    <h3 className="text-lg font-medium">Notifications</h3>
                  </div>
                  <div className="flex items-center justify-between px-2">
                    <span>Desktop Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationsEnabled}
                        onChange={toggleNotifications}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Blocked Accounts Option */}
                <div
                  className="mb-8 p-4 bg-base-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-base-300 transition"
                  onClick={() => setActivePanel("blocked")}
                >
                  <div className="flex items-center gap-4">
                    <UserX size={22} className="text-error" />
                    <h3 className="text-lg font-medium">Blocked Accounts</h3>
                  </div>
                  <ChevronRight size={22} />
                </div>

                {/* Logout Button */}
                <div className="mt-10 flex items-center justify-center">
                  <button
                    onClick={handleLogout}
                    className="btn btn-error px-8 py-2 text-white flex items-center justify-center font-medium rounded-md shadow-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Blocked Users Panel */}
            {activePanel === "blocked" && (
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-error">
                    Blocked Users
                  </h3>
                  <button
                    onClick={() => setActivePanel("settings")}
                    className="btn btn-circle btn-sm btn-ghost"
                  >
                    <X size={20} />
                  </button>
                </div>

                {blockedUsers.length === 0 ? (
                  <div className="text-center py-8 bg-base-200 rounded-lg">
                    <p className="text-lg">No blocked users</p>
                    <p className="text-sm text-gray-500 mt-2">
                      When you block someone, they will appear here
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {blockedUsers.map((user) => (
                      <li
                        key={user._id}
                        className="flex items-center justify-between p-4 rounded-md bg-base-200 hover:bg-base-300 transition"
                      >
                        <span className="font-medium">
                          {user.fullName || "Unknown User"}
                        </span>
                        <button
                          onClick={() => handleUnblock(user._id)}
                          className="btn btn-error btn-sm"
                        >
                          Unblock
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
