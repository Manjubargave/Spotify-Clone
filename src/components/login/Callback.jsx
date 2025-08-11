import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../context/TokenProvider";

const clientId = "41d360a9353342ccb2e05ef6d3c37ff9";
const redirectUri = "http://127.0.0.1:5173/callback";

export default function Callback() {
  const navigate = useNavigate();
  const { setToken, setIsLoggedIn } = useToken();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const verifier = localStorage.getItem("code_verifier");
    console.log("Data", urlParams, code, "Verifier", verifier);

    if (!code || !verifier) {
      alert("Missing code or verifier");
      return;
    }

    async function fetchAccessToken() {
      const body = new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        code_verifier: verifier,
      });

      const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      const data = await res.json();
      console.log("Data in callback", data);
      if (data.access_token) {
        localStorage.setItem("spotify_access_token", data.access_token);
        setToken(data.access_token);
        setIsLoggedIn(true);
        navigate("/homepage");
      } else {
        alert("Failed to get access token");
        console.error(data);
      }
    }

    fetchAccessToken();
  }, [navigate, setToken]);

  return <h3 className="text-white">Logging you in...</h3>;
}
