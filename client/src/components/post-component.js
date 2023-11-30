import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "react-markdown-editor-lite/lib/index.css";
import axios from "axios";
import authServiceInstance from "../services/auth-service";
import useUserStore from "../stores/userStore";

const PostComponent = ({ boards }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [content, setContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const location = useLocation();
  const { state } = location;
  const articleToEdit = state?.article;
  const { currentUser } = useUserStore();

  const mdParser = new MarkdownIt({
    breaks: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          const highlighted = hljs.highlight(str, {
            language: lang,
            ignoreIllegals: true,
          });
          return (
            '<pre class="hljs"><code>' + highlighted.value + "</code></pre>"
          );
        } catch (__) {}
      }
      return (
        '<pre class="hljs"><code>' +
        mdParser.utils.escapeHtml(str) +
        "</code></pre>"
      );
    },
  });

  useEffect(() => {
    if (articleToEdit) {
      console.log("編輯～", articleToEdit);
      // Populate form fields with the article data
      setTitle(articleToEdit.title);
      setContent(articleToEdit.content);
      setSelectedBoard(articleToEdit.board._id); // Make sure that board is an object with _id or just an ID
    } else {
      const storedTitle = localStorage.getItem("articleTitle");
      const storedContent = localStorage.getItem("content");
      const storedBoard = localStorage.getItem("selectedBoard");

      if (storedTitle) setTitle(storedTitle);
      if (storedContent) setContent(storedContent);
      if (storedBoard) setSelectedBoard(storedBoard);
    }
  }, [articleToEdit]);

  useEffect(() => {
    localStorage.setItem("articleTitle", title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem("selectedBoard", selectedBoard);
  }, [selectedBoard]);

  const handleEditorChange = ({ html, text }) => {
    setContent(text);
    localStorage.setItem("content", text);
  };

  // 上傳到編輯區
  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const blobUrl = URL.createObjectURL(file);
      console.log("Uploading file:", file); // 打印文件对象
      setUploadedImages((prevUploadedImages) => [
        ...prevUploadedImages,
        { blobUrl, file },
      ]);
      resolve(blobUrl); // 解析 Promise 与 blob URL
    });
  };

  // 送出提交
  const uploadImageToS3 = async (file) => {
    try {
      console.log("前端上傳到s3", file);
      console.log("Uploading to S3, file type:", file.type, "size:", file.size);
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL
        }/api/article/get-presigned-url?fileName=${encodeURIComponent(
          file.name
        )}&fileType=${file.type}`
      );

      if (!response.ok) {
        throw new Error("Unable to get presigned URL");
      }

      const { url: presignedUrl } = await response.json();
      console.log("预签名 URL", presignedUrl);

      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // 构造并返回 CloudFront URL
      const cloudFrontUrl = `${process.env.REACT_APP_CLOUDFRONT_URL}/${file.name}`;
      console.log("CloudFront URL", cloudFrontUrl);
      return cloudFrontUrl;
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      return "";
    }
  };

  // 提交文章
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("請填寫文章標題");
      return;
    }

    let updatedContent = content;

    console.log("前端", uploadedImages);
    // 用于存储需要上传到 S3 的图片
    const imagesToUpload = uploadedImages.filter((image) =>
      image.blobUrl.startsWith("blob:")
    );
    console.log("前端", imagesToUpload);

    for (const image of imagesToUpload) {
      console.log("前端image", image);
      if (image.file) {
        const s3Url = await uploadImageToS3(image.file); // 上传图片并返回 S3 URL
        console.log("前端s3Url", s3Url);
        updatedContent = updatedContent.replace(image.blobUrl, s3Url);
      } else {
        console.error("File object is missing");
        return;
      }
    }

    const articleData = {
      title,
      board: selectedBoard,
      content: updatedContent,
      author: currentUser?.id,
    };

    console.log("Article Data: ", articleData);
    // 发送 POST 请求到后端
    try {
      let response;

      if (articleToEdit) {
        console.log("修改文章", articleToEdit);
        response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/article/${articleToEdit._id}`,
          articleData,
          { headers: authServiceInstance.authHeader() }
        );
      } else {
        response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/article`,
          articleData,
          { headers: authServiceInstance.authHeader() }
        );
      }
      console.log("後端回傳", response);

      ["articleTitle", "content", "selectedBoard"].forEach((key) =>
        localStorage.removeItem(key)
      );
      navigate("/");
    } catch (error) {
      console.error("文章保存錯誤:", error);
    }
  };

  return (
    <div className="prose post-editor-component max-w-screen-xl mx-auto mt-4 pt-14">
      <div className="flex items-center mb-4">
        <div className="whitespace-nowrap px-2" style={{ width: "auto" }}>
          標題：
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="請輸入文章標題"
          className="flex-grow p-2 border border-gray-300 rounded mr-2"
          style={{ height: "40px" }}
        />
        <select
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-2"
          style={{ flexBasis: "15%", height: "40px" }}
        >
          <option value="">選擇一個看板</option>
          {boards.map((board) => (
            <option key={board._id} value={board._id}>
              {board.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          disabled={!selectedBoard}
          className={` bg-blue-500 text-white py-2 px-4 rounded-lg ${
            !selectedBoard ? "opacity-50" : ""
          }`}
          style={{ flexBasis: "5%", height: "40px" }}
        >
          Submit
        </button>
      </div>

      <MdEditor
        value={content}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        onImageUpload={handleImageUpload}
        className="h-[40rem] overflow-y-auto"
      />
    </div>
  );
};

export default PostComponent;
