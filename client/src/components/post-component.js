import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "react-markdown-editor-lite/lib/index.css";

const PostComponent = ({ boards, currentUser }) => {
  const navigate = useNavigate();
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
  const [content, setContent] = useState(
    localStorage.getItem("content") || "# Title (請修改為您的標題)"
  );
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");

  useEffect(() => {
    const contentFromStorage = localStorage.getItem("content");
    if (contentFromStorage) {
      setContent(contentFromStorage);
    }
  }, []);

  const handleEditorChange = ({ html, text }) => {
    if (content === "# Title (請修改為您的標題)") {
      setContent("");
    } else {
      setContent(text);
      localStorage.setItem("content", text);
    }
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
        `/api/article/get-presigned-url?fileName=${encodeURIComponent(
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

    // 验证第一行是否为标题
    const lines = content.split("\n");
    if (!lines[0].startsWith("# ")) {
      alert('文章的第一行必須是標题（以 " # 加空格 "開頭）');
      return;
    }

    // 提取标题（假设第一行是标题）
    const title = lines[0].substring(2).trim();

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
      }
    }

    const articleData = {
      board: selectedBoard,
      content: updatedContent,
      title: title,
      author: currentUser.id,
    };

    console.log("Article Data: ", articleData);
    // 发送 POST 请求到后端
    try {
      const response = await fetch("/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        throw new Error("文章上传失败");
      }

      const data = await response.json();
      console.log("文章保存成功:", data);
      setContent("");
      localStorage.removeItem("content");
      navigate("/");
    } catch (error) {
      console.error("文章保存错误:", error);
    }
  };

  return (
    <div className="prose post-editor-component max-w-screen-xl mx-auto mt-4 pt-14">
      <MdEditor
        value={content}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        onImageUpload={handleImageUpload}
        // config={{
        //   view: {
        //     menu: true,
        //     md: true,
        //     html: true,
        //     fullScreen: false,
        //     hideMenu: true,
        //   },
        // }}
        className="h-[40rem] overflow-y-auto"
      />
      <select
        value={selectedBoard}
        onChange={(e) => setSelectedBoard(e.target.value)}
        className="m-2 border-spacing-0"
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
        className={`submit-button bg-blue-500 text-white py-1 px-2 mt-5 rounded-lg ${
          !selectedBoard ? "opacity-50" : ""
        }`}
      >
        Submit
      </button>
    </div>
  );
};

export default PostComponent;
