import React from "react";
import styles from "../Nav.module.css";
import logoSrc from "/HCMUT.svg";

const EmptyNav: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.leftSection}>
        <img src={logoSrc} alt="SCAMS Logo" className={styles.logo} />
        <span className={styles.appName}>SCAMS</span>
      </div>
      {}
    </nav>
  );
};

export default EmptyNav;
