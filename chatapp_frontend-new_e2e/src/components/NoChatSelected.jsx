const NoChatSelected = () => {
  return (
    <div className="w-full h-screen flex flex-1 flex-col items-center justify-center p-6 md:p-16 bg-gray-50">
      <div className="max-w-md text-center space-y-6">
        <div className="flex flex-col justify-center items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-blue-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome to ChatOrbit!
          </h2>
        </div>
        <p className="text-sm md:text-base text-gray-600">
          Select a conversation from the sidebar to start connecting with
          others.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
