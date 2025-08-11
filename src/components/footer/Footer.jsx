import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="footer-container text-white py-5 px-4 d-flex justify-content-between align-items-center">
      <div className="d-flex flex-wrap gap-4">
        <span onClick={() => navigate("/legal")}>Legal</span>

        <span onClick={() => navigate("/safetyandprivacy")}>
          Safety & Privacy Center
        </span>
        <span onClick={() => navigate("/privacy")}>Privacy Policy</span>
        <span onClick={() => navigate("/cookies")}>Cookies</span>
        <span onClick={() => navigate("/aboutads")}>About Ads</span>
        <span onClick={() => navigate("/accessibility")}>Accessibility</span>
      </div>
      <div>&copy; 2025 Spotify Clone</div>
    </footer>
  );
}
