import { useEffect, useState } from "react";
import { useToken } from "../context/TokenProvider";
import { useSearchTerm } from "../context/SearchContext";
import { playTrack } from "../utils";
import { useSpotifyPlayer } from "../context/SpotifyPlayerContext";

export default function Podcasts() {
  const { token } = useToken();
  const [podcasts, setPodcasts] = useState(null);
  const { setSelectedPlaylist, setCategoriesSelected } = useSearchTerm();
  const { deviceId } = useSpotifyPlayer();

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await fetch(
          `https://api.spotify.com/v1/search?q=tamil,technology,funny,english&type=show&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        console.log(data.shows.items);
        setPodcasts(data.shows.items);
      } catch (err) {
        console.error("Error fetching podcasts:", err);
      }
    };

    fetchPodcasts();
  }, [token]);
  async function handlePodcast(album) {
    const res = await fetch(
      `https://api.spotify.com/v1/shows/${album.id}/episodes`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    console.log(data.items); // list of episodes with URIs
    const normalized = data.items.map((track) => ({ track }));
    console.log("Podcast Data", normalized);
    setSelectedPlaylist({
      name: album.name,
      description: "Podcasts",
      id: album.id,
      images: album.images,
      items: normalized,
    });
    setCategoriesSelected(true);
  }
  return (
    <>
      <h4
        style={{
          padding: "8px",
          paddingLeft: "20px",
          paddingTop: "15px",
          color: "white",
        }}
      >
        Podcasts
      </h4>
      <div
        className="horizontal-scroll d-flex overflow-auto"
        style={{ paddingLeft: "20px" }}
      >
        {podcasts &&
          podcasts.map((album) => (
            <div
              key={album.id}
              className="me-3 musiccard rounded p-3"
              style={{ minWidth: "150px", maxWidth: "150px" }}
              onClick={() => handlePodcast(album)}
            >
              <div className="album-wrapper">
                <img
                  src={album.images[0].url}
                  alt={album.name}
                  className="img-fluid rounded mb-2 album-cover"
                />
                <button className="play-button">
                  <i className="bi bi-play-fill"></i>
                </button>
              </div>

              <div>
                <h6 className="text-white mb-0 text-truncate">{album.name}</h6>
                <small className="text-white-50 text-truncate d-block">
                  {album.publisher}
                </small>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
