import React, { useState, useEffect } from "react";
import axios from "axios";
import authServiceInstance from "../services/auth-service";
import useUserStore from "../stores/userStore";

const CardComponent = (props) => {
  const { currentUser } = useUserStore();
  const userId = currentUser && currentUser.id;
  const [pairedUser, setPairedUser] = useState(null);
  const [cardId, setCardId] = useState(null);
  const [inviteStatus, setInviteStatus] = useState("未發送");

  const handleSendInvite = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/card/accept`,
        { cardId, userId },
        { headers: authServiceInstance.authHeader() }
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
      setPairedUser(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/card/getPairs`,
          { headers: authServiceInstance.authHeader() }
        );
        const cards = response.data;
        const currentDate = new Date();
        const validCard = cards.find((card) => {
          const isUserInvolved =
            card.userID1._id === userId || card.userID2._id === userId;
          const isCardActive =
            new Date(card.expiryDate) > currentDate && card.status;
          return isUserInvolved && isCardActive;
        });

        if (validCard) {
          const pairedUserData =
            validCard.userID1._id === userId
              ? validCard.userID2
              : validCard.userID1;
          setPairedUser(pairedUserData);
          setCardId(validCard._id);
          if (validCard.acceptedBy.includes(userId)) {
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
    <div className="max-w-screen-xl mx-auto mt-14 pt-14">
      {pairedUser ? (
        <div className="flex flex-col items-center bg-gray-100 border border-gray-200 p-12 rounded-lg shadow-md w-96 mx-auto">
          <h1 className="text-center my-2 text-2xl">{pairedUser.name}</h1>
          {/* <h3 className="text-center my-2">{pairedUser.email}</h3> */}
          <img
            src={pairedUser.thumbnail}
            alt="{pairedUser.name}"
            className=" my-4 w-52 h-52 rounded-full object-cover"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded disabled:opacity-50"
            onClick={handleSendInvite}
            disabled={inviteStatus === "已發送"}
          >
            {inviteStatus === "未發送" ? "送出邀請" : "已發送邀請"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center bg-gray-600 text-white border border-gray-200 p-12 rounded-lg shadow-md w-96 mx-auto">
          <p>no paired user found...</p>
        </div>
      )}
    </div>
  );
};

export default CardComponent;
