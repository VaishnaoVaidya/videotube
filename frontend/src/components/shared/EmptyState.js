import React from "react";

const EmptyState = ({ title, description }) => {
  return (
    <div className="empty-state">
      <div className="empty-state__glow" />
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
};

export default EmptyState;
