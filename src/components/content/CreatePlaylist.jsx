import { useState, useEffect } from "react";
import { useToken } from "../context/TokenProvider";
import Footer from "../footer/Footer";
import { formatDuration } from "../Helper";
import { playTrack } from "../utils";
import { useSpotifyPlayer } from "../context/SpotifyPlayerContext";
import EditPlaylist from "./EditPlaylist";
import { useSearchTerm } from "../context/SearchContext";

export default function CreatePlaylist({
  selectedPlaylist,
  setSelectedPlaylist,
  setPlaylist,
  playlist,
}) {
  const [search, setSearch] = useState("");
  const { token } = useToken();
  const [results, setResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState(
    selectedPlaylist.items ? selectedPlaylist.items : []
  );
  const [updateFlag, setUpdateFlag] = useState(false);
  const { deviceId } = useSpotifyPlayer();
  const [edit, setEdit] = useState(false);
  const { categoriesSelected } = useSearchTerm();

  console.log(
    "selected Playlist",
    selectedPlaylist,
    categoriesSelected,
    playlistTracks
  );
  useEffect(() => {
    const fetchTracks = async () => {
      // ✅ If artist top tracks are already in selectedPlaylist.items, use them directly
      if (selectedPlaylist?.items) {
        setPlaylistTracks(selectedPlaylist.items);
        return;
      }

      // ✅ Otherwise, it's a real playlist — fetch tracks via playlist API
      if (!selectedPlaylist?.id) return;

      try {
        const res = await fetch(
          `https://api.spotify.com/v1/playlists/${selectedPlaylist.id}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setPlaylistTracks(data.items || []);
      } catch (err) {
        console.error("Error fetching playlist tracks", err);
      }
    };

    fetchTracks();
  }, [selectedPlaylist, updateFlag, edit]);

  async function addtoPlaylist(playlistId, trackUri) {
    try {
      // Step 1: Add track to playlist
      await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [trackUri] }),
      });

      setUpdateFlag((prev) => !prev);
    } catch (err) {
      console.error("Failed to add song or fetch updated tracks", err);
    }
  }
  function onSearch() {
    if (!search) return;
    const delayDebounce = setTimeout(async () => {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          search
        )}&type=track,artist,album&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      console.log("data", data.tracks.items);
      setResults(data.tracks?.items || []);
    }, 500); // debounce for 500ms

    return () => clearTimeout(delayDebounce);
  }
  async function deletePlaylist(playlistId) {
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Your OAuth token
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        console.log("Playlist deleted (unfollowed)");
        const updatedPlaylists = playlist.filter((p) => p.id !== playlistId);
        setPlaylist(updatedPlaylists);
        setSelectedPlaylist(null);
      } else {
        console.error("Failed to delete playlist");
      }
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  }
  return (
    <div
      className="main flex-grow-1 overflow-auto p-3"
      style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
    >
      {edit && (
        <EditPlaylist
          onEdit={setEdit}
          playlistName={selectedPlaylist.name}
          playlistDescription={selectedPlaylist.description}
          playlistId={selectedPlaylist.id}
          onEditSelectedPlaylist={setSelectedPlaylist}
          setPlaylist={setPlaylist}
        />
      )}
      <div className="d-flex align-items-center px-5 gap-3 text-white py-5 bg-dark">
        {selectedPlaylist?.images ? (
          selectedPlaylist?.images[0]?.url ? (
            <img
              src={selectedPlaylist?.images[0]?.url}
              style={{ width: "200px", height: "200px" }}
            />
          ) : (
            <img
              src={selectedPlaylist?.images}
              style={{ width: "200px", height: "200px" }}
            />
          )
        ) : (
          <i
            className="bi bi-music-note-beamed d-flex justify-content-center align-items-center"
            style={{
              width: "200px",
              height: "200px",
              fontSize: "100px",
              backgroundColor: "gray",
            }}
          ></i>
        )}
        <div
          onClick={() => {
            console.log("Edited");
            if (!categoriesSelected) setEdit(true);
          }}
          style={{ cursor: "pointer" }}
        >
          <h1 className="fs- fw-bold mb-1">{selectedPlaylist?.name}</h1>
          <p className="fs-6 text-white-50">{selectedPlaylist?.description}</p>

          <button
            className="playlist-button"
            onClick={(e) => {
              e.stopPropagation();
              const uris = playlistTracks.map((item) => item.track.uri);
              playTrack(uris, token, deviceId);
            }}
          >
            <i className="bi bi-play-fill"></i>
          </button>
        </div>

        {!categoriesSelected && (
          <div className="ms-auto rounded-circle d-flex">
            <button
              style={{
                borderRadius: "50px",
                backgroundColor: "#3a3a3a",
                color: "white",
                border: "solid 1px grey",
              }}
              onClick={() => deletePlaylist(selectedPlaylist.id)}
            >
              <i class="bi bi-trash"></i>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 px-4">
        {/* Header Row */}
        <div
          className="d-flex text-white-50 fw-bold border-bottom pb-2 mb-3"
          style={{ fontSize: "14px" }}
        >
          <div className="flex-grow-1">Title</div>
          <div className="flex-grow-1" style={{ textAlign: "right" }}>
            Album
          </div>
          <div style={{ width: "80px", textAlign: "right" }}>Time</div>
        </div>

        {/* Track List */}
        <div className="list-group">
          {playlistTracks &&
            playlistTracks.map((item, idx) => (
              <div
                key={idx}
                className="list-group-item bg-dark text-light d-flex align-items-center"
                style={{ border: "none", cursor: "pointer" }}
                onClick={() => playTrack(item.track.uri, token, deviceId)}
              >
                {/* Title */}
                <div className="flex-grow-1 d-flex align-items-center">
                  <img
                    src={
                      item.track.album?.images[0]?.url
                        ? item.track.album.images[0]?.url
                        : selectedPlaylist.images?.[0]?.url || "/default.png"
                    }
                    height={35}
                    width={35}
                    className="me-3"
                    alt="album"
                  />
                  <div>
                    <div>{item.track.name}</div>
                    <div className="text-white-50" style={{ fontSize: "13px" }}>
                      {item.track.artists &&
                        item.track.artists.map((a) => a.name).join(", ")}
                    </div>
                  </div>
                </div>

                {/* Album */}
                <div
                  className="flex-grow-1 text-truncate"
                  style={{ textAlign: "right" }}
                >
                  {item.track.album?.name
                    ? item.track.album?.name
                    : item.track.name}
                </div>

                {/* Duration */}
                <div style={{ width: "80px", textAlign: "right" }}>
                  {formatDuration(item.track.duration_ms)}
                </div>
              </div>
            ))}
        </div>
      </div>

      {!categoriesSelected && (
        <div>
          <p className="fs-4 text-white fw-bold p-3">
            Let's find something for your playlist
          </p>
          <div className="input-group playlist-search-bar">
            <span
              className="input-group-text bg-dark border-0"
              style={{ color: "#ccc", fontSize: "20px" }}
            >
              <i class="bi bi-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search for the songs"
              className="form-control bg-dark text-light border-0"
              value={search}
              onChange={(e) => {
                onSearch();
                setSearch(e.target.value);
              }}
            />
          </div>
        </div>
      )}
      {search && results.length > 0 && (
        <ul className="list-group text-white">
          {results.map((track) => (
            <li
              key={track.id}
              className="list-group-item list-group-item-action d-flex align-items-center"
              style={{
                cursor: "pointer",
                backgroundColor: "#2a2a2a",
                color: "white",
                border: "none",
              }}
            >
              <img
                src={track.album.images[2]?.url}
                alt="album art"
                width={40}
                height={40}
              />
              <div style={{ paddingLeft: "30px" }}>
                <strong>{track.name}</strong> by{" "}
                {track.artists.map((artist) => artist.name).join(", ")}
              </div>
              <div className="ms-auto">
                <button
                  style={{
                    borderRadius: "50px",
                    color: "white",
                    border: "1px solid",
                  }}
                  className="px-3 py-0 bg-dark "
                  onClick={() => addtoPlaylist(selectedPlaylist.id, track.uri)}
                >
                  Add
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Footer />
    </div>
  );
}
