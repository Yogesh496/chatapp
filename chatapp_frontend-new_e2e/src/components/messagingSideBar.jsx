import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheckSquare,
  FiMoreHorizontal,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { IoMdChatbubbles } from "react-icons/io";
import { MdGroupAdd } from "react-icons/md";
import { useAuthStore } from "../../src/core/public/store/useAuthStore";
import { useChatStore } from "../../src/core/public/store/useChatStore";
import userPlaceholder from "../assets/images/user.png";
import CreateGroupModal from "../components/createGroupModel";


const MessagingSidebar = () => {
  const {
    getUsers,
    users,
    blockedUsers,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    markAsSeen,
    deleteChat,
    markAsUnread,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showAddOptions, setShowAddOptions] = useState(false);
  const [isSelectingChats, setIsSelectingChats] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChats, setSelectedChats] = useState([]);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = debounce((e) => setSearchQuery(e.target.value), 500);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const toggleUserSelection = (userId) => {
    setSelectedChats((prevSelected) => {
      const newSelection = prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId];

      console.log("Updated Selected Users:", newSelection);
      return newSelection;
    });
  };

  const handleDeleteChats = async () => {
    for (const userId of selectedChats) {
      await deleteChat(userId);
    }
    setSelectedChats([]);
    setIsSelectingChats(false);
    setShowOptionsMenu(false);
    getUsers();
  };

  const handleMarkAsUnread = async () => {
    for (const userId of selectedChats) {
      await markAsUnread(userId);
    }
    setSelectedChats([]);
    setIsSelectingChats(false);
    setShowOptionsMenu(false);
  };

  
  const handleUserSelect = (user) => {
    if (!isSelectingChats) {
      setSelectedUser(user);
      
    }
  };

  const sortedUsers = [...users]
    .filter((user) => !blockedUsers.some((blocked) => blocked._id === user._id))
    .filter((user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(
      (a, b) =>
        (b.isUnread ? 1 : 0) - (a.isUnread ? 1 : 0) ||
        (b.lastMessageTime || 0) - (a.lastMessageTime || 0)
    );

  
  const shouldHideSidebar = isMobileView && selectedUser;

  
  return (
    <>
      <aside
        className={`h-full border-r border-gray-200 flex flex-col shadow-lg font-open-sans w-full md:w-72 bg-white ${
          shouldHideSidebar ? "hidden" : "flex"
        }`}
      >
        {!isSelectingChats && (
          <div className="p-4 flex items-center justify-between shadow bg-white">
            <h1 className="text-lg font-bold text-gray-900">Messaging</h1>
            <button
              className="btn btn-sm btn-circle hover:bg-blue-100 border-blue-200"
              onClick={() => setShowAddOptions((prev) => !prev)}
            >
              <FiPlus className="text-blue-600" />
            </button>
          </div>
        )}

        {isSelectingChats && (
          <div className="p-4 flex items-center bg-white shadow">
            <button
              onClick={() => {
                setIsSelectingChats(false);
                setShowOptionsMenu(false);
                setSelectedChats([]);
              }}
              className="text-gray-800 hover:text-blue-600 transition-colors"
            >
              <FiArrowLeft
                size={20}
                className="btn btn-xs btn-circle hover:bg-blue-100"
              />
            </button>
            <div className="flex items-center justify-center">
              <p className="text-lg ml-12 mr-10 font-semibold text-gray-900">
                Select Chats
              </p>
            </div>

            {selectedChats.length > 0 && (
              <button
                onClick={() => setShowOptionsMenu((prev) => !prev)}
                className="btn btn-sm btn-circle hover:bg-blue-100"
              >
                <FiMoreHorizontal size={24} className="text-blue-600" />
              </button>
            )}
          </div>
        )}

        <div className="p-4 bg-white sticky top-0 z-10">
          <div className="input input-bordered flex items-center gap-2 hover:border-blue-400 focus-within:border-blue-500 transition-colors">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              onChange={handleSearch}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user) => (
              <div
                key={user._id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all 
                  ${
                    selectedUser?._id === user._id
                      ? "bg-blue-100 "
                      : "hover:bg-gray-100"
                  }`}
                onClick={() => handleUserSelect(user)}
              >
                {isSelectingChats && (
                  <input
                    type="checkbox"
                    className="checkbox checkbox-blue"
                    checked={selectedChats.includes(user._id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleUserSelection(user._id);
                    }}
                  />
                )}

                <div className="relative flex-shrink-0">
                  <img
                    src={user.profilePic || userPlaceholder}
                    alt={user.name}
                    className="size-12 object-cover rounded-full border-2 border-gray-200"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span
                      className="absolute bottom-0 right-0 size-3 bg-blue-500 
                      rounded-full ring-2 ring-white"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`truncate ${user.isUnread ? "font-bold" : ""}`}>
                    {user.fullName}
                  </p>
                  <p className="text-xs truncate text-gray-500">
                    {user.latestMessage !== "Chat deleted" ? (
                      user.latestMessage
                    ) : (
                      <span className="italic">Chat deleted</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No users found</div>
          )}
        </div>

        {/* Menu Options */}
        {!isSelectingChats && showAddOptions && (
          <div className="absolute top-14 right-4 w-40 shadow-lg border rounded-md bg-white z-50">
            <button
              className="flex items-center justify-between gap-3 w-full px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setIsSelectingChats(true)}
            >
              <IoMdChatbubbles size={18} /> Select Chats
            </button>
          </div>
        )}

        {showOptionsMenu && selectedChats.length > 0 && (
          <div className="absolute top-14 left-4 md:left-48 w-44 bg-white shadow-lg rounded-lg border p-2 z-50">
            <button
              className="w-full mb-3 p-2 rounded flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600"
              onClick={handleDeleteChats}
            >
              <FiTrash2 /> Delete Chats
            </button>
            <button
              className="w-full mb-3 p-2 rounded flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600"
              onClick={handleMarkAsUnread}
            >
              <FiCheckSquare /> Mark as Unread
            </button>
            <button
              className="w-full p-2 rounded flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600"
              onClick={() => setIsCreatingGroup(true)}
            >
              <MdGroupAdd /> Create Group
            </button>
          </div>
        )}
      </aside>

      {/* Group creation modal */}
      {isCreatingGroup && (
        <CreateGroupModal
          onClose={() => {
            setIsCreatingGroup(false);
            setIsSelectingChats(false);
            setSelectedChats([]);
          }}
          selectedChats={selectedChats}
        />
      )}
    </>
  );
};

export default MessagingSidebar;
