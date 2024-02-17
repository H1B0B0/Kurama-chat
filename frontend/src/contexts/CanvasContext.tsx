import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Application } from "@splinetool/runtime";

const CanvasContext = createContext<Application | null>(null);

export const useCanvas = () => useContext(CanvasContext);

export const CanvasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [app, setApp] = useState<Application | null>(null);

  useEffect(() => {
    if (canvasRef.current && !app) {
      const newApp = new Application(canvasRef.current);
      newApp.load(
        "https://prod.spline.design/hnkOtrqss6sQ-wLy/scene.splinecode"
      );
      setApp(newApp);
    }
  }, [canvasRef, app]);

  return (
    <CanvasContext.Provider value={app}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      />
      {children}
    </CanvasContext.Provider>
  );
};
