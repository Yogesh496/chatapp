import React from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";
import MainHome from "../../components/home1";

function App() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto mt-10">
        <MainHome />
      </div>
      <Footer />
    </div>
  );
}

export default App;
