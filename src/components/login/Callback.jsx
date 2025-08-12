import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../context/TokenProvider";

const clientId = "41d360a9353342ccb2e05ef6d3c37ff9";
const redirectUri = "https://Manjubargave.github.io/Spotify-Clone/#/callback";

export default function Callback() {
  const navigate = useNavigate();
  const { setToken, setIsLoggedIn } = useToken();

  useEffect(() => {
    if (window.location.hash.startsWith("#%2F")) {
      window.location.hash =
        "#" + decodeURIComponent(window.location.hash.slice(1));
    }
    const hash = window.location.href; // e.g. "#/callback?code=abc123&state=xyz"
    console.log("Hash", hash);
    const queryString = hash.includes("?") ? hash.split("?")[1] : "";
    console.log("QS", queryString);
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    const verifier = localStorage.getItem("code_verifier");
    // console.log("Data", urlParams, code, "Verifier", verifier);
    console.log("********CODE******", code);
    console.log("*****VERIFIER*******", verifier);

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
