import { useEffect, useState } from "react";
import { fetchSpotifyToken } from "../utils";
import { useToken } from "../context/TokenProvider";
import DailyMixes from "../User/DailyMixes";
import Playlist from "../User/Playlist";
import Footer from "../footer/Footer";
import Artists from "../User/Artists";
import Podcasts from "./Podcasts";
import { playTrack } from "../utils";
import { useSpotifyPlayer } from "../context/SpotifyPlayerContext";
import { useSearchTerm } from "../context/SearchContext";

export default function Maincontent() {
  const [tokenInfo, setTokenInfo] = useState({
    token: null,
    timestamp: null,
  });
  const { setSelectedPlaylist } = useSearchTerm();
  const [data, setData] = useState([]);
  const [artists, setArtists] = useState([]);
  const { isLoggedIn, token } = useToken();
  const { deviceId } = useSpotifyPlayer();
  const isTokenExpired = (timestamp) => {
    const now = Date.now();
    const ageInSeconds = (now - timestamp) / 1000;
    return ageInSeconds >= 3600; // 1 hour
  };

  const getValidToken = async () => {
    if (!tokenInfo.token || isTokenExpired(tokenInfo.timestamp)) {
      const newToken = await fetchSpotifyToken(); // your existing function
      setTokenInfo({
        token: newToken,
        timestamp: Date.now(),
      });
      return newToken;
    }
    return tokenInfo.token;
  };

  useEffect(() => {
    async function fetchData() {
      const token = await getValidToken();
      console.log(token);
      const res = await fetch(
        "https://api.spotify.com/v1/browse/new-releases",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("Data", data);
      setData(data.albums.items);
    }
    fetchData();
  }, []);

  async function handleAlbumTracks(album) {
    const token = await getValidToken();
    const res = await fetch(
      `https://api.spotify.com/v1/albums/${album.id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    const normalized = data.items.map((track) => ({ track }));
    console.log("Album songs", normalized, data);
    setSelectedPlaylist({
      name: album.name,
      id: album.id,
      description: "Album Songs",
      images: album.images,
      items: normalized,
    });
  }
  console.log(isLoggedIn, "isLoggedIn");

  return (
    <div
      className="main flex-grow-1 overflow-auto p-3"
      style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
    >
      {isLoggedIn && <Playlist />}
      <div className="container text-white mt-4">
        <h4
          style={{
            padding: "8px",
            paddingLeft: "20px",
            paddingBottom: "15px  ",
            overflowY: "auto",
          }}
        >
          New Releases
        </h4>
        <div
          className="horizontal-scroll d-flex overflow-auto"
          style={{ paddingLeft: "20px" }}
        >
          {data.map((album) => (
            <div
              key={album.id}
              className="me-3 musiccard rounded p-3"
              style={{ minWidth: "150px", maxWidth: "150px" }}
            >
              <div className="album-wrapper">
                <img
                  src={album.images[0].url}
                  alt={album.name}
                  className="img-fluid rounded mb-2 album-cover"
                />
                <button
                  className="play-button"
                  onClick={() => {
                    handleAlbumTracks(album);
                  }}
                >
                  <i className="bi bi-play-fill"></i>
                </button>
              </div>

              <div>
                <h6 className="mb-0 text-truncate">{album.name}</h6>
                <small className="text-white text-truncate d-block">
                  {album.artists.map((a) => a.name).join(", ")}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isLoggedIn && <DailyMixes />}
      {isLoggedIn && <Artists />}
      <Podcasts />

      <Footer />
    </div>
  );
}
