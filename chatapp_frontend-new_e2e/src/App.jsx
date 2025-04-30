import { Loader } from "lucide-react";
import { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "sonner";

import { useAuthStore } from "../src/core/public/store/useAuthStore.js";
import Features from "./components/features.jsx";
import UserChat from "./core/private/chat/form";
import GroupChat from "./core/private/groupChat.jsx";
import Settings from "./core/private/settings.jsx";
import ForgotPassword from "./core/public/forgot-password.jsx";
import Home from "./core/public/home";
import LoginCustomer from "./core/public/login-user.jsx";
import OtpVerification from "./core/public/otp-verification";
import Register from "./core/public/register";
import LoginCustomerCode from "./core/public/signin-code";
import { useThemeStore } from "./core/public/store/useThemeStore.js";
import UserProfileSetup from "./core/public/user-profile-setup/form";

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Toaster richColors position="top-center" expand={true} />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/features" element={<Features />} />
          <Route
            path="/register"
            element={!authUser ? <Register /> : <Navigate to="/chat" />}
          />
          <Route
            path="/login-user"
            element={!authUser ? <LoginCustomer /> : <Navigate to="/chat" />}
          />
          <Route
            path="/chat"
            element={authUser ? <UserChat /> : <Navigate to="/login-user" />}
          />
          <Route
            path="/login-user-code"
            element={
              !authUser ? (
                <LoginCustomerCode />
              ) : (
                <Navigate to="/otp-verification" />
              )
            }
          />
          <Route
            path="/otp-verification"
            element={!authUser ? <OtpVerification /> : <Navigate to="/chat" />}
          />
          <Route
            path="/user/profile-setup"
            element={
              authUser ? <UserProfileSetup /> : <Navigate to="/login-user" />
            }
          />
          <Route
            path="/settings"
            element={authUser ? <Settings /> : <Navigate to="/login-user" />}
          />
          <Route
            path="/group/chat"
            element={authUser ? <GroupChat /> : <Navigate to="/login-user" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

