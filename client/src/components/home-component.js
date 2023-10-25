import React, { useEffect, useState, useRef } from "react";

const HomeComponent = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [refreshPosts, setrefreshPosts] = useState(false);
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);


  const handleText = (e) => {
    setText(e.target.value);
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/getAllPosts");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("前端取得資料", data);
      setPosts(data);
      setrefreshPosts(false);
    };

    fetchData();
  }, [refreshPosts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", text);
    formData.append("image", image);

    const response = await fetch("/api/post", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("ok");
      // 提交成功直接執行取得資料
      setrefreshPosts(true);
      setText("");
      setImage(null);
      fileInputRef.current.value = "";
      textInputRef.current.value = "";
    } else {
      console.log("not ok");
    }
  };

  return (
    <div style={{ margin: "100px" }}>
      <form onSubmit={handleSubmit}>
        <h2>測試github action 發表一篇圖文</h2>
        <br />
        <div className="form-group">
          <label>文字內容:</label>
          <input
            className="form-control"
            type="text"
            onChange={handleText}
            ref={textInputRef}
          ></input>
        </div>
        <br />
        <div>
          <label>圖片檔案:</label>
          <input
            className="form-control"
            type="file"
            onChange={handleImage}
            ref={fileInputRef}
          ></input>
        </div>
        <br />
        <div className="form-group">
          <button className="btn btn-primary btn-block" type="submit">
            送出
          </button>
        </div>
      </form>
      <hr />
      <div>
        <h3>所有圖文</h3>
        {posts.map((post) => (
          <div key={post.id}>
            <p>{post.text}</p>
            <img
              src={post.image_url}
              alt="Uploaded content"
              style={{ maxHeight: "100px" }}
            />
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeComponent;
