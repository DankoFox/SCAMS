import React from "react";

import styles from "../Nav.module.css";
import logoSrc from "../../../public/HCMUT.svg";

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

      <div className={styles.rightSection}>
        <a href="#home" className={styles.navItem}>
          <span style={homeButton}>Home</span>
        </a>
      </div>
    </nav>
  );
};
export default TaskBar;
