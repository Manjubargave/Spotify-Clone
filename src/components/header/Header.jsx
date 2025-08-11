import { useNavigate } from "react-router-dom";
import { useToken } from "../context/TokenProvider";
import { useEffect, useState } from "react";
import { useSearchTerm } from "../context/SearchContext";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, token, logout } = useToken();
  const [profile, setProfile] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    searchTerm,
    setSearchTerm,
    selectedPlaylist,
    setSelectedPlaylist,
    setCategoriesSelected,
  } = useSearchTerm();
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Profile", data);
      setProfile(data);
    };
    if (isLoggedIn) {
      fetchProfile();
    }
  }, []);
  return (
    <>
      <div
        style={{ backgroundColor: "black", display: "flex", padding: "5px" }}
        className="d-flex align-items-center px-3"
      >
        <img src="/logo4.png" alt="image" className="logo" />
        <div
          className="icon-circle"
          onClick={() => {
            setSearchTerm("");
            setSelectedPlaylist(null);
            setCategoriesSelected(false);
          }}
        >
          <i className="bi bi-house-door home"></i>
        </div>
        <div className="input-group search-bar">
          <span
            className="input-group-text bg-dark border-0"
            style={{ color: "#ccc", fontSize: "20px" }}
          >
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            placeholder="what do you want?"
            className="form-control bg-dark text-light border-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span
            className="input-group-text bg-dark border-start ps-3"
            onClick={() => {
              console.log("Clicked Browse");
              setCategoriesSelected(true);
            }}
          >
            <i
              class="bi bi-inbox"
              style={{
                color: "#ccc",
                fontSize: "30px",
                borderLeft: "1px solid",
                borderColor: "#ccc",
                paddingLeft: "12px",
              }}
            ></i>
          </span>
        </div>

        {isLoggedIn ? (
          <div className="ms-auto">
            <div
              style={{
                color: "white",
                backgroundColor: "#333",
                padding: "10px",
                paddingLeft: "15px",
                paddingRight: "15px",
                borderRadius: "50px",
              }}
              className="ms-auto d-flex "
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {profile && profile.display_name}
            </div>
            {showDropdown && (
              <div className="dropdown-menu show dropdown-menu-end mt-2 bg-dark text-white">
                <button className="dropdown-item text-white " onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="ms-auto d-flex gap-2">
            <button
              className="btn btn-outline-light signup"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
            <button className="login" onClick={() => navigate("/login")}>
              Log in
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
