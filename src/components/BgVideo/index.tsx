import React from "react";

// Component to set the background video, used for portal
const BgVideo = ({ videoSource, loop }: { videoSource: any; loop: boolean }) => {
  return (
    <>
      <div className="container">
        <video
          autoPlay
          loop={loop}
          muted
          style={{
            position: "absolute",
            width: "100%",
            left: "50%",
            top: "50%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            zIndex: "-1",
          }}
        >
          <source src={videoSource} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
};

export default BgVideo;
