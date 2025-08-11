export default function Popup({ onClose }) {
  return (
    <div
      className="rounded p-3 m-2"
      style={{ backgroundColor: "#14bbe5ff", width: "250px" }}
    >
      <div>
        <h6 style={{ fontWeight: 700 }}>Create a Playlist</h6>
        <p style={{ fontWeight: 400 }}>Login to create playlist</p>
      </div>
      <div className="ms-auto">
        <button
          style={{
            borderRadius: "50px",
            padding: "5px 15px",
            fontSize: "14px",
            fontWeight: "700",
            border: "none",
            marginRight: "10px",
            backgroundColor: "#14bbe5ff",
          }}
          onClick={() => onClose(false)}
        >
          Not Now
        </button>
        <button
          style={{
            borderRadius: "50px",
            backgroundColor: "white",
            padding: "5px 15px",
            fontSize: "14px",
            fontWeight: "700",
            border: "none",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
