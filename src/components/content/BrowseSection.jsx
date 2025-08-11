import { useState, useEffect } from "react";
import { useToken } from "../context/TokenProvider";

export default function BrowseSection({ setSelectedPlaylist }) {
  const [categories, setCategories] = useState();
  const { token } = useToken();
  const [playlists, setPlaylists] = useState();
  useEffect(() => {
    const fetchBrowseCategories = async () => {
      const res = await fetch(
        "https://api.spotify.com/v1/browse/categories?limit=20&market=IN",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setCategories(data.categories.items);
      console.log("Cat", data);
    };

    fetchBrowseCategories();
  }, [token]);
  async function getCategoryPlaylist(id) {
    console.log("id", id);
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=category%3A${id.toLowerCase()}&type=playlist&limit=20`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("Data in browse", data);
      const filteredPlaylists = data.playlists.items.filter(
        (playlist) =>
          playlist &&
          playlist.name &&
          playlist.images &&
          playlist.images.length > 0 &&
          playlist.owner &&
          playlist.external_urls
      );
      setPlaylists(filteredPlaylists);
    } catch (e) {
      console.error("Error", e);
    }
  }
  return (
    <>
      {!playlists ? (
        <div className="mt-4 p-4">
          <h4 className="text-white">Browse Categories</h4>
          <div className="row">
            {categories?.map((cat) => (
              <div
                key={cat.id}
                className="col-6 col-md-3 mb-4"
                onClick={() => getCategoryPlaylist(cat.name)}
              >
                <div className="card bg-dark text-white">
                  <img
                    src={cat.icons[0].url}
                    className="card-img"
                    alt={cat.name}
                  />
                  <div className="card-img-overlay d-flex align-items-end p-2">
                    <h5 className="card-title">{cat.name}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4">
          <h4 className="text-white">Category Playlists</h4>
          <div className="row">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="col-6 col-md-3 mb-4"
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <div className="card bg-dark text-white">
                  {playlist.images.length > 0 && (
                    <img src={playlist.images[0].url} className="fixed-img" />
                  )}

                  <div className="card-body">
                    <h5 className="card-title">{playlist.name}</h5>
                    <p className="card-text">
                      By {playlist.owner.display_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
