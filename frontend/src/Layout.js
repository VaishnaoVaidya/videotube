import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import UserContext from "./context/UserContext";

function Layout() {
  const { sidebar } = useContext(UserContext);
  const location = useLocation();
  const hasTopicBar =
    location.pathname !== "/signin" &&
    location.pathname !== "/signup" &&
    location.pathname !== "/dashboard" &&
    location.pathname !== "/search" &&
    location.pathname !== "/channel/upload" &&
    !location.pathname.startsWith("/settings");

  return (
    <div className="app-shell">
      <Header />
      <main
        className={`app-shell__content ${hasTopicBar ? "has-topic-bar" : "no-topic-bar"} ${
          sidebar ? "is-sidebar-open" : "is-sidebar-closed"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
