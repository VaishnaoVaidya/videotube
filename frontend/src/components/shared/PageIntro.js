import React from "react";

const PageIntro = ({ eyebrow, title, description, action }) => {
  return (
    <section className="page-intro">
      <div>
        {eyebrow ? <p className="page-intro__eyebrow">{eyebrow}</p> : null}
        <h1 className="page-intro__title">{title}</h1>
        {description ? <p className="page-intro__description">{description}</p> : null}
      </div>
      {action ? <div className="page-intro__action">{action}</div> : null}
    </section>
  );
};

export default PageIntro;
