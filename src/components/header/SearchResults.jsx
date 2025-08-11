import { useEffect, useState } from "react";
import { useToken } from "../context/TokenProvider";
import { useSearchTerm } from "../context/SearchContext";
import { playTrack } from "../utils";
import { useSpotifyPlayer } from "../context/SpotifyPlayerContext";

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const { token } = useToken();
  const { searchTerm } = useSearchTerm();
  const { deviceId } = useSpotifyPlayer();

  useEffect(() => {
    if (!searchTerm) return;

    const delayDebounce = setTimeout(async () => {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchTerm
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
  }, [searchTerm, token]);

  return (
    <div className="p-3 text-white">
      <h4>Search Results</h4>
      <div className="row">
        {results.map((track) => (
          <div className="col-md-3" key={track.id}>
            <div className="album-wrapper">
              <img
                src={track.album.images[0]?.url}
                alt={track.name}
                className="img-fluid rounded mb-2"
              />
              <button
                className="play-button"
                onClick={() => {
                  console.log("device id", deviceId, track.uri);
                  playTrack(track.uri, token, deviceId && deviceId);
                }}
              >
                <i className="bi bi-play-fill"></i>
              </button>
            </div>
            <p>{track.name}</p>
            <h6>{track.artists.map((a) => a.name).join(", ")}</h6>
          </div>
        ))}
      </div>
    </div>
  );
}
