import { Contact, LogOutIcon, MoreVertical, Search, X } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../../src/core/public/store/useChatStore";
import group from "../assets/images/group.png";
import ConfirmationModal from "../components/confirmationModel";
import ContactInfo from "../components/groupContactInfo";

const GroupChatHeader = ({ onSearch }) => {
  const { selectedGroup, setSelectedGroup, getGroups, leaveGroup } = useChatStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, action: null });
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModal = (action) => {
    if (!selectedGroup) return;
    setModal({ isOpen: true, action });
    setMenuOpen(false); // Close menu
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery(""); 
      onSearch(""); 
    }
  };

  const handleLeaveGroup = async () => {
    if (!selectedGroup) return;
    try {
      await leaveGroup(selectedGroup._id); // Assuming `leaveGroup` method is available in the store
      toast.success(`You left the group: ${selectedGroup.name}.`);
      setSelectedGroup(null); // ✅ Close chat window
    } catch (error) {
      toast.error("Failed to leave the group. Please try again.");
    }
    setModal({ isOpen: false, action: null });
  };

  if (!selectedGroup) return null;

  return (
    <div className="relative">
      {showContactInfo && <ContactInfo onClose={() => setShowContactInfo(false)} />}

      <div className="p-2.5 border-b border-base-300 flex items-center justify-between bg-base-100 dark:bg-base-800">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center">
            <div className="relative w-12 h-12">
              <img
                src={selectedGroup?.profilePic || group}
                alt={selectedGroup?.name || "Group"}
                className="w-full h-full object-cover rounded-full shadow-lg"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium ">
              {selectedGroup?.name || "Unknown Group"}
            </h3>
            <p className="text-xs opacity-80 ">
              {selectedGroup.members.length} members • Admin:{" "}
              <span className="font-semibold">{selectedGroup.admin?.fullName || "Unknown"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {!showSearch ? (
            <button onClick={toggleSearch} className="text-base-content dark:text-base-content">
              <Search size={20} />
            </button>
          ) : (
            <div className="relative flex items-center rounded-lg border px-2 py-1 dark:bg-base-700 dark:border-base-600">
              <Search size={20} className="mr-2 text-base-content dark:text-base-content" />
              <input
                type="text"
                placeholder="Search messages..."
                className="outline-none bg-transparent w-40 text-base-content dark:text-base-content"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
              />
              <button onClick={toggleSearch} className="ml-2 text-base-content dark:text-base-content">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="relative">
            <button className="mt-2 text-base-content dark:text-base-content" onClick={() => setMenuOpen(!menuOpen)}>
              <MoreVertical size={20} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 shadow-lg rounded-lg border border-gray-200 dark:border-base-600 z-50 bg-base-100 dark:bg-base-800">
                <button
                  className="flex items-center gap-2 w-full px-4 py-2  dark:hover:bg-base-700"
                  onClick={() => {
                    setShowContactInfo(true);
                    setMenuOpen(false);
                  }}
                >
                  <Contact size={18} /> Group Info
                </button>

                <button
                  className="flex items-center gap-2 w-full px-4 py-2 bg-base-500  hover:bg-base-700 text-red-600"
                  onClick={() => handleOpenModal("leave")}
                >
                  <LogOutIcon size={18} /> Leave Group
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setSelectedGroup(null)} className="text-base-content dark:text-base-content">
            <X />
          </button>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={modal.isOpen}
        title="Leave Group"
        message={`Are you sure you want to leave the group ${selectedGroup?.name}?`}
        onClose={() => setModal({ isOpen: false, action: null })}
        onConfirm={handleLeaveGroup}
      />
    </div>
  );
};

export default GroupChatHeader;
