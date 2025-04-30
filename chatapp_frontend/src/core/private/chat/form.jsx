// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { FiMoreVertical, FiSearch } from "react-icons/fi";
// import ChatSideBar from "../../../components/chatSideBar";
// import { useAuth } from "../../../context/authContext"; // Import the useAuth hook

// const ChatApp = () => {
//   const { user } = useAuth(); // Get the current logged-in user from the context
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [userProfiles, setUserProfiles] = useState([]); // State to hold user profiles

//   // Fetch user profiles when component mounts
//   useEffect(() => {
//     const fetchUserProfiles = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/api/user/profile/profiles");
//         console.log(response.data); // Log the data to ensure it contains the expected structure
//         setUserProfiles(response.data);
//       } catch (error) {
//         console.error("Error fetching user profiles", error);
//       }
//     };

//     fetchUserProfiles();
//   }, []);

//   // Fetch messages between logged-in user and selected user
//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (selectedChat && selectedChat._id) {  // Ensure selectedChat and its _id are valid
//         try {
//           const response = await axios.get(
//             `http://localhost:3000/api/message/messages/${user.id}/${selectedChat._id}`
//           );
//           console.log(response.data); // Log the fetched messages to check the structure
//           setMessages(response.data);
//         } catch (error) {
//           console.error("Error fetching messages", error);
//         }
//       }
//     };

//     fetchMessages();
//   }, [selectedChat, user.id]); // Fetch messages when selectedChat or user.id changes

//   const handleUserClick = (profile) => {
//     setSelectedChat(profile); // Set selected user profile when a user is clicked
//     console.log("Selected chat:", profile); // Log to check if the user is selected correctly
//   };

//   const handleSendMessage = async () => {
//     if (message.trim() === "") {
//       console.log("Message is empty");
//       return;
//     }

//     console.log("Sending message:", message);

//     try {
//       const token = localStorage.getItem('token');  // Retrieve the token from storage

//       // Make sure selectedChat exists and has the necessary fields
//       if (!selectedChat || !selectedChat.name) {
//         console.error("No selected chat available");
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:3000/api/message/send",
//         {
//           senderId: user.id,
//           receiverId: selectedChat._id, // Use the selectedChat directly
//           messageContent: message,  // Send message content
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("Message Sent Successfully:", response.data);

//       // Update the state to include the new message
//       setMessages((prevMessages) => [...prevMessages, response.data]);

//       // Clear the input field after sending
//       setMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error.response ? error.response.data : error.message);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-white font-open-sans">
//       <ChatSideBar />
//       <div className="flex-[1.5] flex flex-col">
//         {/* Header */}
//         <div className="bg-white text-black px-4 py-3 flex items-center justify-between shadow">
//           <div className="flex items-center">
//             <h1 className="text-xl mt-6 mr-2">Messaging</h1>
//             <span className="text-xs bg-red-500 py-1 px-1 text-white font-extralight rounded-lg">
//               32
//             </span>
//           </div>
//           <button className="text-blue-500 text-2xl font-bold">+</button>
//         </div>

//         {/* Search Bar */}
//         <div className="px-4 py-2 bg-white shadow flex items-center space-x-2">
//           <span className="text-gray-500">
//             <FiSearch className="h-5 w-5" />
//           </span>
//           <input
//             type="text"
//             placeholder="Search ..."
//             className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* User Profiles Below Search Bar */}
//         <div className="px-6 bg-white overflow-y-auto space-y-1">
//           <h2 className="text-lg font-semibold">Users</h2>
//           {userProfiles.map((profile) => (
//             <div
//               key={profile._id} // Ensure that _id is present
//               className="flex items-center p-3 border-b hover:bg-gray-100 cursor-pointer"
//               onClick={() => handleUserClick(profile)} // Handle user profile click
//             >
//               <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
//               <div className="ml-4">
//                 <h2 className="font-semibold text-gray-800">{profile.name}</h2>
//                 <p className="text-sm text-gray-500">{profile.email}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-[3] bg-white p-4">
//         {/* Only render the chat area if `selectedChat` is valid */}
//         {selectedChat ? (
//           <>
//             <div className="flex items-center justify-between pb-4 p-3 border-b bg-[#EBF3F0]">
//               <div className="flex items-center space-x-4">
//                 <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
//                 <div>
//                   <h2 className="font-bold text-gray-800">
//                     {selectedChat ? selectedChat.name : "Select a chat"}
//                   </h2>
//                   <p className="text-xs text-gray-500">Online</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <button>
//                   <FiSearch className="h-5 w-5 text-gray-600" />
//                 </button>
//                 <button>
//                   <FiMoreVertical className="h-5 w-5 text-gray-600" />
//                 </button>
//               </div>
//             </div>

//             {/* Chat Messages */}
//             <div className="mt-4 flex flex-col space-y-4">
//               {messages.map((msg) => (
//                 <div
//                   key={msg.timestamp}
//                   className={
//                     msg.sender._id === user.id
//                       ? "bg-blue-500 text-white p-3 rounded-lg self-end"
//                       : "text-gray-600"
//                   }
//                 >
//                   <p>{msg.content}</p>
//                   <span className="text-xs text-gray-200">
//                     {new Date(msg.timestamp).toLocaleTimeString()}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Message Input */}
//             <div className="flex items-center mt-4">
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <button
//                 className="ml-2 bg-blue-500 text-white p-2 rounded-full"
//                 onClick={handleSendMessage} // Handle sending the message
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         ) : (
//           <p className="text-center text-gray-500">Please select a user to start chatting.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatApp;

import { useChatStore } from "../../public/store/useChatStore";

import ChatContainer from "../../../components/ChatContainer";
import MessagingSideBar from "../../../components/messagingSideBar";
import NoChatSelected from "../../../components/NoChatSelected";
import SideBar from "../../../components/SideBar";
const HomePage = () => {
  const { selectedUser } = useChatStore();
  //  const { logout, authUser } = useAuthStore();

  return (
    <div className=" bg-base-200">
      <div className="flex   ">
        <SideBar />

        <div className="bg-base-100 rounded-lg shadow-cl w-full  h-[calc(120vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <MessagingSideBar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}

            {/* {authUser && (
              <>
                <Link to={"/user/profile-setup"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
