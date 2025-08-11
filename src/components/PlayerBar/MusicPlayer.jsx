// components/PlayerBar.jsx
import { useEffect, useState } from "react";
import "./PlayerBar.css";

export default function MusicPlayer({ track, player, isPaused, onPause }) {
  console.log("Inside music player", track);
  useEffect(() => {
    console.log("Player", player);
    if (player) {
      const handleStateChange = (state) => {
        console.log("Inside handleStateChange", state);

        if (!state) return;
        onPause(state.paused);
      };

      player.addListener("player_state_changed", handleStateChange);

      return () => {
        player.removeListener("player_state_changed", handleStateChange);
      };
    }
  }, [player]);

  return (
    <div className="player-bar">
      <div className="track-info">
        <img
          src={track ? track.album.images[0].url : "/default.jpeg"}
          alt={track ? track.name : "image"}
        />
        <div className="text-info">
          <div className="track-name">{track && track.name}</div>
          <div className="artist-name">
            {track
              ? track.artists.map((a) => a.name).join(", ")
              : "No songs playing"}
          </div>
        </div>
      </div>

      {track && (
        <div className="controls">
          {isPaused ? (
            <button
              onClick={() => {
                onPause(false);
                player?.resume();
              }}
            >
              <i className="bi bi-play-fill"></i>
            </button>
          ) : (
            <button
              onClick={() => {
                onPause(true);
                player?.pause();
              }}
            >
              <i className="bi bi-pause-fill"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
