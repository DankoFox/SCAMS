import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import style from "./UserNav.module.css"

const TaskBar: React.FC = () => {
  const logoUrl = "https://sso.hcmut.edu.vn/cas/images/bk_logo.png";

  const handleExit = () => {
    console.log("Exit clicked");
  };

  

  return (
    <nav className={style.nav}>
      {}
      <div className={style.leftSectionStyle}>
        <img src={logoUrl} alt="SCAMS Logo" className={style.logoStyle} />
        <span className={style.appNameStyle}>SCAMS</span>
      </div>

      {}
      <div className={style.rightSectionStyle}>
        {}
        <a href="#home" className={style.navItemStyle}>
          <span>Home</span>
        </a>

        <span className={style.separatorStyle}>|</span>

        {}
        <a href="#room-system" className={style.navItemStyle}>
          <span>Room system</span>
        </a>

        <span className={style.separatorStyle}>|</span>

        {}
        <a href="#my-account" className={style.navItemStyle}>
          <span>My account</span>
        </a>

        <span className={style.separatorStyle}>|</span>

        {}
        <a href="#contact" className={style.navItemStyle}>
          <span>Contact</span>
        </a>

        <span className={style.separatorStyle}>|</span>

        {}
        <button onClick={handleExit} className={style.navButton}>
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
