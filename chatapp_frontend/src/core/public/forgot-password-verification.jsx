import React, { useEffect, useState } from "react";

const ForgotPasswordVerification = () => {
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      setResendEnabled(true);
    } else {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    console.log("OTP Submitted:", enteredOtp);
    // Handle OTP verification logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-open-sans ">
      <div
        className="p-8 rounded-xl shadow-lg w-full max-w-md"
        style={{ backgroundColor: "rgba(18, 58, 102, 0.4)" }}
      >
        <h1 className="text-xl font-medium text-center text-black mb-1">
          Enter the Provided OTP
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Timer and Resend button */}
          <div className="mb-4 flex items-center justify-center space-x-2">
            <div className="text-gray-500 text-sm">
              <span>0:{timer}</span>
            </div>
            {resendEnabled ? (
              <button
                type="button"
                className="text-gray-700 text-sm hover:underline"
              >
                Resend Code
              </button>
            ) : (
              <span className="text-gray-500 text-sm ">Resend Code</span>
            )}
          </div>

          {/* OTP input fields */}
          <div className="mb-4 flex space-x-2 items-center justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#80CBB2]"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-[#2f55ec] py-2 rounded-lg text-white font-semibold hover:bg-[#5f7ed3] "
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordVerification;
