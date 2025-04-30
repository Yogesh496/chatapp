import { Check, CheckCheck, Download, File, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../src/core/public/store/useAuthStore";
import { useChatStore } from "../../src/core/public/store/useChatStore";
import userPlaceholder from "../assets/images/user.png";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageSkeleton from "../components/skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    unsendMessage, // Make sure this is imported from useChatStore
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const messageRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState("");
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [messageActions, setMessageActions] = useState({
    visible: false,
    messageId: null,
  });

  // Handle image click to enlarge
  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  // Close enlarged image view
  const closeEnlargedImage = () => {
    setEnlargedImage(null);
  };

  // Add this function to handle unsending messages
  const handleUnsendMessage = async (messageId) => {
    if (confirm("Are you sure you want to unsend this message?")) {
      await unsendMessage(messageId);
      setMessageActions({ visible: false, messageId: null });
    }
  };

  useEffect(() => {
    if (selectedUser?._id && authUser) {
      console.log("Fetching messages for user:", selectedUser._id);
      getMessages(selectedUser._id);
      subscribeToMessages();
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser?._id,
    authUser,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader onSearch={setSearchQuery} />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (!authUser || !selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-gray-500">Loading chat...</p>
      </div>
    );
  }

  const MessageBubble = ({ message, isOwn }) => {
    const bubbleClass = isOwn
      ? "bg-blue-500 text-white"
      : "bg-gray-200 text-gray-800";

    return (
      <div
        key={message._id}
        ref={(el) => (messageRefs.current[message._id] = el)}
        className={`flex items-start gap-2 max-w-[50%] mb-3 ${
          isOwn ? "ml-auto justify-end" : "mr-auto"
        }`}
      >
        {!isOwn && (
          <div className="flex-shrink-0 mb-1 hidden sm:block">
            <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
              <img
                src={selectedUser.profilePic || userPlaceholder}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div
          className={`flex flex-col gap-1 ${
            isOwn ? "items-end" : "items-start"
          } group`} // Added 'group' class for hover effects
        >
          {message.text && (
            <div
              className={`p-3 rounded-2xl ${bubbleClass} ${
                isOwn ? "rounded-tr-sm" : "rounded-tl-sm"
              } shadow-sm break-words relative`} // Added 'relative'
            >
              {searchQuery
                ? highlightMatch(message.text, searchQuery).map(
                    (part, index) => (
                      <span key={`${message._id}-${index}`}>{part}</span>
                    )
                  )
                : message.text}

              {/* Three-dot menu (only for own messages) */}
              {isOwn && (
                <div className="message-actions absolute right-0 top-0">
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
                    className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity absolute -right-1 -top-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {messageActions.visible &&
                    messageActions.messageId === message._id && (
                      <div className="absolute top-0 right-6 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleUnsendMessage(message._id)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md whitespace-nowrap"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                          Unsend
                        </button>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {message.image && (
            <div
              className="rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleImageClick(message.image)}
            >
              <img
                src={message.image}
                alt="Attachment"
                className="max-w-[240px] max-h-[180px] object-cover"
                loading="lazy"
              />
            </div>
          )}

          {message.audio && (
            <div
              className={`p-2 rounded-lg ${
                isOwn ? "bg-blue-600" : "bg-white border border-gray-200"
              } shadow-sm`}
            >
              <audio
                controls
                className="w-[180px] h-8 sm:w-[200px]"
                style={{
                  borderRadius: "12px",
                  backgroundColor: isOwn ? "#1e40af" : "#f3f4f6",
                }}
              >
                <source src={message.audio} type="audio/webm" />
              </audio>
            </div>
          )}

          {message.document && (
            <div
              className={`flex items-center gap-3 ${
                isOwn ? "bg-blue-600" : "bg-white border border-gray-200"
              } p-2.5 rounded-lg shadow-sm max-w-xs`}
            >
              <File
                size={18}
                className={isOwn ? "text-white" : "text-blue-600"}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    isOwn ? "text-white" : "text-gray-800"
                  }`}
                >
                  {message.documentName || "Document"}
                </p>
                <button
                  onClick={() => {
                    const fileExtension = message.document.split(".").pop();
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
                  className={`text-xs ${
                    isOwn ? "text-blue-200" : "text-blue-600"
                  } hover:underline`}
                >
                  Open
                </button>
              </div>
              <a
                href={message.document}
                download={message.documentName}
                className={isOwn ? "text-white" : "text-gray-600"}
              >
                <Download size={16} />
              </a>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <time>{formatMessageTime(message.createdAt)}</time>
            {isOwn && (
              <span className="ml-1">
                {message.isSeen ? (
                  <CheckCheck size={14} className="text-blue-500" />
                ) : (
                  <Check size={14} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <ChatHeader onSearch={setSearchQuery} />

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.senderId === authUser._id}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500">
                No messages yet. Start a conversation!
              </p>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      <MessageInput />

      {/* Extra padding for mobile to account for bottom navigation */}
      <div className="h-16 md:h-0 block md:hidden"></div>

      {/* Image Lightbox/Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={closeEnlargedImage}
        >
          <div className="relative max-w-3xl max-h-[80vh]">
            <button
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
              onClick={closeEnlargedImage}
            >
              <X size={20} />
            </button>
            <img
              src={enlargedImage}
              alt="Enlarged view"
              className="max-h-[80vh] rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
