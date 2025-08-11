import { useRef, useState, useEffect } from "react";
import { useToken } from "../context/TokenProvider";
import PortalDropdown from "./PortalDropdown";
import { useSearchTerm } from "../context/SearchContext";

export default function CreateNewItem({
  playlist,
  setPlaylist,
  triggerRef,
  isAdd,
  onAdd,
}) {
  const { token } = useToken();
  const { selectedPlaylist, setSelectedPlaylist } = useSearchTerm();

  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isAdd]);

  const createPlaylist = async (name, description, isPublic) => {
    const userRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = await userRes.json();
    const playlistRes = await fetch(
      `https://api.spotify.com/v1/users/${userData.id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          public: isPublic,
        }),
      }
    );
    if (playlistRes.ok) {
      const playlistData = await playlistRes.json();
      console.log("✅ Playlist created:", playlistData);
      setPlaylist((prev) => [playlistData, ...prev]);
      setSelectedPlaylist({
        id: playlistData.id,
        name: playlistData.name,
        description: playlistData.description,
      });
    } else {
      const error = await playlistRes.json();
      console.error("❌ Error creating playlist:", error);
    }
  };
  return (
    <div style={{ position: "relative", overflow: "visible", zIndex: 1 }}>
      <div
        className="position-relative d-inline-block"
        style={{ overflowY: "visible" }}
      >
        <PortalDropdown style={menuPosition}>
          <div
            className="dropdown-item text-white d-flex"
            style={{ padding: "8px", cursor: "pointer" }}
            onClick={() => {
              onAdd(false);
              createPlaylist("My Playlist", "Created from spotify clone", true);
            }}
          >
            <div className="icon-circle-createlist me-3">
              <i className="bi bi-music-note-list"></i>
            </div>
            <div>
              <p className="fw-bold mb-1 mt-1">Playlist</p>
              <div className="text-white small">
                Build a playlist with songs or episodes
              </div>
            </div>
          </div>

          <div
            className="dropdown-item text-white d-flex"
            style={{ padding: "8px" }}
          >
            <div className="icon-circle-createlist me-3">
              <i className="bi bi-shuffle"></i>
            </div>
            <div>
              <p className="fw-bold mb-1 mt-1">Blend</p>
              <div className="text-white small">
                Mix up your tastes with friends
              </div>
            </div>
          </div>

          <div
            className="dropdown-item text-white d-flex"
            style={{ padding: "8px" }}
          >
            <div className="icon-circle-createlist me-3">
              <i className="bi bi-folder2"></i>
            </div>
            <div>
              <p className="fw-bold mb-1 mt-1">Folder</p>
              <div className="text-white small">Organize your playlists</div>
            </div>
          </div>
        </PortalDropdown>
      </div>
    </div>
  );
}
