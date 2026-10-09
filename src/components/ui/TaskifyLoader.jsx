export default function TaskifyLoader({ minHeight = "min-h-[70vh]" }) {
  return (
    <div className={`w-full ${minHeight} flex items-center justify-center bg-transparent`}>
      <style>{`
        .taskify-bar {
          width: 8px;
          height: 40px;
          background-color: #009689;
          border-radius: 4px;
          animation: scaleY 1s infinite ease-in-out;
        }
        @keyframes scaleY {
          0%, 40%, 100% { transform: scaleY(0.4); }
          20% { transform: scaleY(1.0); }
        }
      `}</style>
      <div className="flex gap-2 items-center justify-center h-[80px]">
        <div className="taskify-bar" style={{ animationDelay: "-0.3s" }}></div>
        <div className="taskify-bar" style={{ animationDelay: "-0.15s" }}></div>
        <div className="taskify-bar" style={{ animationDelay: "0s" }}></div>
        <div className="taskify-bar" style={{ animationDelay: "0.15s" }}></div>
      </div>
    </div>
  );
}
