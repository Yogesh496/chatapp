import { Download, File, MoreVertical, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../../src/core/public/store/useChatStore";
import userPlaceholder from "../assets/images/group.png";
import GroupChatHeader from "../components/groupChatHeader";
import GroupMessageInput from "../components/groupMessageInput";
import { useAuthStore } from "../core/public/store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const GroupChatContainer = () => {
  const {
    messages,
    getGroupMessages,
    isGroupsLoading,
    selectedGroup,
    sendGroupMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
    unsendGroupMessage,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const messageRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [messageActions, setMessageActions] = useState({
    visible: false,
    messageId: null,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedGroup?._id) {
      getGroupMessages(selectedGroup._id, { populateSender: true });
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const messageData = {
      text: messageText,
      senderId: authUser._id,
      groupId: selectedGroup._id,
    };

    try {
      await sendGroupMessage(messageData);

      setTimeout(() => {
        getGroupMessages(selectedGroup._id, { populateSender: true });
      }, 500);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      scrollToMessage();
    }
  }, [searchQuery]);

  const scrollToMessage = () => {
    const matchedMessage = messages.find((msg) =>
      msg.text?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedMessage && messageRefs.current[matchedMessage._id]) {
      messageRefs.current[matchedMessage._id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    return text.split(new RegExp(`(${query})`, "gi")).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-blue-300">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleUnsendMessage = async (messageId) => {
    if (confirm("Are you sure you want to unsend this message?")) {
      await unsendGroupMessage(messageId);
      setMessageActions({ visible: false, messageId: null });
    }
  };

  // Close message actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (messageActions.visible) {
        setMessageActions({ visible: false, messageId: null });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [messageActions.visible]);

  if (isGroupsLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <GroupChatHeader onSearch={setSearchQuery} />
        {/* <MessageSkeleton /> */}
        <GroupMessageInput onSend={handleSendMessage} />
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-500">Select a group to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden w-full h-full relative">
      <GroupChatHeader group={selectedGroup} onSearch={setSearchQuery} />
      <div className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-center">No messages yet.</p>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId?._id === authUser._id;

              return (
                <div
                  key={message._id}
                  ref={(el) => (messageRefs.current[message._id] = el)}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="mr-2">
                      <img
                        src={message.senderId?.profilePic || userPlaceholder}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border object-cover"
                      />
                    </div>
                  )}

                  <div className={`text-sm max-w-[70%] group relative`}>
                    {!isOwnMessage && (
                      <p className="font-semibold mb-2">
                        {message.senderId?.fullName}
                      </p>
                    )}

                    {message.text && (
                      <p
                        className={`px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {highlightMatch(message.text, searchQuery)}
                      </p>
                    )}

                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="w-40 h-40 rounded-md mt-2 object-cover"
                      />
                    )}

                    {message.audio && (
                      <div
                        className={`flex items-center gap-2 p-2 rounded-lg shadow-md w-56 ${
                          isOwnMessage ? "bg-blue-100" : "bg-[#d9ede5]"
                        }`}
                      >
                        <audio
                          controls
                          className="w-full"
                          style={{
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "white",
                          }}
                        >
                          <source src={message.audio} type="audio/webm" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}

                    {message.document && (
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg shadow-md mt-2 max-w-xs ${
                          isOwnMessage ? "bg-blue-100" : "bg-[#edf3f0]"
                        }`}
                      >
                        <File size={22} className="text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {message.documentName || "Document"}
                          </p>
                          <button
                            onClick={() => {
                              const fileExtension = message.document
                                .split(".")
                                .pop();
                              if (
                                ["pdf", "jpg", "png"].includes(
                                  fileExtension.toLowerCase()
                                )
                              ) {
                                window.open(message.document, "_blank");
                              } else {
                                window.location.href = message.document;
                              }
                            }}
                            className="text-blue-500 text-xs hover:underline"
                          >
                            Tap to Open
                          </button>
                        </div>
                        <a
                          href={message.document}
                          download={message.documentName || "document"}
                          className="text-gray-600"
                        >
                          <Download size={20} />
                        </a>
                      </div>
                    )}

                    {/* Message timestamp and unsend option */}
                    <div
                      className={`flex items-center mt-1 text-xs text-gray-500 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <time>{formatMessageTime(message.createdAt)}</time>

                      {isOwnMessage && (
                        <div className="relative ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMessageActions({
                                visible:
                                  messageActions.messageId !== message._id ||
                                  !messageActions.visible,
                                messageId: message._id,
                              });
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical
                              size={14}
                              className="text-gray-400 hover:text-gray-600"
                            />
                          </button>

                          {messageActions.visible &&
                            messageActions.messageId === message._id && (
                              <div
                                className="absolute right-0 bottom-6 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-10"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() =>
                                    handleUnsendMessage(message._id)
                                  }
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  <Trash size={14} />
                                  Unsend
                                </button>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>

                  {isOwnMessage && (
                    <div className="ml-2">
                      <img
                        src={authUser.profilePic || userPlaceholder}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Fixed position for mobile, regular for desktop */}
      <div
        className={`${
          isMobileView ? "fixed bottom-14 left-0 right-0 z-10" : "relative"
        } bg-white`}
      >
        <GroupMessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default GroupChatContainer;
