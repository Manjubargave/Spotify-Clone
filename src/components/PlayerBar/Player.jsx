// components/PlayerBar.jsx
import { useEffect, useState } from "react";
import "./PlayerBar.css";

export default function Player({ track, player }) {
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (!player || typeof player.addListener !== "function") return;

    const handleStateChange = (state) => {
      if (!state) return;
      setIsPaused(state.paused);
    };

    player.addListener("player_state_changed", handleStateChange);

    return () => {
      player.removeListener("player_state_changed", handleStateChange);
    };
  }, [player]);

  if (!track) return null;

  return <></>;
}
