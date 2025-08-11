import { useState } from "react";
import { useToken } from "../context/TokenProvider";

export default function EditPlaylist({
  onEdit,
  playlistName,
  playlistDescription,
  playlistId,
  onEditSelectedPlaylist,
  setPlaylist,
}) {
  const [name, setName] = useState(playlistName);
  const [description, setDescription] = useState(playlistDescription);
  const { token } = useToken();
  async function updatePlaylistName(playlistId, newName, description, token) {
    console.log("Inside update");
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newName,
            description: description,
          }),
        }
      );

      if (response.ok) {
        console.log("✅ Playlist name updated!");
        onEdit(false);

        onEditSelectedPlaylist((prev) => ({
          ...prev,
          name: newName,
          description: description,
        }));
        setPlaylist((prevPlaylists) =>
          prevPlaylists.map((playlist) =>
            playlist.id === playlistId
              ? { ...playlist, name: newName, description: description }
              : playlist
          )
        );
      } else {
        const err = await response.json();
        console.error("❌ Failed to update:", err);
      }
    } catch (err) {
      console.error("Error updating playlist name:", err);
    }
  }

  return (
    <div className="modal-backdrop d-flex justify-content-center align-items-center">
      <div
        className="bg-dark p-4 rounded text-white"
        style={{ width: "400px" }}
      >
        <h5>Edit Playlist</h5>
        <input
          style={{ backgroundColor: "hsla(0,0%,100%,.1)", border: "none" }}
          className="form-control my-2 text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          style={{ backgroundColor: "hsla(0,0%,100%,.1)", border: "none" }}
          className="form-control my-2 text-white"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-secondary me-2"
            onClick={() => onEdit(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              console.log("save clicked");
              updatePlaylistName(playlistId, name, description, token);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
