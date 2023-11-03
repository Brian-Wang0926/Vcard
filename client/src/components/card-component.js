import React, { useState, useEffect } from "react";
import axios from "axios";
import authServiceInstance from "../services/auth-service";

const CardComponent = (props) => {
  const userId = props.currentUser && props.currentUser.id;
  const [pairedUser, setPairedUser] = useState(null);
  const [cardId, setCardId] = useState(null);
  const [inviteStatus, setInviteStatus] = useState("未發送");

  const handleSendInvite = async () => {
    try {
      const headers = authServiceInstance.authHeader();
      const response = await axios.post(
        "/api/card/accept",
        { cardId, userId },
        { headers }
      );

      if (response.status === 200) {
        alert("邀請已發送！");
        setInviteStatus("已發送");
      } else {
        alert("邀請發送失敗！");
      }
    } catch (e) {
      console.error("Error sending invite:", e);
    }
  };

  useEffect(() => {
    async function fetchPair() {
      try {
        const headers = authServiceInstance.authHeader();
        const response = await axios.get(`/api/card/getPairs`, { headers });
        const cards = response.data;
        const card = cards.find(
          (card) => card.userID1._id === userId || card.userID2._id === userId
        );
        if (card) {
          const pairedUserData =
            card.userID1._id === userId ? card.userID2 : card.userID1;
          setPairedUser(pairedUserData);
          setCardId(card._id);

          if (card.acceptedBy.includes(userId)) {
            setInviteStatus("已發送");
          }
        }
      } catch (error) {
        console.error("Error fetching pair:", error);
      }
    }

    fetchPair();
  }, [userId]);

  return (
    <div>
      {pairedUser ? (
        <div>
          <h1>{pairedUser.name}</h1>
          <h3>{pairedUser.email}</h3>
          <img src={pairedUser.thumbnail} alt="{pairedUser.name}" className="w-52 h-52 rounded-full object-cover"/>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            onClick={handleSendInvite}
            disabled={inviteStatus === "已發送"}
          >
            {inviteStatus === "未發送" ? "送出邀請" : "已發送邀請"}
          </button>
        </div>
      ) : (
        <p>Loading or no paired user found...</p>
      )}
    </div>
  );
};

export default CardComponent;
