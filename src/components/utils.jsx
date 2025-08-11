import { useSpotifyPlayer } from "./context/SpotifyPlayerContext";
import { useToken } from "./context/TokenProvider";

export async function fetchSpotifyToken() {
  const clientId = "41d360a9353342ccb2e05ef6d3c37ff9";
  const clientSecret = "b4a392cea8144a26b475bd5a6202669f";

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const data = await response.json();
  return data.access_token;
}
export async function playTrack(urisOrUri, token, deviceId) {
  try {
    // Step 1: Transfer playback to your Web Player
    await fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
    });

    let body = {};

    if (Array.isArray(urisOrUri)) {
      body = { uris: urisOrUri }; // multiple tracks
    } else if (typeof urisOrUri === "string") {
      body = { uris: [urisOrUri] }; // single track as array
    } else {
      console.error("Invalid URI(s) passed to playTrack");
      return;
    }

    const response = await fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Play error:", errorData);
    }

    // Step 2: Play the track on that device
    // const res = await fetch(
    //   `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
    //   {
    //     method: "PUT",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       uris: [trackUri],
    //     }),
    //   }
    // );

    // if (res.status === 204) {
    //   console.log("✅ Track is playing");
    // } else {
    //   const error = await res.json();
    //   console.error("❌ Play error:", error);
    // }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}
