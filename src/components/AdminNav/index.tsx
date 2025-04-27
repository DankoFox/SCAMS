import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./AdminNav.module.css"; 

const TaskBar: React.FC = () => {
  const logoUrl = "https://sso.hcmut.edu.vn/cas/images/bk_logo.png";

  const handleExit = () => {
    console.log("Exit clicked - Implement logout logic");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.leftSection}>
        <img src={logoUrl} alt="SCAMS Logo" className={styles.logo} />
        <span className={styles.appName}>SCAMS</span>
      </div>

      <div className={styles.rightSection}>
        <a
          href="#home" 
          className={styles.navItem}
        >
          <span>Home</span>
        </a>

        <span className={styles.separator}>|</span>

        <a
          href="#campus-dashboard" 
          className={styles.navItem}
        >
          <span>Campus Dashboard</span>
        </a>

        <span className={styles.separator}>|</span>

        <button
          onClick={handleExit}
          className={styles.navButton} 
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Exit</span>
        </button>

        {}
        <span className={styles.notificationIcon}>
          <FontAwesomeIcon icon={faBell} size="lg" />
        </span>
      </div>
    </nav>
  );
};

export default TaskBar;
