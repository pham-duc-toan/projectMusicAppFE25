"use client";
import { useState, useEffect, ReactNode } from "react";

import Box from "@mui/material/Box";

type OrientationGuardProps = {
  children: ReactNode;
};

const OrientationGuard = ({ children }: OrientationGuardProps) => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    };

    // Kiểm tra hướng màn hình khi component mount
    checkOrientation();

    // Lắng nghe sự thay đổi hướng màn hình
    window.addEventListener("resize", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  if (isPortrait) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          color: "#fff",
          textAlign: "center",
          flexDirection: "column",
        }}
      >
        <svg
          id="pleaserotate-graphic"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 250 250"
          width="250"
          height="250"
          style={{
            animation: "rotate-animation 3s infinite", // Áp dụng animation CSS
          }}
        >
          <style>
            {`
              @keyframes rotate-animation {
                 0% { transform: rotate(0deg); }
                66% { transform: rotate(90deg); } 
                100% { transform: rotate(90deg); } 
              }
            `}
          </style>
          <g>
            <path
              fill="#fffe"
              d="M190.5,221.3c0,8.3-6.8,15-15,15H80.2c-8.3,0-15-6.8-15-15V28.7c0-8.3,6.8-15,15-15h95.3c8.3,0,15,6.8,15,15V221.3zM74.4,33.5l-0.1,139.2c0,8.3,0,17.9,0,21.5c0,3.6,0,6.9,0,7.3c0,0.5,0.2,0.8,0.4,0.8s7.2,0,15.4,0h75.6c8.3,0,15.1,0,15.2,0s0.2-6.8,0.2-15V33.5c0-2.6-1-5-2.6-6.5c-1.3-1.3-3-2.1-4.9-2.1H81.9c-2.7,0-5,1.6-6.3,4C74.9,30.2,74.4,31.8,74.4,33.5zM127.7,207c-5.4,0-9.8,5.1-9.8,11.3s4.4,11.3,9.8,11.3s9.8-5.1,9.8-11.3S133.2,207,127.7,207z"
            ></path>
          </g>
        </svg>
      </Box>
    );
  }

  return <>{children}</>;
};

export default OrientationGuard;
