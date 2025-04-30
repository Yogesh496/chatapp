import { useEffect, useState } from "react";
import { useGroupStore } from "../../public/store/useGroupStore";
import GroupChatContainer from "../../../../components/GroupChatContainer";
import GroupMessagingSidebar from "../../../../components/GroupMessagingSidebar";
import NoGroupSelected from "../../../components/NoGroupSelected";
import SideBar from "../../../components/SideBar";

const GroupChatPage = () => {
  const { selectedGroup } = useGroupStore();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row h-screen pt-12 md:pt-0">
        <SideBar />
        
        <div className="flex flex-col md:flex-row flex-1 h-full">
          {(!isMobileView || !selectedGroup) && (
            <div className="md:w-72 w-full">
              <GroupMessagingSidebar />
            </div>
          )}
          
          <div className="flex-1 h-full">
            {!selectedGroup ? (
              <div className="hidden md:block h-full">
                <NoGroupSelected />
              </div>
            ) : (
              <GroupChatContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatPage;