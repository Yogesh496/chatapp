import { format, isToday, isYesterday } from "date-fns";
import { Download, File, X } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../../src/core/public/store/useChatStore";

const formatTimestamp = (date) => {
  const messageDate = new Date(date);
  if (isToday(messageDate)) {
    return format(messageDate, "h:mm a"); 
  } else if (isYesterday(messageDate)) {
    return "Yesterday";
  } else {
    return format(messageDate, "dd/MM/yyyy"); 
  }
};

const MediaDocs = ({ onClose }) => {
  const { messages } = useChatStore();

  const mediaMessages = messages.filter((msg) =>
    msg.image && (msg.image.endsWith(".jpg") || msg.image.endsWith(".jpeg") || msg.image.endsWith(".png"))
  );
  const documentMessages = messages.filter((msg) => msg.document);

  const [activeTab, setActiveTab] = useState("gallery");

  return (
    <div className="absolute top-0 left-0 w-full h-screen bg-base-100 shadow-lg p-6 z-50 overflow-y-auto animate-slideIn">
      <div className="flex items-center justify-between border-b pb-4">
        <button onClick={onClose} className=" ">
          <X size={28} />
        </button>
        <p className="text-lg font-semibold font-open-sans 0">Gallery & Docs</p>
        <div className="w-6"></div>
      </div>

      <div className="flex justify-around mt-4 border-b pb-2">
        <button
          className={`w-1/2 pb-2 text-center text-lg font-medium transition ${
            activeTab === "gallery" ? "border-b-4 border-blue-600 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery
        </button>
        <button
          className={`w-1/2 pb-2 text-center text-lg font-medium transition ${
            activeTab === "documents" ? "border-b-4 border-blue-500 text-blue-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("documents")}
        >
          Documents
        </button>
      </div>
      <div className="mt-4">
        {activeTab === "gallery" && (
          <div className="grid grid-cols-3 gap-1">
            {mediaMessages.length > 0 ? (
              mediaMessages.map((msg, index) => (
                <div key={index} className="relative group">
                  <a href={msg.image} target="_blank" rel="noopener noreferrer">
                    <img
                      src={msg.image}
                      alt="Gallery"
                      className="w-52 h-full object-cover rounded-lg shadow-md hover:opacity-80 transition group-hover:scale-105"
                      style={{ objectFit: "cover" }}
                    />
                  </a>
                  <div className="absolute bottom-1 left-36 text-white bg-black bg-opacity-50 text-xs px-2 py-0.5 rounded">
                    {formatTimestamp(msg.createdAt)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center mt-3">No gallery available.</p>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="mt-4 space-y-3">
            {documentMessages.length > 0 ? (
              documentMessages.map((msg, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-md hover:bg-gray-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <File size={22} className="text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 truncate w-40">
                        {msg.documentName || "File"}
                      </p>
                      <p className="text-xs text-gray-500">{formatTimestamp(msg.createdAt)}</p>
                    </div>
                  </div>
                  <a
                    href={msg.document}
                    download={msg.documentName || "file"}
                    className="text-gray-600 hover:text-blue-500 transition"
                  >
                    <Download size={20} />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center mt-3">No documents available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaDocs;
