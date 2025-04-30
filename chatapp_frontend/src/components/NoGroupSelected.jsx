import { FiUsers } from "react-icons/fi";

const NoGroupSelected = () => {
  return (
    <div className="w-full h-screen flex flex-1 flex-col items-center justify-center p-6 md:p-16 bg-gray-50">
      <div className="max-w-md text-center space-y-6">
        <div className="flex flex-col justify-center items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUsers className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Group Messaging
          </h2>
        </div>
        <p className="text-sm md:text-base text-gray-600">
          Select a group from the sidebar or create a new group to start chatting with multiple people at once.
        </p>
      </div>
    </div>
  );
};

export default NoGroupSelected;