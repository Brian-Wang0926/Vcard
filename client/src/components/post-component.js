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
      setUploadedImages((prevUploadedImages) => [
        ...prevUploadedImages,
        { blobUrl, file },
      ]);
      resolve(blobUrl); // 解析 Promise 与 blob URL
    });
  };

  const uploadImageToS3 = async (file) => {
    try {
      const extension = file.name.split(".").pop();

      const randomFileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 15)}.${extension}`;

      // 使用 axios 獲取預簽名 URL
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/article/getPresignedUrl`,
        {
          params: {
            fileName: randomFileName,
            fileType: encodeURIComponent(file.type),
          },
        }
      );
      const presignedUrl = response.data.url;

      // 使用 axios 上傳圖片到 S3
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // 构造并返回 CloudFront URL
      const cloudFrontUrl = `${process.env.REACT_APP_CLOUDFRONT_URL}/${randomFileName}`;
      return cloudFrontUrl;
    } catch (error) {
      console.error("Error uploading image to S3:", error);
      throw new Error("Error uploading image to S3");
    }
  };

  // 提交文章
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("請填寫文章標題");
      return;
    }

    if (!content.trim()) {
      alert("請填寫文章內容");
      return;
    }

    let updatedContent = content;

    // 用于存储需要上传到 S3 的图片
    const imagesToUpload = uploadedImages.filter((image) =>
      image.blobUrl.startsWith("blob:")
    );

    for (const image of imagesToUpload) {
      if (image.file) {
        const s3Url = await uploadImageToS3(image.file); // 上传图片并返回 S3 URL
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
    try {
      let response;

      if (articleToEdit) {
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
      <div className="mb-4">
        <div className="flex flex-col mb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="請輸入文章標題"
            className="p-2 border border-gray-300 rounded w-full"
            style={{ height: "40px" }}
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center">
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2 sm:mb-0 sm:mr-2 w-full"
            style={{ height: "40px" }}
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
            className={`bg-blue-500 text-white py-2 px-4 rounded-lg ${
              !selectedBoard ? "opacity-50" : ""
            } w-full sm:w-auto`}
            style={{ height: "40px" }}
          >
            Submit
          </button>
        </div>
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
