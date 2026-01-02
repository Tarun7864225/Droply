import toast from "react-hot-toast";

type ToastType = "success" | "error" | "working";

export const showCustomToast = (type: ToastType, message: string) => {
  const bgColor = {
    success: "#1EF516", // green-600
    error: "#ff0000",   // red-600
    working: "#FFD03D", // yellow-500
  }[type];

  const icon = {
    success: "✅",
    error: "❌",
    working: "⏳",
  }[type];

  toast(() => (
    <div
      className="flex items-center text-white w-full box-border"
    >
      <span className="text-lg">{icon}</span>
        <p className="font-semibold">{message}</p>
    </div>
  ), {
    // Outer container gets same background color
    style: {
      background: bgColor
    },
  });
};
