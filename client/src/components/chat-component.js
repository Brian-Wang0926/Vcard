import React, { useState } from "react";
import ChatRoomComponent from "./chatRoom-component";
import FriendListComponent from "./friendList-component";

function ChatComponent(props) {
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [selectedFriendName, setSelectedFriendName] = useState(null);
  const [selectedFriendAvatarUrl, setSelectedFriendAvatarUrl] = useState(null);

  const handleSelectFriend = (friendId, friendName, friendAvatarUrl) => {
    setSelectedFriendId(friendId);
    setSelectedFriendName(friendName);
    setSelectedFriendAvatarUrl(friendAvatarUrl);
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-4 pt-14">
      <div className="flex">
        {/* 好友列表 */}
        <div className="w-1/4 border border-gray-300">
          <FriendListComponent
            currentUser={props.currentUser}
            onSelectFriend={handleSelectFriend}
            selectedFriendId={selectedFriendId}
          />
        </div>
        {/* 聊天室 */}
        <div className="w-3/4 border border-gray-300">
          <ChatRoomComponent
            currentUser={props.currentUser}
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
