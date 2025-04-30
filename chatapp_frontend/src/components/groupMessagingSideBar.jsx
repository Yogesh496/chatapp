import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiMoreHorizontal, FiPlus, FiSearch, FiTrash2, FiUsers } from "react-icons/fi";
import { MdGroupAdd } from "react-icons/md";
import { useAuthStore } from "../../src/core/public/store/useAuthStore";
import { useChatStore } from "../../src/core/public/store/useChatStore";
import groupPlaceholder from "../assets/images/group.png";
import CreateGroupModal from "./createGroupModel";

const GroupMessagingSidebar = () => {
  const {
    groups,
    selectedGroup,
    setSelectedGroup,
    getGroups,
    deleteGroup,
    isGroupsLoading
  } = useChatStore();
  
  const { authUser } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Handle window resize to track mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = debounce((e) => setSearchQuery(e.target.value), 500);

  useEffect(() => {
    getGroups();
  }, [getGroups]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
  };

  // Filter and sort groups
  const filteredGroups = groups
    .filter((group) => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by newest message first
      return (b.lastMessageTime || 0) - (a.lastMessageTime || 0);
    });

  // Check if sidebar should be hidden (mobile with selected group)
  const shouldHideSidebar = isMobileView && selectedGroup;

  return (
    <>
      <aside className={`h-full border-r border-gray-200 flex flex-col shadow-lg font-open-sans w-full md:w-72 bg-white ${shouldHideSidebar ? 'hidden' : 'flex'}`}>
        <div className="p-4 flex items-center justify-between shadow bg-white">
          <h1 className="text-lg font-bold text-gray-900">Group Chats</h1>
          <button
            className="btn btn-sm btn-circle hover:bg-blue-100 border-blue-200"
            onClick={() => setIsCreatingGroup(true)}
          >
            <FiPlus className="text-blue-600" />
          </button>
        </div>

        <div className="p-4 bg-white sticky top-0 z-10">
          <div className="input input-bordered flex items-center gap-2 hover:border-blue-400 focus-within:border-blue-500 transition-colors">
            <FiSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search groups..."
              onChange={handleSearch}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <div
                key={group._id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all 
                  ${selectedGroup?._id === group._id
                    ? "bg-blue-100" 
                    : "hover:bg-gray-100"
                  }`}
                onClick={() => handleGroupSelect(group)}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={group.groupPic || groupPlaceholder}
                    alt={group.name}
                    className="size-12 object-cover rounded-full border-2 border-gray-200"
                  />
                  <div className="absolute -bottom-1 -right-1 size-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                    {group.members?.length || 0}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`truncate ${group.isUnread ? "font-bold" : ""}`}>
                    {group.name}
                  </p>
                  <p className="text-xs truncate text-gray-500">
                    {group.lastMessage ? (
                      <span>
                        <span className="font-medium">
                          {group.lastMessageSender === authUser?._id 
                            ? "You" 
                            : group.lastMessageSenderName?.split(" ")[0]}:
                        </span>{" "}
                        {group.lastMessage}
                      </span>
                    ) : (
                      <span className="italic">No messages yet</span>
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              {isGroupsLoading ? "Loading groups..." : "No groups found"}
            </div>
          )}
        </div>

        {!filteredGroups.length && !isGroupsLoading && (
          <div className="p-4 text-center">
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => setIsCreatingGroup(true)}
            >
              <MdGroupAdd size={18} /> Create a Group
            </button>
          </div>
        )}
      </aside>

      {/* Create group modal */}
      {isCreatingGroup && (
        <CreateGroupModal
          onClose={() => setIsCreatingGroup(false)}
          selectedMembers={[]}
          isNewGroup={true}
        />
      )}
    </>
  );
};

export default GroupMessagingSidebar;
