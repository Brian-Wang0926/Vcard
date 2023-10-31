import React from "react";

const LoginComponent = () => {
  return (
    <div className="flex justify-center">
      <a
        className="bg-black text-white py-1 px-2 flex items-center justify-center rounded-lg w-1/3 mt-10"
        href={`${process.env.REACT_APP_API_URL_AUTH}/google`}
      >
        <img
          src="https://img.icons8.com/color/16/000000/google-logo.png"
          className="mr-2"
          alt="Google logo"
        />
        Login with google
      </a>
    </div>
  );
};

export default LoginComponent;
