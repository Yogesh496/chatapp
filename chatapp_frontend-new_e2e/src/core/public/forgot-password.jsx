import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Header from "../../components/header";
import { useAuthStore } from "../public/store/useAuthStore";


const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const { 
    isResettingPassword, 
    isPasswordReset, 
    isCodeVerified, 
    forgotPassword, 
    resetPassword, 
    verifyResetCode 
  } = useAuthStore();

  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    await forgotPassword(email);
    setIsCodeSent(true); 
  };

  
  const handleVerifyCode = async () => {
    if (!resetCode) {
      toast.error("Please enter the reset code.");
      return;
    }
    await verifyResetCode(email, resetCode);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    if (isCodeVerified) {
      await resetPassword(email, newPassword);
    } else {
      toast.error("Please verify the reset code first.");
    }
  };

  return (
    <>
      <Header />
    <div className="h-screen flex items-center justify-center mb-80 font-open-sans">
    <div
      className="p-8 rounded-xl shadow-lg w-full max-w-md mb-36"
      style={{ backgroundColor: "rgba(240, 245, 245)" }}
    >
      <h2 className="text-xl font-semibold text-center mb-4">Password Reset</h2>

      {/* Forgot Password Section */}
      {!isCodeSent ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <h3 className="text-base font-medium text-center ">Enter your email to receive a reset code</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full"
          />
          <button type="submit" disabled={isResettingPassword} className="btn bg-[#5f7ed3] hover:bg-[#385ec8] text-white w-full" >
            {isResettingPassword ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
      ) : (
        
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xs font-medium text-center">Enter the reset code sent to your email and new password</h3>

            {/* Reset Code Verification */}
            <input
              type="text"
              placeholder="Reset Code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
              className="input input-bordered w-full"
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={isResettingPassword || isCodeVerified}
              className="btn bg-[#6c7ebf] hover:bg-[#2f4ad1] w-full"
            >
              {isResettingPassword ? "Verifying..." : "Verify Reset Code"}
            </button>
            {isCodeVerified && <p className="text-[#28457a] text-center text-sm">Reset code verified successfully!</p>}

            {/* New Password Entry */}
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="input input-bordered w-full"
            />
            <button
              type="submit"
              disabled={isResettingPassword || !isCodeVerified}
              className="btn bg-[#6c7ebf] w-full hover:bg-[#24478f]"
            >
              {isResettingPassword ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </>
      )}

      {/* Show success message if password is reset */}
      {isPasswordReset && <p className="text-[#2f4fd1] text-center mt-4 text-sm">Password has been reset successfully!</p>}
      </div>
    </div>
    </>
  );
};

export default PasswordReset;
