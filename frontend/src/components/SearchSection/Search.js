import React, { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const searchRef = useRef(null);
  const recognitionRef = useRef(null);

  const suggestions = [
    "React tutorials",
    "Music mixes",
    "Gaming highlights",
    "Daily coding vlogs",
    "Design inspiration",
    "Podcast clips",
    "Travel edits",
    "Channel analytics",
  ];

  const filteredSuggestions = suggestions.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const nextQuery = new URLSearchParams(location.search).get("q") || "";

    if (location.pathname === "/search") {
      setSearchTerm(nextQuery);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceError("");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();

      setSearchTerm(transcript);
      setIsDropdownOpen(Boolean(transcript));
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setVoiceError("Microphone access was blocked. Allow mic permission and try again.");
      } else {
        setVoiceError("Voice search is unavailable right now.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  const handleSearchSubmit = () => {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      return;
    }

    setIsDropdownOpen(false);
    navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setIsDropdownOpen(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition || !recognitionRef.current) {
      setVoiceError("Voice search is not supported in this browser.");
      return;
    }

    setVoiceError("");

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    recognitionRef.current.start();
  };

  return (
    <div className="search-shell" ref={searchRef}>
      <div className="search-box">
        <div className="search-field">
          <IoIosSearch size={20} color="#94a3b8" />
          <input
            id="search"
            autoComplete="off"
            type="text"
            placeholder="Search creators, clips, playlists"
            aria-label="Search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSearchSubmit();
              }
            }}
          />
        </div>

        <button className="search-submit" type="button" onClick={handleSearchSubmit}>
          <IoIosSearch size={22} />
          Search
        </button>

        <button
          className={`search-voice ${isListening ? "is-listening" : ""}`}
          type="button"
          aria-label="Voice search"
          onClick={handleVoiceSearch}
          title={isListening ? "Stop voice search" : "Start voice search"}
        >
          <MdKeyboardVoice size={20} />
        </button>
      </div>

      {voiceError ? <p className="search-status">{voiceError}</p> : null}
      {isListening ? <p className="search-status">Listening... speak now.</p> : null}

      {isDropdownOpen && searchTerm && (
        <div className="search-dropdown">
          {filteredSuggestions.length ? (
            filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <IoIosSearch size={18} color="#94a3b8" />
                {suggestion}
              </button>
            ))
          ) : (
            <button type="button" onClick={handleSearchSubmit}>
              <IoIosSearch size={18} color="#94a3b8" />
              Search for "{searchTerm}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
