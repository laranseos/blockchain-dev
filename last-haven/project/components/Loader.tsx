import React from "react";

const Loading: React.FC = () => {
  return (
    <div>
      <video src="/loading.mp4" className="w-[300px]" autoPlay muted loop></video>
    </div>
  );
};

export default Loading;