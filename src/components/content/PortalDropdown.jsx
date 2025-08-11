import { createPortal } from "react-dom";

export default function PortalDropdown({ children, style = {} }) {
  return createPortal(
    <div
      className="custom-menu show"
      style={{
        width: "350px",
        padding: "10px",
        backgroundColor: "#404040",
        borderRadius: "10px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
        zIndex: 9999,
        position: "absolute",
        top: style.top || "100px", // You can dynamically calculate this
        left: style.left || "100px",
        ...style,
      }}
    >
      {children}
    </div>,
    document.body // This renders outside the normal DOM tree
  );
}
