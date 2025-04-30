import NoChatSelected from "../../components/NoChatSelected";
import SideBar from "../../components/SideBar";
import GroupChatContainer from "../../components/groupChatContainer";
import GroupMessagingSideBar from "../../components/groupMessagingSideBar";
import { useChatStore } from "../public/store/useChatStore";

const GroupChat = () => {
  const { selectedGroup } = useChatStore();

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="flex h-screen">
        <SideBar />
        <div className="bg-base-100 rounded-lg shadow-cl w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-2rem)] my-1">
          <div className="flex h-full rounded-lg overflow-hidden">
            <GroupMessagingSideBar />

            {!selectedGroup ? <NoChatSelected /> : <GroupChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
