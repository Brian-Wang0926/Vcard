import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthService from "../services/auth-service";

function HomeComponent({ currentUser, setCurrentUser }) {
  const [searchParams] = useSearchParams();
  const [selectedBoard, setSelectedBoard] = useState(null); // null 表示所有文章
  // const [text, setText] = useState("");
  // const [image, setImage] = useState(null);
  // const [posts, setPosts] = useState([]);
  // const [refreshPosts, setrefreshPosts] = useState(false);
  // const fileInputRef = useRef(null);
  // const textInputRef = useRef(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const image = searchParams.get("image");
    const id = searchParams.get("id");
    // 如果 token 存在，儲存到 localStorage
    if (token) {
      const Obj = { token: token, name, email, image, id };
      localStorage.setItem("user", JSON.stringify(Obj));
      console.log("已將token存進localStorage");
      setCurrentUser(AuthService.getCurrentUser());
    }
  }, [searchParams, setCurrentUser]);

  // const handleText = (e) => {
  //   setText(e.target.value);
  // };

  // const handleImage = (e) => {
  //   setImage(e.target.files[0]);
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch("/api/getAllPosts");
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const data = await response.json();
  //     console.log("前端取得資料", data);
  //     setPosts(data);
  //     setrefreshPosts(false);
  //   };

  //   fetchData();
  // }, [refreshPosts]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append("text", text);
  //   formData.append("image", image);

  //   const response = await fetch("/api/post", {
  //     method: "POST",
  //     body: formData,
  //   });

  //   if (response.ok) {
  //     console.log("ok");
  //     // 提交成功直接執行取得資料
  //     setrefreshPosts(true);
  //     setText("");
  //     setImage(null);
  //     fileInputRef.current.value = "";
  //     textInputRef.current.value = "";
  //   } else {
  //     console.log("not ok");
  //   }
  // };

  return (
    <div className=" bg-blue-900 min-h-screen p-5">
      <div className="flex mx-auto max-w-screen-xl">
        <div className="flex-none w-1/4 mr-5">
          <BoardList setSelectedBoard={setSelectedBoard} />
        </div>
        <div className="flex-grow">
          <ArticleList board={selectedBoard} />
        </div>
      </div>
    </div>
  );
}

function BoardList({ setSelectedBoard }) {
  const boards = ["心情", "閒聊", "八卦"]; // 這裡可以從API或其他地方取得看板列表

  return (
    <div className=" bg-blue-900  rounded-lg p-4 my-2 text-white">
      <h1 className="mb-4">看版列表</h1>
      {boards.map((board) => (
        <div key={board} onClick={() => setSelectedBoard(board)}>
          {board}
        </div>
      ))}
    </div>

    // <div style={{ margin: "100px" }}>
    //   <form onSubmit={handleSubmit}>
    //     <h2>github action6 發表一篇圖文</h2>
    //     <br />
    //     <div className="form-group">
    //       <label>文字內容:</label>
    //       <input
    //         className="form-control"
    //         type="text"
    //         onChange={handleText}
    //         ref={textInputRef}
    //       ></input>
    //     </div>
    //     <br />
    //     <div>
    //       <label>圖片檔案:</label>
    //       <input
    //         className="form-control"
    //         type="file"
    //         onChange={handleImage}
    //         ref={fileInputRef}
    //       ></input>
    //     </div>
    //     <br />
    //     <div className="form-group">
    //       <button className="btn btn-primary btn-block" type="submit">
    //         送出
    //       </button>
    //     </div>
    //   </form>
    //   <hr />
    //   <div>
    //     <h3>所有圖文</h3>
    //     {posts.map((post) => (
    //       <div key={post.id}>
    //         <p>{post.text}</p>
    //         <img
    //           src={post.image_url}
    //           alt="Uploaded content"
    //           style={{ maxHeight: "100px" }}
    //         />
    //         <hr />
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}

function ArticleList({ board }) {
  const articles = ["第一篇文章", "第二篇文章", "第三篇文章"]; // 這裡根據選擇的看板取得文章

  return (
    <div className="bg-white rounded-lg p-4 my-2">
      <h1 className="mb-4">最新文章</h1>
      {articles.map((article) => (
        <div key={article}>{article}</div>
      ))}
    </div>
  );
}

export default HomeComponent;
