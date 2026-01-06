import React from "react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center overflow-hidden relative">
      {/* Background Animation Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[300px] h-[300px] top-[10%] left-[20%] rounded-full bg-gradient-radial animate-float" />
        <div className="absolute w-[200px] h-[200px] top-[60%] right-[15%] rounded-full bg-gradient-radial animate-float-delayed-1" />
        <div className="absolute w-[400px] h-[400px] bottom-[10%] left-[50%] rounded-full bg-gradient-radial animate-float-delayed-2" />
      </div>

      {/* Main Content */}
      <div className="text-center z-10 max-w-2xl px-5 py-10">
        <h1 className="text-[120px] md:text-[160px] font-black leading-none mb-5 bg-gradient-to-r from-[#f95300] to-[#ff8c00] bg-clip-text text-transparent animate-glow">
          404
        </h1>

        {/* Loader */}
        <div className="w-[100px] md:w-[150px] h-[100px] md:h-[150px] mx-auto my-8 relative preserve-3d perspective-500">
          {[0, 1, 2, 3, 4].map((index: number) => (
            <div
              key={index}
              className="absolute animate-strim"
              style={{
                inset: `${index * 10}px`,
                boxShadow: "inset 0 0 60px #f95300",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                background: "rgba(249, 83, 0, 0.1)",
                animationDelay: `${index * -0.1}s`,
              }}
            />
          ))}
        </div>

        <h2 className="text-3xl md:text-[42px] font-bold text-white mb-5">
          Page Not Found
        </h2>

        <p className="text-base md:text-lg text-[#b0b0b0] mb-10 leading-relaxed">
          Oops! The page you're looking for seems to have wandered off into the digital void.
        </p>

        <div className="flex gap-5 justify-center flex-wrap">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-3.5 font-semibold rounded-lg bg-gradient-to-r from-[#f95300] to-[#ff8c00] text-white shadow-[0_4px_15px_rgba(249,83,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(249,83,0,0.5)]"
          >
            Go Home
          </button>

          <button
            onClick={() => window.history.back()}
            className="px-8 py-3.5 font-semibold rounded-lg border-2 border-[#f95300] text-[#f95300] transition-all duration-300 hover:bg-[rgba(249,83,0,0.1)] hover:-translate-y-0.5"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Styles */}
      <style>
        {`
          @keyframes float {
            0%,100% { transform: translateY(0) translateX(0) scale(1); }
            33% { transform: translateY(-50px) translateX(30px) scale(1.1); }
            66% { transform: translateY(30px) translateX(-30px) scale(0.9); }
          }

          @keyframes glow {
            0%,100% { filter: drop-shadow(0 0 20px rgba(249,83,0,0.4)); }
            50% { filter: drop-shadow(0 0 40px rgba(249,83,0,0.8)); }
          }

          @keyframes strim {
            0%,100% { transform: translateZ(-50px) rotate(0deg); }
            50% { transform: translateZ(50px) rotate(90deg); }
          }

          .animate-float { animation: float 20s infinite ease-in-out; }
          .animate-float-delayed-1 { animation: float 20s infinite ease-in-out 3s; }
          .animate-float-delayed-2 { animation: float 20s infinite ease-in-out 6s; }
          .animate-glow { animation: glow 2s ease-in-out infinite; }
          .animate-strim { animation: strim 3s infinite ease-in-out both; }
          .preserve-3d { transform-style: preserve-3d; }
          .perspective-500 { transform: perspective(500px) rotateX(60deg); }
          .bg-gradient-radial {
            background: radial-gradient(circle, rgba(249,83,0,0.1), transparent);
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;
