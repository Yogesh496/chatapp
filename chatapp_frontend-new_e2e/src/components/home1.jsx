import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import icon1 from "../assets/images/image1.png";
import icon7 from "../assets/images/image7.png";
import icon8 from "../assets/images/image8.png";
import iconLock from "../assets/images/lock-icon.png";

function MainHome() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({
    features: false,
    security: false,
    testimonials: false,
  });

  // Animation trigger on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = {
        features: document.getElementById("features-section"),
        security: document.getElementById("security-section"),
        testimonials: document.getElementById("testimonials-section"),
      };

      Object.entries(sections).forEach(([key, section]) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.75) {
            setIsVisible((prev) => ({ ...prev, [key]: true }));
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#60a5fa] text-white py-24 overflow-hidden">
        {/* Animated geometric pattern background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute w-full h-full animate-pulse">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="smallGrid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
                <pattern
                  id="grid"
                  width="80"
                  height="80"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="80" height="80" fill="url(#smallGrid)" />
                  <path
                    d="M 80 0 L 0 0 0 80"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className="absolute rounded-full bg-white/30 animate-float"
              style={{
                width: `${Math.random() * 12 + 4}px`,
                height: `${Math.random() * 12 + 4}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0 animate-fadeIn">
              <div className="flex items-center mb-4">
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full inline-flex items-center shadow-lg">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  End-to-End Encrypted
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                <span className="block">Secure Messaging</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                  for Everyone
                </span>
              </h1>
              <p className="text-xl mb-8 text-white/90 max-w-lg leading-relaxed">
                ChatOrbit offers truly private communication with military-grade
                end-to-end encryption. Your messages belong only to you and your
                recipients.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="group bg-white text-[#2563eb] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-white to-blue-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </button>
                <button
                  onClick={() => navigate("/features")}
                  className="group border-2 border-white text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden"
                >
                  <span className="relative z-10">Learn More</span>
                  <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </button>
              </div>
            </div>
            <div className="md:w-1/2 animate-floatSlow">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-full blur-3xl transform -translate-x-4 translate-y-4"></div>
                <img
                  src={icon1}
                  alt="Secure Chat Illustration"
                  className="w-full max-w-lg mx-auto relative z-10 transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Animated wave divider */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            fill="white"
          >
            <path d="M0,64L80,64C160,64,320,64,480,69.3C640,75,800,85,960,80C1120,75,1280,53,1360,42.7L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Enhanced Security Badge Section */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-center">
            <div className="p-4 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                100%
              </div>
              <p className="text-gray-600">End-to-End Encrypted</p>
            </div>
            <div className="p-4 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                FREE
              </div>
              <p className="text-gray-600">No cost to use our app</p>
            </div>
            <div className="p-4 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                No
              </div>
              <p className="text-gray-600">Metadata Collection</p>
            </div>
            <div className="p-4 transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                Open
              </div>
              <p className="text-gray-600">Source Protocol</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section
        id="features-section"
        className="py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800 relative inline-block">
              Why Choose ChatOrbit?
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-50 rounded"></span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
              Experience the next generation of secure communication with our
              powerful features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`bg-white p-8 rounded-xl shadow-lg transition-all duration-700 transform ${
                isVisible.features
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <img
                  src={iconLock}
                  alt="Encryption"
                  className="w-8 h-8 text-white"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                End-to-End Encryption
              </h3>
              <p className="text-gray-600">
                Encryption ensures your messages can only be read by you and
                your intended recipients. Not even we can access your
                conversations.
              </p>
            </div>
            <div
              className={`bg-white p-8 rounded-xl shadow-lg transition-all duration-700 transform ${
                isVisible.features
                  ? "translate-y-0 opacity-100 delay-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <img
                  src={icon7}
                  alt="Private Messaging"
                  className="w-8 h-8 text-white"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Voice Messages
              </h3>
              <p className="text-gray-600">
                Voice is often more effective to express your feelings. Send and
                receive voice messages with ease.
              </p>
            </div>
            <div
              className={`bg-white p-8 rounded-xl shadow-lg transition-all duration-700 transform ${
                isVisible.features
                  ? "translate-y-0 opacity-100 delay-200"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <img
                  src={icon8}
                  alt="Group Chat"
                  className="w-8 h-8 text-white"
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Secure Group Conversations
              </h3>
              <p className="text-gray-600">
                Create fully encrypted group chats with perfect forward secrecy.
                Share confidential information with teams, family, or friends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Security Explanation Section */}
      <section
        id="security-section"
        className="py-20 bg-white relative overflow-hidden"
      >
        {/* Background gradient blob */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-50"></div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div
              className={`md:w-1/2 transition-all duration-1000 transform ${
                isVisible.security
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg transform rotate-3"></div>
                <svg
                  className="w-full max-w-md mx-auto relative z-10 transform -rotate-3"
                  viewBox="0 0 600 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="50"
                    y="150"
                    width="500"
                    height="100"
                    rx="20"
                    fill="#EBF5FF"
                    className="shadow-md"
                  />
                  <rect
                    x="100"
                    y="175"
                    width="80"
                    height="50"
                    rx="8"
                    fill="#3B82F6"
                    className="animate-pulse"
                  />
                  <rect
                    x="420"
                    y="175"
                    width="80"
                    height="50"
                    rx="8"
                    fill="#3B82F6"
                    className="animate-pulse"
                  />
                  <path
                    d="M200 200 L400 200"
                    stroke="#3B82F6"
                    strokeWidth="4"
                    strokeDasharray="8 8"
                    className="animate-dash"
                  />
                  <circle cx="140" cy="200" r="15" fill="#2563EB" />
                  <circle cx="460" cy="200" r="15" fill="#2563EB" />
                  <path
                    d="M185 175 L240 175"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  <path
                    d="M360 175 L415 175"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  <path
                    d="M185 225 L240 225"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  <path
                    d="M360 225 L415 225"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  <circle
                    cx="260"
                    cy="200"
                    r="10"
                    fill="#60A5FA"
                    className="animate-pulse"
                  />
                  <circle
                    cx="300"
                    cy="200"
                    r="10"
                    fill="#60A5FA"
                    className="animate-pulse"
                  />
                  <circle
                    cx="340"
                    cy="200"
                    r="10"
                    fill="#60A5FA"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>
            <div
              className={`md:w-1/2 transition-all duration-1000 transform ${
                isVisible.security
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-800 relative inline-block">
                How Our Encryption Works
                <span className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform rounded"></span>
              </h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    End-to-End Encryption
                  </h3>
                  <p className="text-gray-600">
                    Messages are encrypted on your device and can only be
                    decrypted by the intended recipient. Not even ChatOrbit can
                    read your conversations.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Perfect Forward Secrecy
                  </h3>
                  <p className="text-gray-600">
                    New encryption keys are generated for every message,
                    ensuring that if one key is compromised, past conversations
                    remain secure.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Block Unwanted People
                  </h3>
                  <p className="text-gray-600">
                    You can block unwanted people from sending you messages.
                    This will help keep the creeps away. You can also report
                    them to the ChatOrbit team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section
        id="testimonials-section"
        className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            fill="white"
          >
            <path d="M0,64L80,53.3C160,43,320,21,480,21.3C640,21,800,43,960,48C1120,53,1280,43,1360,37.3L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800 relative inline-block">
              What Our Users Say
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-50 rounded"></span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
              Join thousands of privacy-conscious users who trust ChatOrbit for
              their secure communication needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className={`bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-700 transform ${
                isVisible.testimonials
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Alex Johnson</h4>
                  <p className="text-gray-600">Software Engineer</p>
                </div>
              </div>
              <div className="relative">
                <svg
                  className="absolute top-0 left-0 w-8 h-8 text-blue-100 transform -translate-x-4 -translate-y-4"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10,8L4,16l6,8V8z M26,8l-6,8l6,8V8z" />
                </svg>
                <p className="text-gray-600 relative">
                  "As a developer, I understand how important strong encryption
                  is. ChatOrbit's implementation is top-notch, and I trust it
                  for both personal and work conversations."
                </p>
              </div>
            </div>
            <div
              className={`bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-700 transform ${
                isVisible.testimonials
                  ? "translate-y-0 opacity-100 delay-100"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Sarah Chen</h4>
                  <p className="text-gray-600">Healthcare Professional</p>
                </div>
              </div>
              <div className="relative">
                <svg
                  className="absolute top-0 left-0 w-8 h-8 text-blue-100 transform -translate-x-4 -translate-y-4"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10,8L4,16l6,8V8z M26,8l-6,8l6,8V8z" />
                </svg>
                <p className="text-gray-600 relative">
                  "Working with sensitive patient information means security is
                  non-negotiable. ChatOrbit gives me peace of mind when
                  communicating with colleagues."
                </p>
              </div>
            </div>
            <div
              className={`bg-white p-8 rounded-xl shadow-lg border border-gray-100 transition-all duration-700 transform ${
                isVisible.testimonials
                  ? "translate-y-0 opacity-100 delay-200"
                  : "translate-y-20 opacity-0"
              }`}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">
                    Michael Torres
                  </h4>
                  <p className="text-gray-600">Privacy Advocate</p>
                </div>
              </div>
              <div className="relative">
                <svg
                  className="absolute top-0 left-0 w-8 h-8 text-blue-100 transform -translate-x-4 -translate-y-4"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10,8L4,16l6,8V8z M26,8l-6,8l6,8V8z" />
                </svg>
                <p className="text-gray-600 relative">
                  "I've tried many secure messaging apps, and ChatOrbit stands
                  out with its commitment to privacy. The self-destructing
                  messages and zero metadata storage are game-changers."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 relative">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e40af] via-[#2563eb] to-[#3b82f6] overflow-hidden">
          {/* Animated shapes */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="absolute bg-white/10 rounded-full animate-floatSlow"
                style={{
                  width: `${Math.random() * 300 + 100}px`,
                  height: `${Math.random() * 300 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 20 + 15}s`,
                  animationDelay: `${Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">
            Take Control of Your Privacy Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are protecting their conversations with
            ChatOrbit's end-to-end encryption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="group bg-white text-[#2563eb] px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              <span className="relative z-10">Create Secure Account</span>
              <span className="absolute inset-0 bg-gradient-to-r from-white to-blue-100 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </button>
            <button
              onClick={() => navigate("/security")}
              className="group border-2 border-white text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative z-10">Learn About Our Security</span>
              <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </button>
          </div>

          {/* Animated Security Pulse Indicator */}
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-75"></div>
            </div>
            <p className="ml-3 text-white/90">Secure connection active</p>
          </div>
        </div>
      </section>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dash {
          to {
            stroke-dashoffset: 24;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-floatSlow {
          animation: floatSlow 6s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-dash {
          animation: dash 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default MainHome;
