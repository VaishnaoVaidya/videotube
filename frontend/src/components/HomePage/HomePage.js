import React from "react";
import PageIntro from "../shared/PageIntro";
import EmptyState from "../shared/EmptyState";

const HomePage = () => {
  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Channel home"
        title="Featured channel content"
        description="This slot is now visually aligned with the rest of the app and ready for featured uploads or announcements."
      />
      <EmptyState
        title="Channel highlights will appear here"
        description="Use this space for featured uploads, channel messaging, or pinned content."
      />
    </div>
  );
};

export default HomePage;
