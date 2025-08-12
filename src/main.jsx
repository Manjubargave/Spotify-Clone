import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/login/Login.jsx";
import Callback from "./components/login/Callback.jsx";
import Home from "./components/Home/Home.jsx";
import TokenProvider from "./components/context/TokenProvider.jsx";
import SearchProvider from "./components/context/SearchContext.jsx";
import { SpotifyPlayerProvider } from "./components/context/SpotifyPlayerContext.jsx";
import Legal from "./components/footer/Legal.jsx";
import SafetyandPrivacy from "./components/footer/SafetyandPrivacy.jsx";
import PrivacyPolicy from "./components/footer/PrivacyPolicy.jsx";
import Cookies from "./components/footer/Cookies.jsx";
import AboutAds from "./components/footer/AboutAds.jsx";
import Accessibility from "./components/footer/Accessibility.jsx";
import SignUp from "./components/login/SignUp.jsx";

import { HashRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <TokenProvider>
    <SearchProvider>
      <SpotifyPlayerProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/homepage" element={<Home />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/safetyandprivacy" element={<SafetyandPrivacy />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/aboutads" element={<AboutAds />} />
            <Route path="/accessibility" element={<Accessibility />} />
          </Routes>
        </HashRouter>
      </SpotifyPlayerProvider>
    </SearchProvider>
  </TokenProvider>
);
