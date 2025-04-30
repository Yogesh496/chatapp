// import React, { useEffect } from 'react';
// import { useChatStore } from "../../src/core/public/store/useChatStore";

// const UserListComponent = ({ onUserClick }) => {
//   const { getUsers, users, isUsersLoading } = useChatStore();

//   useEffect(() => {
//     getUsers(); // Fetch users initially
//   }, [getUsers]);

//   if (isUsersLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex-1 overflow-y-auto p-2 bg-base-100">
//       {users.length > 0 ? (
//         users.map((user) => (
//           <button
//             key={user._id}
//             onClick={() => onUserClick(user)}
//             className="flex items-center gap-3 w-full p-3  rounded-lg transition-all duration-200 hover:bg-blue-100 hover:text-black"
//           >
//             <div className="relative">
//               <img
//                 src={user.profilePic || "/avatar.png"}
//                 alt={user.name}
//                 className="w-12 h-12 object-cover rounded-full"
//               />
//             </div>
//             <div className="hidden lg:block min-w-0">
//               <div className="font-medium truncate text-gray-800">{user.fullName}</div>
//               <div className="text-sm text-gray-500">Offline</div>
//             </div>
//           </button>
//         ))
//       ) : (
//         <div className="text-center text-gray-500 py-4">No users found</div>
//       )}
//     </div>
//   );
// };

// export default UserListComponent;
