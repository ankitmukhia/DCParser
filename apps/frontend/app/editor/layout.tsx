"use client";

import { useState, useEffect, useRef } from "react";
import { Chat } from "@/components/chats/chat";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [leftWidth, setLeftWidth] = useState(350);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const maxLeftWidth = 600;
  const minLeftWidth = 300;

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    /* console.log("contianer right: ", containerRect.right)
		console.log("clientX: ", e.clientX)
		console.log("div postition: ", containerRect.right - e.clientX) */
    const newLeftWidth = containerRect.right - e.clientX;
    console.log(newLeftWidth);

    if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
      setLeftWidth(newLeftWidth);
    }
  };

  // drop stop, mouse click done.
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="min-hscreen mt-40 px-40">
      <div className="">
        {children}
      </div>
			{/* <div
        className={`w-1 cursor-col-resize transition-colors duration-150`}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-0.5 h-8 bg-gray-400 rounded-full opacity-60" />
        </div>
      </div> */}

			{/*       <Chat leftWidth={leftWidth} initialMessage={[]} /> */}
    </div>
  );
}
