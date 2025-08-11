import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./components/login/Login.jsx";
import Callback from "./components/login/Callback.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
  {
    path: "/homepage",
    element: <Home />,
  },
  {
    path: "/legal",
    element: <Legal />,
  },
  {
    path: "/safetyandprivacy",
    element: <SafetyandPrivacy />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/cookies",
    element: <Cookies />,
  },
  {
    path: "/aboutads",
    element: <AboutAds />,
  },
  {
    path: "/accessibility",
    element: <Accessibility />,
  },
]);

createRoot(document.getElementById("root")).render(
  <TokenProvider>
    <SearchProvider>
      <SpotifyPlayerProvider>
        <RouterProvider router={router} />
      </SpotifyPlayerProvider>
    </SearchProvider>
  </TokenProvider>
);
