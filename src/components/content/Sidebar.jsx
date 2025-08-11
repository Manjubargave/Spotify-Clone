import { useToken } from "../context/TokenProvider";
import CreateNewItem from "./CreateNewItem";
import { useState, useRef } from "react";
import Popup from "./Popup";

export default function Sidebar({
  playlist = null,
  setPlaylist,
  setSelectedPlaylist,
  setCategoriesSelected,
}) {
  const [isAdd, setIsAdd] = useState(false);
  console.log("Playliost in sidebar", playlist);
  const triggerRef = useRef(null);
  const { isLoggedIn, token } = useToken();
  const [popup, setPopup] = useState(false);
  function handleCreatePlaylist() {}

  return (
    <div
      style={{
        overflowY: "auto",
        maxHeight: "calc(100vh - 200px)",
        scrollbarWidth: "none",
        position: "relative",
      }}
    >
      <div className="d-flex justify-content-between align-items-center px-3 py-3">
        <h6>
          <b>Your Library</b>
        </h6>
        <div
          style={{ fontSize: "24px", paddingBottom: "15px", cursor: "pointer" }}
          className="ms-auto"
          onClick={() => setIsAdd((prev) => !prev)}
          ref={triggerRef}
        >
          {isAdd ? "x" : "+"}
        </div>
        {isAdd && (
          <CreateNewItem
            playlist={playlist}
            setPlaylist={setPlaylist}
            triggerRef={triggerRef}
            isAdd={isAdd}
            onAdd={setIsAdd}
          />
        )}
      </div>

      {isLoggedIn ? (
        <div style={{ overflowY: "auto" }}>
          {playlist.map((playlist) => {
            return (
              <div
                key={playlist.id}
                className="d-flex align-items-center mb-3 playlist-item"
                onClick={() => {
                  setSelectedPlaylist({
                    id: playlist.id,
                    name: playlist.name,
                    description: playlist.description,
                    images: playlist.images ? playlist.images[0].url : null,
                  });
                  setCategoriesSelected(false);
                }}
              >
                <img
                  src={
                    playlist.images && playlist.images[0]
                      ? playlist.images[0].url
                      : "/default.jpeg"
                  }
                  alt={playlist.name}
                  className="playlist-thumb me-2"
                />
                <div>
                  <div className="text-white text-truncate">
                    {playlist.name}
                  </div>
                  <div className="text-white-50 fw-normal small text-truncate">
                    {playlist.type.charAt(0).toUpperCase() +
                      playlist.type.slice(1)}{" "}
                    &bull; {playlist.owner.display_name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div
            className="m-2 p-3"
            style={{
              height: "130px",
              backgroundColor: "#000",
              borderRadius: "10px",
            }}
          >
            <h6 style={{ fontWeight: "700" }}>Create your first playlist</h6>
            <p style={{ fontWeight: "400" }}>It’s easy — we’ll help you.</p>

            <button
              style={{
                borderRadius: "50px",
                backgroundColor: "white",
                padding: "5px 15px",
                fontSize: "14px",
                fontWeight: "700",
                border: "none",
              }}
              onClick={() => setPopup(true)}
            >
              Create Playlist
            </button>
          </div>
          <div
            style={{
              position: "fixed",
              top: "45%",
              left: "34%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
            {popup && <Popup onClose={setPopup} />}
          </div>
        </div>
      )}
    </div>
  );
}
