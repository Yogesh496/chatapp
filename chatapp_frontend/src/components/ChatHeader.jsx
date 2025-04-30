import {
  ArrowLeft,
  Contact,
  MoreVertical,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { MdBlock } from "react-icons/md";
import userPlaceholder from "../../src/assets/images/user.png";
import { useAuthStore } from "../../src/core/public/store/useAuthStore";
import { useChatStore } from "../../src/core/public/store/useChatStore";
import ConfirmationModal from "../components/confirmationModel";
import ContactInfo from "../components/contactInfo";

const ChatHeader = ({ onSearch }) => {
  const {
    selectedUser,
    setSelectedUser,
    deleteChat,
    blockUser,
    getBlockedUsers,
    getUsers,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, action: null });
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Open confirmation modal for delete or block
  const handleOpenModal = (action) => {
    if (!selectedUser) return;
    setModal({ isOpen: true, action });
    setMenuOpen(false); // Close menu
  };

  // 🔹 Toggle search input
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery("");
      onSearch("");
    }
  };

  // 🔹 Handle blocking a user
  const handleBlockUser = async () => {
    if (!selectedUser) return;
    try {
      await blockUser(selectedUser._id);
      toast.success(`${selectedUser.fullName} has been blocked.`);
      await getBlockedUsers();
      await getUsers(); // Refresh users list
      setSelectedUser(null); // ✅ Close chat
    } catch (error) {
      toast.error("Failed to block user. Please try again.");
    }
    setModal({ isOpen: false, action: null });
  };

  // 🔹 Handle deleting a chat
  const handleDeleteChat = async () => {
    if (!selectedUser) return;
    try {
      await deleteChat(selectedUser._id);
      toast.success(`Chat with ${selectedUser.fullName} deleted.`);
      setSelectedUser(null); // ✅ Close chat window
    } catch (error) {
      toast.error("Failed to delete chat. Please try again.");
    }
    setModal({ isOpen: false, action: null });
  };

  return (
    <div className="relative">
      {/* Contact Info Popup */}
      {showContactInfo && (
        <ContactInfo onClose={() => setShowContactInfo(false)} />
      )}

      {/* Chat Header */}
      <div className="p-2.5 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          {/* Back button for mobile */}
          <button
            className="md:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={() => setSelectedUser(null)}
          >
            <ArrowLeft size={20} />
          </button>

          {/* Profile Picture */}
          <div className="flex justify-center items-center">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <img
                src={selectedUser?.profilePic || userPlaceholder}
                alt={selectedUser?.name || "User"}
                className="w-full h-full object-cover rounded-full border border-gray-200 shadow-sm"
              />
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-medium">
              {selectedUser?.fullName || "Unknown User"}
            </h3>
            <p
              className={`text-xs ${
                onlineUsers.includes(selectedUser?._id)
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Button/Input */}
          {!showSearch ? (
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Search size={18} />
            </button>
          ) : (
            <div className="relative flex items-center rounded-lg border px-2 py-1">
              <Search size={18} className="mr-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="outline-none bg-transparent w-32 md:w-40 text-sm"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                autoFocus
              />
              <button onClick={toggleSearch} className="ml-1 text-gray-500">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Three-Dot Menu */}
          <div className="relative">
            <button
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical size={18} />
            </button>

            {/* Options Menu */}
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 shadow-lg rounded-lg border border-gray-200 z-50 bg-white">
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setShowContactInfo(true);
                    setMenuOpen(false);
                  }}
                >
                  <Contact size={16} /> Contact Info
                </button>

                <button
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-red-600"
                  onClick={() => handleOpenModal("delete")}
                >
                  <Trash2 size={16} /> Delete Chat
                </button>

                <button
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-50 transition-colors text-red-600"
                  onClick={() => handleOpenModal("block")}
                >
                  <MdBlock size={16} /> Block
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modal.isOpen}
        title={modal.action === "delete" ? "Delete Chat" : "Block User"}
        message={
          modal.action === "delete"
            ? `Are you sure you want to delete the chat with ${selectedUser?.fullName}?`
            : `Are you sure you want to block ${selectedUser?.fullName}?`
        }
        onClose={() => setModal({ isOpen: false, action: null })}
        onConfirm={
          modal.action === "delete" ? handleDeleteChat : handleBlockUser
        }
      />
    </div>
  );
};

export default ChatHeader;
