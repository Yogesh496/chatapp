import React, { useEffect, useState } from "react";
import { FaCog, FaComments, FaUserCircle, FaUsers } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeStore } from "../core/public/store/useThemeStore";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useThemeStore();

  const sidebarItems = [
    {
      id: "Chat",
      icon: <FaComments size={22} />,
      label: "Chat",
      route: "/chat",
    },
    {
      id: "Groups",
      icon: <FaUsers size={22} />,
      label: "Groups",
      route: "/group/chat",
    },
    {
      id: "Profile",
      icon: <FaUserCircle size={22} />,
      label: "Profile",
      route: "/user/profile-setup",
    },
    {
      id: "Settings",
      icon: <FaCog size={22} />,
      label: "Settings",
      route: "/settings",
    },
  ];

  const [activeTab, setActiveTab] = useState(() => {
    return (
      sidebarItems.find((item) => item.route === location.pathname)?.id ||
      "Chat"
    );
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const currentTab = sidebarItems.find(
      (item) => item.route === location.pathname
    )?.id;
    if (currentTab) setActiveTab(currentTab);
  }, [location.pathname]);

  const handleTabClick = (item) => {
    if (activeTab === item.id) return;
    setActiveTab(item.id);
    navigate(item.route);
    setSidebarOpen(false);
  };

  const HamburgerButton = <div></div>;

  // Sidebar drawer for medium-sized screens
  const SidebarDrawer = (
    <div className="fixed inset-0 z-50 w-full h-full bg-white flex flex-col md:hidden">
      <aside className="relative w-full h-full flex flex-col overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-2xl p-2 z-50"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <FiX />
        </button>
        <div className="flex flex-col gap-2 mt-16 p-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`flex items-center gap-3 p-3 rounded-lg text-lg ${
                activeTab === item.id
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );

  // Sidebar for desktop
  const SidebarDesktop = (
    <div
      className={`hidden md:flex lg:w-20 md:w-16 flex-col items-center py-6 space-y-8 border-r ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {sidebarItems.map((item) => (
        <div
          key={item.id}
          onClick={() => handleTabClick(item)}
          className={`p-3 rounded-lg cursor-pointer transition-all duration-200
            ${
              activeTab === item.id
                ? theme === "light"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-blue-700 text-white shadow-md"
                : theme === "light"
                ? "hover:bg-blue-100 text-gray-600"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          title={item.label}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );

  // Bottom nav for small mobile devices
  const BottomNav = (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item)}
            className={`p-2 rounded-lg flex flex-col items-center justify-center ${
              activeTab === item.id ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <div>{item.icon}</div>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {HamburgerButton}
      {sidebarOpen && SidebarDrawer}
      {SidebarDesktop}
      {BottomNav}
    </>
  );
};

export default SideBar;
