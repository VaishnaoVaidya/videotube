import React from "react";
import PageIntro from "../shared/PageIntro";
import EmptyState from "../shared/EmptyState";

const Playlists = () => {
  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Playlists"
        title="Playlist space with room to grow"
        description="The shared UI now supports playlist sections, headers, and richer browsing states."
      />
      <EmptyState
        title="No playlists to show yet"
        description="Once playlists are created, they can live here with the same polished media layout."
      />
    </div>
  );
};

export default Playlists;
