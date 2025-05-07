import React from "react";
import { Link } from "react-router-dom";

import styles from "../Nav.module.css";
import logoSrc from "/HCMUT.svg";

const homeButton: React.CSSProperties = {
  paddingRight: "30px",
};
const TaskBar: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.leftSection}>
        <img src={logoSrc} alt="SCAMS Logo" className={styles.logo} />
        <span className={styles.appName}>SCAMS</span>
      </div>

      <Link to="/redirect-login" className={styles.navItem}>
        <span style={homeButton}>Login</span>
      </Link>
    </nav>
  );
};
export default TaskBar;
