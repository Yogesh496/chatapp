import React from 'react';
import Header from '../components/header';
import Footer from './footer';

function Features() {
  return (
    <>
      <Header/>
      <div className="container mx-auto px-4 py-10 font-open-sans h-screen">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">Our Features</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-[#61b196] ">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Real-Time Chatting</h2>
            <p className="text-gray-600">
            Instant messaging with text, images, and voice messages for seamless communication.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-[#61b196] ">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Group Conversations</h2>
            <p className="text-gray-600">
            Create and manage group chats for team discussions, family, or social gatherings.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-[#61b196] ">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">File Sharing</h2>
            <p className="text-gray-600">
            Share documents, images, audio, and more to make collaboration easier.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white shadow-lg rounded-lg p-6 border border-[#61b196] ">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Profiles</h2>
            <p className="text-gray-600">
            Personalize your profile with pictures.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 border border-[#61b196] ">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose the theme</h2>
            <p className="text-gray-600">
            Light and Dark Theme according to your preference.
            </p>
          </div>

        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Features;
