import React from "react";

const Button = ({ onClick, isLoading, children, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-2 rounded-lg font-semibold text-white ${
        isLoading
          ? "opacity-50 cursor-not-allowed"
          : "bg-[#6484bf] hover:bg-[#4167af]"
      } ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Processing..." : children}
    </button>
  );
};

export default Button;
