import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const TaskBar: React.FC = () => {
  const logoUrl = "https://sso.hcmut.edu.vn/cas/images/bk_logo.png";

  const handleExit = () => {
    console.log("Exit clicked");
  };

  const navStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 25px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #dee2e6",
    fontFamily: "Arial, sans-serif",
    color: "#343a40",
  };

  const leftSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const logoStyle: React.CSSProperties = {
    width: "30px",
    height: "30px",
    display: "block",
  };

  const appNameStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: "1.1rem",
  };

  const rightSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const navItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
  };

  const navButtonStyle: React.CSSProperties = {
    ...navItemStyle, // Inherit base styles
    background: "none",
    border: "none",
    fontFamily: "inherit",
    fontSize: "inherit",
  };

  const separatorStyle: React.CSSProperties = {
    color: "#adb5bd",
    margin: "0 5px",
    cursor: "default",
  };

  // Hover effect )
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = "#e9ecef";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = "transparent";
  };

  return (
    <nav style={navStyle}>
      {}
      <div style={leftSectionStyle}>
        <img src={logoUrl} alt="SCAMS Logo" style={logoStyle} />
        <span style={appNameStyle}>SCAMS</span>
      </div>

      {}
      <div style={rightSectionStyle}>
        {}
        <a
          href="#home"
          style={navItemStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span>Home</span>
        </a>

        <span style={separatorStyle}>|</span>

        {}
        <a
          href="#campus-dashboard"
          style={navItemStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span>Campus Dashboard</span>
        </a>

        <span style={separatorStyle}>|</span>

        {}
        <button
          onClick={handleExit}
          style={{ ...navButtonStyle, marginRight: "10px" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {}
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Exit</span>
        </button>
        <FontAwesomeIcon icon={faBell} size="lg" />
      </div>
    </nav>
  );
};

export default TaskBar;
