import { Image, ShieldAlert, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../../src/core/public/store/useChatStore";
import userPlaceholder from "../assets/images/user.png";
import ConfirmationModal from "./confirmationModel";
import MediaFilesDocs from "./mediaDocs";

const ContactInfo = ({ onClose }) => {
  const { selectedUser, deleteChat, blockUser, getBlockedUsers, getUsers, setSelectedUser } = useChatStore();
  
  const [modal, setModal] = useState({ isOpen: false, action: null });
  const [showMediaFiles, setShowMediaFiles] = useState(false);

  if (!selectedUser) return null;

  const handleOpenModal = (action) => {
    setModal({ isOpen: true, action });
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;
    try {
      if (modal.action === "delete") {
        await deleteChat(selectedUser._id);
      } else if (modal.action === "block") {
        await blockUser(selectedUser._id);
        await getBlockedUsers();
        await getUsers();
      }
      setSelectedUser(null);
      setModal({ isOpen: false, action: null });
      onClose();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-screen bg-base-100 shadow-lg p-6 z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <button onClick={onClose} className=" ">
            <X size={28} />
          </button>
          <p className="text-xl font-semibold font-open-sans ">Contact Info</p>
          <div className="w-6"></div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-6">
          <img
            src={selectedUser.profilePic || userPlaceholder}
            alt={selectedUser.fullName}
            className="w-24 h-24 rounded-full border shadow-md"
          />
          <h2 className="text-lg font-semibold mt-2 ">{selectedUser.fullName}</h2>
          <p className="">{selectedUser.email || "No email available"}</p>
        </div>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {/* Media & Docs */}
          <button 
            className="w-full flex items-center gap-3 px-4 py-2 text-lg font-medium font-[Open Sans] rounded-lg hover:bg-base-200"
            onClick={() => setShowMediaFiles(true)}
          >
            <Image size={20} className="" /> Gallery & Docs
          </button>

          

          {/* Delete Chat */}
          <button
            onClick={() => handleOpenModal("delete")}
            className="w-full flex items-center gap-3 px-4 py-2 text-lg font-medium font-[Open Sans] text-red-500 rounded-lg hover:bg-base-200"
          >
            <Trash2 size={20} /> Delete Chat
          </button>

          {/* Block User */}
          <button
            onClick={() => handleOpenModal("block")}
            className="w-full flex items-center gap-3 px-4 py-2 text-lg font-medium font-[Open Sans] text-red-500 rounded-lg hover:bg-base-200"
          >
            <ShieldAlert size={20} /> Block 
          </button>
        </div>
      </div>

      {/* Media & Docs Modal */}
      {showMediaFiles && <MediaFilesDocs onClose={() => setShowMediaFiles(false)} />}

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
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default ContactInfo;
