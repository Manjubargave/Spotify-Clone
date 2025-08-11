export const getSortedPlaylist=(data)=>{
     const frequencyMap = {};

  data.forEach((item) => {
    const contextUri = item.context?.uri;
    if (contextUri && contextUri.startsWith("spotify:playlist:")) {
      const id = contextUri.split(":")[2];
      frequencyMap[id] = (frequencyMap[id] || 0) + 1;
    }
  });

  const sortedIds = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

    return sortedIds

}
export  function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}