import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "../Nav.module.css";
import logoSrc from "../../../public/HCMUT.svg";

const TaskBar: React.FC = () => {
  const handleExit = () => {
    console.log("Exit clicked - Implement logout logic");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.leftSection}>
        <img src={logoSrc} alt="SCAMS Logo" className={styles.logo} />
        <span className={styles.appName}>SCAMS</span>
      </div>

      <div className={styles.rightSection}>
        <a href="#home" className={styles.navItem}>
          <span>Home</span>
        </a>

        <span className={styles.separator}>|</span>

        <a href="#campus-dashboard" className={styles.navItem}>
          <span>Campus Dashboard</span>
        </a>

        <span className={styles.separator}>|</span>

        <button onClick={handleExit} className={styles.navButton}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Exit</span>
        </button>

        {}
        <span className={styles.notificationIcon}>
          <FontAwesomeIcon icon={faBell} size="2xl" />
        </span>
      </div>
    </nav>
  );
};

export default TaskBar;
