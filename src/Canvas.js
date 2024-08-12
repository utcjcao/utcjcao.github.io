import { useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import "./Canvas.css";

function App() {
    const canvasRef = useRef(null);
    const maskRef = useRef(null); // Reference for the mask layer
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [lineColor, setLineColor] = useState("black");
    const [lineOpacity, setLineOpacity] = useState(0.1);
    const hiddenText = "hello world :)"

    useEffect(() => {
        const canvas = canvasRef.current;
        const mask = maskRef.current;
        const ctx = canvas.getContext("2d");
        const maskCtx = mask.getContext("2d");

        canvas.width = 1280;
        canvas.height = 720;
        mask.width = canvas.width;
        mask.height = canvas.height;

        // Clear the mask canvas
        maskCtx.clearRect(0, 0, mask.width, mask.height);

        // Draw hidden text on the mask canvas
        maskCtx.font = "50px Arial";
        maskCtx.fillStyle = "white"; // This is the color to mask (the text color)
        maskCtx.fillText(hiddenText, 100, 200); // Position the text as needed


        // Setup main canvas for drawing
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = lineOpacity;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
    }, [lineColor, lineOpacity, lineWidth]);

    const startDrawing = (e) => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const endDrawing = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.closePath();
        setIsDrawing(false);
    };

    const draw = (e) => {
        if (!isDrawing) {
            return;
        }

        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        const maskCtx = maskRef.current.getContext("2d");
        const pixel = maskCtx.getImageData(x, y, 1, 1).data;

        // Check if the pixel is part of the unpaintable area (black mask)
        if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 255) {
            return; // Skip drawing if it's over the unpaintable area
        }

        // Draw on the main canvas
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    return (
        <div className="App">
            <h1>Paint App</h1>
            <div className="draw-area">
                <Menu
                    setLineColor={setLineColor}
                    setLineWidth={setLineWidth}
                    setLineOpacity={setLineOpacity}
                />
                <canvas
                    ref={canvasRef}
                    width={`1280px`}
                    height={`720px`}
                    style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
                />
                <canvas
                    ref={maskRef}
                    width={`1280px`}
                    height={`720px`}
                    style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseMove={draw}
                />
            </div>
        </div>
    );
}

export default App;
