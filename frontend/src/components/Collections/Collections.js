import React from "react";
import PageIntro from "../shared/PageIntro";
import EmptyState from "../shared/EmptyState";

const Collections = () => {
  return (
    <div className="page-shell">
      <PageIntro
        eyebrow="Collections"
        title="Organize videos into themed spaces"
        description="This area is ready for curated sets, moodboards, and saved creator collections."
      />
      <EmptyState
        title="Collections are coming together"
        description="The new UI is ready for collection cards and saved groupings as this feature grows."
      />
    </div>
  );
};

export default Collections;
