import { useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../../src/core/public/store/useChatStore";

const CreateGroupModal = ({ onClose, selectedChats }) => {
  const { createGroup } = useChatStore();
  const [groupName, setGroupName] = useState("");

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name.");
      return;
    }
  
    if (!selectedChats || selectedChats.length < 2) {
      toast.error("Select at least 2 members to create a group.");
      console.error("❌ Selected Chats is Empty:", selectedChats);
      return;
    }
  
    try {
      console.log("🚀 Sending Create Group Request:");
      console.log("➡️ Group Name:", groupName);
      console.log("➡️ Selected Users:", selectedChats);
  
      await createGroup({ groupName, members: selectedChats });
  
      toast.success("Group created successfully");
      onClose(); 
      setGroupName("");
    } catch (error) {
      console.error("❌ Group Creation Failed:", error);
      toast.error("Failed to create group");
    }
  };
  

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-base-300 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-3">Create New Group</h2>

        <input
          type="text"
          placeholder="Enter group name..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 outline-none"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button className="px-4 py-2 bg-base-300 rounded-lg" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            
            onClick={() => {
                console.log("🚀 Create Button Clicked - Selected Users:", selectedChats);
                handleCreateGroup();
              }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
