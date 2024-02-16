import React, { useEffect, useRef } from "react";
import anime from "animejs";

function Popup({
  text,
  showPopup,
  setShowPopup,
}: {
  text: string;
  showPopup: boolean;
  setShowPopup: React.Dispatch<boolean>;
}) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showPopup) {
      anime({
        targets: popupRef.current,
        opacity: [0, 1],
        duration: 1000,
        translateY: [-50, 0],
      });

      setTimeout(() => {
        anime({
          targets: popupRef.current,
          translateY: [0, +50],
          opacity: [1, 0],
          duration: 1000,
        });
        setShowPopup(false);
      }, 2000);
    }
  }, [showPopup]);

  return (
    <div className="absolute bottom-20 left-1/2 z-30 -translate-x-1/2">
      <div ref={popupRef} className="opacity-0">
        <p className="dark:text-gray-300">{text}</p>
      </div>
    </div>
  );
}

export default Popup;
