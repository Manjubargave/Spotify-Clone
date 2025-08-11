import { useEffect, useState } from "react";
import { useToken } from "../context/TokenProvider";
import { getSortedPlaylist } from "../Helper";

export default function Playlist() {
  const [recentPlaylist, setRecentPlaylist] = useState([]);
  const { token, isLoggedIn } = useToken();
  useEffect(() => {
    const fetchRecentPlaylist = async () => {
      const res = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=50",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const sortedIds = getSortedPlaylist(data.items);
      const playlists = await Promise.all(
        sortedIds.map(async (id) => {
          const res = await fetch(
            `https://api.spotify.com/v1/playlists/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return await res.json();
        })
      );
      console.log("Playlists in playlist.jsx", playlists);
      setRecentPlaylist(playlists);
    };
    if (isLoggedIn) {
      fetchRecentPlaylist();
    }
  }, []);
  return (
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-md-2 g-3">
        {recentPlaylist.map((playlist) => (
          <div className="col" key={playlist.id}>
            <div className="d-flex align-items-center playlist-card p-2 rounded">
              <img
                src={playlist.images?.[0]?.url}
                alt={playlist.name}
                className="playlist-img me-3"
              />
              <div>
                <h6 className="mb-0 fw-bold text-white">{playlist.name}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
