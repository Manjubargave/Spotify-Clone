import { createContext, useContext, useEffect, useState } from "react";
import { useToken } from "./TokenProvider";

const SpotifyPlayerContext = createContext();

export function SpotifyPlayerProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isPaused, setIsPaused] = useState(true);
  const [trackInfo, setTrackInfo] = useState(null);
  const { token } = useToken();
  console.log("Inside useSpotiftPlayer");

  useEffect(() => {
    console.log("Token", token);
    if (!token || player) return;

    const waitForSpotify = () => {
      if (window.Spotify) {
        const newPlayer = new window.Spotify.Player({
          name: "My Web Player",
          getOAuthToken: (cb) => cb(token),
          volume: 0.5,
        });

        newPlayer.addListener("ready", ({ device_id }) => {
          console.log("✅ Ready with Device ID:", device_id);
          setDeviceId(device_id);
        });

        newPlayer.addListener("player_state_changed", (state) => {
          if (!state) return;
          setIsPaused(state.paused);
          setTrackInfo(state.track_window.current_track);
        });

        newPlayer.connect().then((success) => {
          if (success) {
            console.log("Connected!");

            newPlayer.getCurrentState().then((state) => {
              if (state) {
                setTrackInfo(state.track_window.current_track);
                setIsPaused(state.paused);
              }
            });

            setPlayer(newPlayer);
          }
        });
      } else {
        setTimeout(waitForSpotify, 300);
      }
    };

    waitForSpotify();
  }, [token]);

  return (
    <SpotifyPlayerContext.Provider
      value={{
        player,
        deviceId,
        isPaused,
        setIsPaused,
        trackInfo,
        setTrackInfo,
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  );
}

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);
