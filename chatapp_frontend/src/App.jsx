// import { lazy, Suspense } from "react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { InfoProvider } from "./context/InfoContext.jsx";
// import { AuthProvider, useAuth } from "./context/authContext.jsx";

// // Lazy load components
// const CustomerForm = lazy(() => import("./core/private/customer/form"));
// const CustomerIndex = lazy(() => import("./core/private/customer"));
// const UserProfileSetup = lazy(() => import("./core/public/user-profile-setup/form"));
// const UserChat = lazy(() => import("./core/private/chat/form"));
// const Home = lazy(() => import("./core/public/home"));

// const LoginCustomer = lazy(() => import("./core/public/login-user.jsx"));
// const LoginCustomerCode = lazy(() => import("./core/public/signin-code"));
// const OtpVerification = lazy(() => import("./core/public/otp-verification"));
// const ForgotPassword = lazy(() => import("./core/public/forgot-password"));
// const ForgotPasswordVerification = lazy(() => import("./core/public/forgot-password-verification"));
// const Register = lazy(() => import("./core/public/register"));
// const Layout = lazy(() => import("./core/private/layout"));

// function App() {
//   return (
//     <AuthProvider>
//       <InfoProvider>
//         <AuthRoutes />
//       </InfoProvider>
//     </AuthProvider>
//   );
// }

// function AuthRoutes() {
//   const { user } = useAuth(); // Now inside AuthProvider
//   const isAdmin = user?.role === 'admin';  // Check if the user is an admin
//   const isLoggedIn = user !== null; // Check if the user is logged in

//   const publicRoutes = [
//     { path: "/", element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense> },
//     { path: "/login", element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense> },
//     { path: "/login-user", element: <Suspense fallback={<div>Loading...</div>}><LoginCustomer /></Suspense> },
//     { path: "/login-user-code", element: <Suspense fallback={<div>Loading...</div>}><LoginCustomerCode /></Suspense> },
//     { path: "/chat", element: <Suspense fallback={<div>Loading...</div>}><UserChat /></Suspense> },
//     { path: "/otp-verification", element: <Suspense fallback={<div>Loading...</div>}><OtpVerification /></Suspense> },
//     { path: "/forgot-password", element: <Suspense fallback={<div>Loading...</div>}><ForgotPassword /></Suspense> },
//     { path: "/forgot-password-verification", element: <Suspense fallback={<div>Loading...</div>}><ForgotPasswordVerification /></Suspense> },
//     { path: "/register", element: <Suspense fallback={<div>Loading...</div>}><Register /></Suspense> },
//     { path: "/user/profile-setup", element: <Suspense fallback={<div>Loading...</div>}><UserProfileSetup /></Suspense> },
//     { path: "*", element: <div>404 - Unauthorized</div> },
//   ];

//   const privateAdminRoutes = [
//     { path: "/admin", element: <Suspense fallback={<div>Loading...</div>}><Layout /></Suspense> },
//     { path: "/admin/customer", element: <Suspense fallback={<div>Loading...</div>}><CustomerIndex /></Suspense> },
//     { path: "/admin/customer/form", element: <Suspense fallback={<div>Loading...</div>}><CustomerForm /></Suspense> },
//     { path: "*", element: <div>404 - Unauthorized</div> },
//   ];

//   const privateUserRoutes = [

//     { path: "/chat", element: <Suspense fallback={<div>Loading...</div>}><UserChat /></Suspense> },
//     { path: "*", element: <div>404 - Unauthorized</div> },
//   ];

//   // Choose the correct set of routes based on the user status
//   const routes = isAdmin ? privateAdminRoutes : isLoggedIn ? privateUserRoutes : publicRoutes;

//   return (
//     <RouterProvider router={createBrowserRouter(routes)} />
//   );
// }

// export default App;

// src/App.js

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

// <AuthProvider>
//   <Router>

//     <Routes>
//       {/* Public Routes */}
//       <Route
//         path="/login-user"
//         element={
//           <PublicRoute>
//             <LoginCustomer />
//           </PublicRoute>
//         }
//       />
//        <Route
//         path="/login-user-code"
//         element={
//           <PublicRoute>
//             <LoginCustomerCode />
//           </PublicRoute>
//         }
//       />
//       <Route
//         path="/otp-verification"
//         element={
//           <PublicRoute>
//             <OtpVerification />
//           </PublicRoute>
//         }
//       />
//        <Route
//         path="/forgot-password"
//         element={
//           <PublicRoute>
//             <ForgotPassword />
//           </PublicRoute>
//         }
//       />
//        <Route
//         path="/forgot-password-verification"
//         element={
//           <PublicRoute>
//             <ForgotPasswordVerification />
//           </PublicRoute>
//         }
//       />
//       <Route
//         path="/register"
//         element={
//           <PublicRoute>
//             <Register />
//           </PublicRoute>
//         }
//       />
//       <Route
//         path="/"
//         element={
//           <PublicRoute>
//             <Home />
//           </PublicRoute>
//         }
//       />

//       {/* Private Routes */}

//       <Route
//         path="/chat"
//         element={
//           <PrivateRoute>
//             <UserChat />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/admin/customer/form"
//         element={
//           <PrivateRoute>
//             <CustomerForm />
//           </PrivateRoute>
//         }
//       />
//       <Route
//         path="/user/profile-setup"
//         element={
//           <PrivateRoute>
//             <UserProfileSetup />
//           </PrivateRoute>
//         }
//       />

//     </Routes>
//   </Router>
// </AuthProvider>
