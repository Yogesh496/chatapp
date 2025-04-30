import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "../../src/core/public/store/useChatStore";

const AddUserToGroup = ({ onClose, selectedGroup }) => {
  const { users, addUserToGroup } = useChatStore();
  const [searchUser, setSearchUser] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const alreadyAddedUsers = new Set(
    selectedGroup.members.map((user) => user._id)
  );

  useEffect(() => {
    setFilteredUsers(
      users.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchUser.toLowerCase()) &&
          !alreadyAddedUsers.has(user._id)
      )
    );
  }, [users, searchUser]);

  const handleSelectUser = (userId) => {
    setSelectedUsers((prevSelected) => {
      const updated = new Set(prevSelected);
      if (updated.has(userId)) {
        updated.delete(userId);
      } else {
        updated.add(userId);
      }
      return updated;
    });
  };

  const handleAddUsers = async () => {
    try {
      for (let userId of selectedUsers) {
        console.log("Selected Group ID:", selectedGroup._id);
        console.log("User ID:", userId);

        const response = await addUserToGroup(selectedGroup._id, userId);
        if (response) {
          console.log("User added to group");
        }
      }
      onClose();
    } catch (error) {
      console.error("Error adding users:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-base-100 bg-opacity-40 z-50">
      <div className="bg-base-100 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 left-2  focus:outline-none"
        >
          <X size={24} />
        </button>
        <h2 className="text-lg font-open-sans font-semibold  mt-6">
          Add Member to Group
        </h2>

        <div className="mb-3 mt-2">
          <input
            type="text"
            placeholder="Search users..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-1 focus:ring-blue-400 text-lg"
          />
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between px-3 py-2 hover:bg-base-200 rounded-xl transition"
            >
              <p className="text-lg ">{user.fullName}</p>
              <button
                onClick={() => handleSelectUser(user._id)}
                disabled={alreadyAddedUsers.has(user._id)}
                className={`${
                  selectedUsers.has(user._id)
                    ? "bg-[#81b9a4] text-white"
                    : "bg-gray-300 text-gray-700"
                } text-sm py-1 px-4 rounded-full hover:bg-[#75b8a0] focus:outline-none transition duration-200`}
              >
                {alreadyAddedUsers.has(user._id)
                  ? "Already Added"
                  : selectedUsers.has(user._id)
                  ? "Selected"
                  : "Select"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={handleAddUsers}
            disabled={selectedUsers.size === 0}
            className={`${
              selectedUsers.size === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#81b9a4] hover:bg-[#65ab91]"
            } text-white text-lg w-full py-3 rounded-xl focus:outline-none transition duration-200`}
          >
            Add {selectedUsers.size} Member(s)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserToGroup;
