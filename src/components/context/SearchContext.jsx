import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const useSearchTerm = () => useContext(SearchContext);

export default function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [categoriesSelected, setCategoriesSelected] = useState(false);
  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        selectedPlaylist,
        setSelectedPlaylist,
        categoriesSelected,
        setCategoriesSelected,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
