
import { useChatStore } from "../../public/store/useChatStore";

import ChatContainer from "../../../components/ChatContainer";
import MessagingSideBar from "../../../components/messagingSideBar";
import NoChatSelected from "../../../components/NoChatSelected";
import SideBar from "../../../components/SideBar";
const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className=" bg-base-200">
      <div className="flex   ">
        <SideBar />

        <div className="bg-base-100 rounded-lg shadow-cl w-full  h-[calc(120vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <MessagingSideBar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
