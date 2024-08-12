import { useEffect, useRef, useState } from "react";
import "./Canvas.css";

function App() {
    const canvasRef = useRef(null);
    const maskRef = useRef(null); // Reference for the mask layer
    const [isDrawing, setIsDrawing] = useState(false);
    const lineWidth = 20;
    let lineColorStep = 0;
    const lineOpacity = 0.5;
    const hiddenText = "hello world :)"
    const [drips, setDrips] = useState([]);
    

    function getRainbowColor(step) {
        const r = Math.sin(0.3 * step + 0) * 127 + 200;
        const g = Math.sin(0.3 * step + 2) * 127 + 200;
        const b = Math.sin(0.3 * step + 4) * 127 + 200;
        return `rgb(${r},${g},${b})`;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const mask = maskRef.current;
        const ctx = canvas.getContext("2d");
        const maskCtx = mask.getContext("2d");

        ctx.globalCompositeOperation = "screen";

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
        ctx.strokeStyle = getRainbowColor(lineColorStep);
        ctx.lineWidth = lineWidth;
        const dripInterval = setInterval(() => {
            updateDrips();
        }, 50);

        return () => clearInterval(dripInterval);
    }, [lineColorStep, lineOpacity, lineWidth]);

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

    function drawStar(ctx, x, y, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let cx = x;
        let cy = y;
        let step = Math.PI / spikes;
    
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            cx = x + Math.cos(rot) * outerRadius;
            cy = y - Math.sin(rot) * outerRadius;
            ctx.lineTo(cx, cy);
            rot += step;
    
            cx = x + Math.cos(rot) * innerRadius;
            cy = y - Math.sin(rot) * innerRadius;
            ctx.lineTo(cx, cy);
            rot += step;
        }
        ctx.lineTo(x, y - outerRadius);
        ctx.closePath();
        ctx.stroke();
    }
    
    const updateDrips = () => {
        setDrips((prevDrips) => {
            const newDrips = prevDrips.map((drip) => {
                const newY = drip.y + 2;
                return { ...drip, y: newY, length: drip.length + 2 };
            });

            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // Clear the canvas and redraw
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Redraw drips
            newDrips.forEach((drip) => {
                ctx.strokeStyle = drip.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(drip.x, drip.y - drip.length);
                ctx.lineTo(drip.x, drip.y);
                ctx.stroke();
            });

            return newDrips;
        });
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
        ctx.strokeStyle = getRainbowColor(lineColorStep);
        drawStar(ctx, x, y, 5, 40, 20);
        lineColorStep += 1;
        ctx.stroke();
        setDrips((prevDrips) => [
            ...prevDrips,
            { x: x, y: y, length: 0, color: getRainbowColor(lineColorStep) },
        ]);
    };

    

    return (
        <div className="App">
            <div className="draw-area">
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
