import React, { useState } from "react";
import ChatRoomComponent from "./chatRoom-component";
import FriendListComponent from "./friendList-component";

function ChatComponent() {
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [selectedFriendName, setSelectedFriendName] = useState(null);
  const [selectedFriendAvatarUrl, setSelectedFriendAvatarUrl] = useState(null);

  const handleSelectFriend = (friendId, friendName, friendAvatarUrl) => {
    setSelectedFriendId(friendId);
    setSelectedFriendName(friendName);
    setSelectedFriendAvatarUrl(friendAvatarUrl);
  };

  return (
    <div className="max-w-screen-xl mx-auto pt-20 pb-14 h-screen overflow-hidden">
      <div className="flex h-full">
        {/* 好友列表 */}
        <div className="w-1/4 border border-gray-300 h-full overflow-y-auto">
          <FriendListComponent
            onSelectFriend={handleSelectFriend}
            selectedFriendId={selectedFriendId}
          />
        </div>
        {/* 聊天室 */}
        <div className="w-3/4 border border-gray-300 h-full">
          <ChatRoomComponent
            otherUserId={selectedFriendId}
            otherUserName={selectedFriendName}
            otherUserAvatarUrl={selectedFriendAvatarUrl}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatComponent;
