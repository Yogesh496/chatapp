import { toast } from 'sonner';
import { io } from "socket.io-client";
import { create } from "zustand";
import { axiosInstance } from "../../../lib/axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  messages: [],  // Store messages
  latestMessage: null, 
  isResettingPassword: false, // Track if the password reset request is in progress
  isPasswordReset: false,     // Track if the password reset was successful
  isCodeVerified: false,      // Track if the reset code has been verified
  errorMessage: "",           // Store any error messages

  // Forgot password - Sends a reset code to the user's email
  forgotPassword: async (email) => {
    set({ isResettingPassword: true });
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Reset Code Sent", {
        description: "Please check your email for the reset code"
      });
    } catch (error) {
      toast.error("Reset Code Failed", {
        description: error.response?.data?.message || "Could not send reset code"
      });
    } finally {
      set({ isResettingPassword: false });
    }
  },

  // Reset password - Verifies the reset code and changes the password
  resetPassword: async (email, password) => {
    set({ isResettingPassword: true });
    try {
      await axiosInstance.post("/auth/reset-password", { email, password });
      toast.success("Password Reset", {
        description: "Your password has been successfully reset"
      });
      set({ isPasswordReset: true }); // Set the flag to true indicating the password reset was successful
    } catch (error) {
      toast.error("Reset Failed", {
        description: error.response?.data?.message || "Could not reset password"
      });
    } finally {
      set({ isResettingPassword: false });
    }
  },

  // Verify reset code - Verify the code entered by the user
  verifyResetCode: async (email, resetCode) => {
    set({ isResettingPassword: true });
    try {
      // Post to the backend API for code verification
      await axiosInstance.post("/auth/verify-reset-code", { email, resetCode });
      toast.success("Code Verified", {
        description: "Reset code verification successful"
      });
      set({ isCodeVerified: true }); // Mark code as verified
    } catch (error) {
      toast.error("Verification Failed", {
        description: error.response?.data?.message || "Invalid reset code"
      });
    } finally {
      set({ isResettingPassword: false });
    }
  },

  // Check authentication status
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    console.log("Request Payload:", data); // Log request payload
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data });
      toast.success("Welcome to ChatOrbit!", {
        description: "Your account has been created successfully"
      });
      get().connectSocket();
    } catch (error) {
      toast.error("Registration Failed", {
        description: error.response?.data?.message || "Could not create account"
      });
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Login function
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Welcome Back!", {
        description: "You've successfully logged in"
      });
      get().connectSocket();
    } catch (error) {
      toast.error("Login Failed", {
        description: error.response?.data?.message || "Invalid credentials"
      });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({
        authUser: null,
        messages: [],  // Clear messages on logout
        onlineUsers: [],  // Clear online users on logout
      });
      toast.success("Logged Out", {
        description: "You've been successfully logged out"
      });
      get().disconnectSocket();
    } catch (error) {
      toast.error("Logout Failed", {
        description: error.response?.data?.message || "Could not log out"
      });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated", {
        description: "Your profile has been successfully updated"
      });
    } catch (error) {
      toast.error("Update Failed", {
        description: error.response?.data?.message || "Could not update profile"
      });
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));