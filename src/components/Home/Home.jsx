import { useEffect, useState } from "react";
import Content from "../content/content";
import Header from "../header/Header";
import { useToken } from "../context/TokenProvider";

export default function Home() {
  const [playlist, setPlaylist] = useState([]);
  const { token } = useToken();

  useEffect(() => {
    async function fetchUserPlaylists() {
      const res = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log(data.items); // Each playlist with name, images, etc.
      setPlaylist(data.items);
    }
    fetchUserPlaylists();
  }, []);
  return (
    <>
      <Header />
      <Content playlist={playlist && playlist} setPlaylist={setPlaylist} />
    </>
  );
}
