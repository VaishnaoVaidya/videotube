import React from "react";
import { Link } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineVideoCall, MdOutlineTipsAndUpdates } from "react-icons/md";
import { LuSparkles } from "react-icons/lu";
import { RiSettings3Line } from "react-icons/ri";

const iconMap = {
  upload: <MdOutlineVideoCall size={18} />,
  optimize: <LuSparkles size={18} />,
  profile: <RiSettings3Line size={18} />,
  update: <MdOutlineTipsAndUpdates size={18} />,
  bell: <IoMdNotificationsOutline size={18} />,
};

const NotificationsPanel = ({ open, items, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="notifications-panel">
      <div className="notifications-panel__header">
        <div>
          <p className="notifications-panel__eyebrow">Updates</p>
          <h3 style={{ margin: 0 }}>Notifications & suggestions</h3>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close notifications">
          <IoMdNotificationsOutline size={18} />
        </button>
      </div>

      <div className="notifications-list">
        {items.map((item) => (
          <Link
            key={item.id}
            className={`notification-item ${item.unread ? "is-unread" : ""}`}
            to={item.to}
            onClick={onClose}
          >
            <div className="notification-item__icon">{iconMap[item.icon] || iconMap.bell}</div>
            <div className="notification-item__content">
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <span>{item.cta}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;
