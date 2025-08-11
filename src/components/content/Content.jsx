import Sidebar from "./sidebar";
import Maincontent from "./Maincontent";
import { useSearchTerm } from "../context/SearchContext";
import SearchResults from "../header/SearchResults";
import MusicPlayer from "../PlayerBar/MusicPlayer";
import { useSpotifyPlayer } from "../context/SpotifyPlayerContext";
import { useState } from "react";
import CreatePlaylist from "./CreatePlaylist";
import BrowseSection from "./BrowseSection";

export default function Content({ playlist, setPlaylist }) {
  const {
    searchTerm,
    selectedPlaylist,
    setSelectedPlaylist,
    categoriesSelected,
    setCategoriesSelected,
  } = useSearchTerm();
  const { player, trackInfo, isPaused, setIsPaused } = useSpotifyPlayer();

  console.log("Player TrackInfo isPaused", player, trackInfo, isPaused);
  console.log("Categories", categoriesSelected);
  return (
    <div className="d-flex content vh-100" style={{ backgroundColor: "black" }}>
      <div className="w-25 m-3 sidebar" style={{ overflowY: "auto" }}>
        <Sidebar
          playlist={playlist}
          setPlaylist={setPlaylist}
          setSelectedPlaylist={setSelectedPlaylist}
          setCategoriesSelected={setCategoriesSelected}
        />
      </div>
      <div
        className="w-75 mt-3 mb-3 main flex-grow-1"
        style={{ overflowY: "auto" }}
      >
        {/* {selectedPlaylist ? (
          <CreatePlaylist selectedPlaylist={selectedPlaylist} />
        ) : searchTerm ? (
          <SearchResults />
        ) : (
          <Maincontent />
        )} */}
        {searchTerm ? (
          <SearchResults />
        ) : selectedPlaylist ? (
          <CreatePlaylist
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={setSelectedPlaylist}
            setPlaylist={setPlaylist}
            playlist={playlist}
          />
        ) : categoriesSelected ? (
          <BrowseSection setSelectedPlaylist={setSelectedPlaylist} />
        ) : (
          <Maincontent />
        )}
      </div>

      <MusicPlayer
        track={trackInfo && trackInfo}
        player={player && player}
        isPaused={isPaused}
        onPause={setIsPaused}
      />
    </div>
  );
}
