import React from "react";
import styles from "./EmptyNav.module.css";

const EmptyNav: React.FC = () => {
  const logoUrl = "https://sso.hcmut.edu.vn/cas/images/bk_logo.png";

  return (
    <nav className={styles.nav}>
      <div className={styles.leftSection}>
        <img src={logoUrl} alt="SCAMS Logo" className={styles.logo} />
        <span className={styles.appName}>SCAMS</span>
      </div>
      {}
    </nav>
  );
};

export default EmptyNav;
