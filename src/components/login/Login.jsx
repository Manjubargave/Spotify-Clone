import { generateCodeChallenge, generateCodeVerifier } from "../../pkce";

const clientId = "41d360a9353342ccb2e05ef6d3c37ff9";
const redirectUri = "http://127.0.0.1:5173/callback";
const scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "playlist-read-private",
  "user-read-recently-played",
  "user-modify-playback-state",
  "user-read-playback-state",
  "streaming",
  "user-follow-read",
  "playlist-modify-public",
  "playlist-modify-private",
];

const authEndpoint = "https://accounts.spotify.com/authorize";

export default function Login() {
  async function handleLogin() {
    const verifier = generateCodeVerifier();
    console.log("vERIFIER2", verifier);
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem("code_verifier", verifier);

    const authUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(
      scopes.join(" ")
    )}&code_challenge_method=S256&code_challenge=${challenge}`;
    window.location.href = authUrl;
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
      <h1>Spotify Clone</h1>
      <a>
        <button className="btn btn-success mt-4" onClick={handleLogin}>
          Login with Spotify
        </button>
      </a>
    </div>
  );
}
