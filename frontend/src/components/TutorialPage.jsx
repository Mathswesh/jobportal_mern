import React from "react";

export default function TutorialPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-black shadow-lg rounded-2xl max-w-5xl w-full p-6">
        <h1 className="text-2xl font-bold text-purple-800 mb-4 text-center">
          Tutorial Video
        </h1>
        {/* Local Stored Video */}
        <video
          controls
          autoPlay
          className="w-full rounded-xl"
          loop
        >
          <source src="src/assets/tutorials for project.mp4" type="video/mp4" />
          {/* Your browser does not support the video tag. */}
        </video>
      </div>
    </div>
  );
}
