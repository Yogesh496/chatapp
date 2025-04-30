
import {
  Camera,
  Edit3Icon,
  Image,
  LogOutIcon,
  PlusCircle,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MdGroup } from "react-icons/md";
import { useChatStore } from "../../src/core/public/store/useChatStore";
import group from "../assets/images/group.png";
import AddUserToGroup from "../components/addUserToGroup";
import MediaFilesDocs from "../components/mediaDocs";

const GroupContactInfo = ({ onClose }) => {
  const {
    selectedGroup,
    updateGroupProfile,
    updateGroupName,
    getUsers,
    addUserToGroup,
    leaveGroup,
    users,
  } = useChatStore(); 
  const [showMediaFiles, setShowMediaFiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    selectedGroup?.profilePic || group
  );
  const [isEditingName, setIsEditingName] = useState(false);
  const [groupName, setGroupName] = useState(selectedGroup?.name || "");
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const formattedDate = new Date(selectedGroup.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }
  );

  useEffect(() => {
    if (selectedGroup) {
      console.log("selectedGroup:", selectedGroup);
      const createdAt = selectedGroup.createdAt;
      console.log("createdAt:", createdAt);

      if (createdAt) {
        const formattedDate = new Date(createdAt);
        console.log("Formatted Date:", formattedDate);

        if (isNaN(formattedDate)) {
          console.error("Invalid Date format:", createdAt);
        } else {
          console.log("Valid Date:", formattedDate);
        }
      } else {
        console.error("createdAt is undefined or null");
      }
    }

    getUsers();
  }, [selectedGroup]);

  if (!selectedGroup) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      const requestBody = {
        profilePic: base64Image,
      };

      try {
        await updateGroupProfile(selectedGroup._id, requestBody);
        console.log("Profile picture updated successfully");
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    };
    reader.onerror = (error) => {
      console.error("Error converting image to base64:", error);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleNameChange = () => {
    if (groupName !== selectedGroup.name) {
      updateGroupName(selectedGroup._id, groupName)
        .then(() => {
          console.log("Group name updated successfully");
          setIsEditingName(false);
        })
        .catch((error) => {
          console.error("Error updating group name:", error);
        });
    } else {
      setIsEditingName(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(selectedGroup._id); 
      console.log("Successfully left the group");
      onClose(); 
    } catch (error) {
      console.error("Error leaving the group:", error);
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 font-open-sans w-full h-screen bg-base-100 shadow-lg p-6 z-50 overflow-y-auto">
        {/* Header */}
        <div className="flex gap-5 border-b pb-2">
          <button onClick={onClose} className=" ">
            <X size={24} />
          </button>
          <p className="text-lg font-semibold ">Group Info</p>
          <div className="w-6"></div>
        </div>

        <div className="flex flex-col items-center mt-1 space-y-2">
          <div className="relative group">
            <img
              src={previewImage}
              alt={selectedGroup.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
            />
            <label
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 bg-[#589881] hover:bg-[#4aa785] text-white p-2 rounded-full cursor-pointer"
            >
              <Camera size={20} className="" />
            </label>
          </div>

          <input
            type="file"
            id="profilePic"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center space-x-2">
            <p className="text-xs ">Click the camera icon</p>
            {selectedFile && (
              <button
                className="px-2 py-1  text-white underline text-xs rounded-lg hover:bg-gray-700"
                onClick={handleUpload}
              >
                Upload
              </button>
            )}
          </div>

          {/* Group Name */}
          <div className="mt-4 flex items-center justify-between w-full">
            {isEditingName ? (
              <div className="flex items-center w-full space-x-2">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleNameChange}
                  className="px-3 py-2 bg-[#93b6a8] text-white rounded-lg hover:bg-[#408e72]"
                >
                  ✔
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-2 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full space-x-1">
                <h2 className="text-lg font-semibold ">{selectedGroup.name}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className=" hover:text-gray-700 text-xs p-2"
                >
                  <Edit3Icon size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-start justify-between w-full text-xs  border-b py-3">
            Group created by {selectedGroup.admin?.fullName || "Unknown"} on{" "}
            {formattedDate || "Unknown Date"}
          </div>

          {/* Add User and Media Buttons */}
          <div className="mt-6 w-full">
            <button
              className="w-full flex items-center gap-3 py-2 px-2 font-semibold rounded-lg hover:bg-base-200 transition duration-200"
              onClick={() => setShowMediaFiles(true)}
            >
              <Image size={22} className="" /> Gallery & Docs
            </button>
          </div>

          <div className="w-full flex items-start justify-between">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="w-full py-2 px-2 font-semibold flex items-start   rounded-lg hover:bg-base-200"
            >
              <PlusCircle size={22} className="mr-2" />
              Add member to group
            </button>
          </div>

          <div className="w-full  border-b p-2">
            <div className="flex items-center gap-2">
              <MdGroup size={22} className="mb-2" />
              <p className="text-sm font-semibold  mb-2">
                {selectedGroup.members.length} Members
              </p>
            </div>
            <ul className="text-xs  space-y-2 max-h-36 overflow-y-auto">
              {selectedGroup.members.map((member) => (
                <li key={member._id} className="truncate">
                  {member.fullName || "Unknown Member"}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scrollable content wrapper */}
        <div className="overflow-y-auto mt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLeaveGroup}
              className="w-full py-2 px-2 font-semibold text-red-600 rounded-lg hover:bg-base-200 flex items-center gap-2"
            >
              <LogOutIcon size={20} />
              Leave Group
            </button>
          </div>
        </div>
      </div>

      {showMediaFiles && (
        <MediaFilesDocs onClose={() => setShowMediaFiles(false)} />
      )}
      {showAddUserModal && (
        <AddUserToGroup
          onClose={() => setShowAddUserModal(false)}
          selectedGroup={selectedGroup}
        />
      )}
    </>
  );
};

export default GroupContactInfo;
