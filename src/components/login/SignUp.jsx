// SignUpButton.jsx
export default function SignUp() {
  const handleSignUp = () => {
    window.location.href =
      "https://www.spotify.com/in-en/signup?forward_url=https%3A%2F%2Fopen.spotify.com%2F";
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
      <h1>Spotify Clone</h1>
      <a>
        <button className="btn btn-success mt-4" onClick={handleSignUp}>
          SignUp with Spotify
        </button>
      </a>
    </div>
  );
}
