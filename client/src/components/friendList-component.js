import React, { useState, useEffect } from "react";
import axios from "axios";
import authServiceInstance from "../services/auth-service";
import useUserStore from "../stores/userStore";

function FriendListComponent(props) {
  const [friends, setFriends] = useState([]);
  const { currentUser } = useUserStore();

  useEffect(() => {
    async function fetchFriends() {
      try {
        if (currentUser && currentUser.id) {
          const headers = authServiceInstance.authHeader();
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/chat/friends`,
            { headers }
          );
          setFriends(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    }
    fetchFriends();
  }, [currentUser]);

  useEffect(() => {
    // 當好友列表載入後，檢查是否有好友，並預設點選第一個好友
    if (friends.length > 0 && !props.selectedFriendId) {
      const firstFriend = friends[0];
      props.onSelectFriend(
        firstFriend._id,
        firstFriend.name,
        firstFriend.thumbnail
      );
    }
  }, [friends, props]);

  const handleFriendClick = (friendId, friendName, friendAvatarUrl) => {
    if (friendId !== props.selectedFriendId) {
      props.onSelectFriend(friendId, friendName, friendAvatarUrl);
    }
  };

  return (
    <div className="m-2">
      <h3 className="m-2 text-xs sm:text-base">好友列表</h3>
      <ul>
        {friends.map((friend) => (
          <li
            key={friend._id}
            className={`cursor-pointer flex items-center space-x-4 p-2 rounded ${
              friend._id === props.selectedFriendId
                ? "bg-gray-400"
                : " hover:bg-gray-200"
            }`}
            onClick={() =>
              handleFriendClick(friend._id, friend.name, friend.thumbnail)
            }
          >
            <img
              src={friend.thumbnail}
              alt={friend.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="hidden sm:inline">{friend.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendListComponent;
