//Đây là trang điều hướng cho người dùng chưa đăng nhập
import React from "react";
import Img from "../../../public/HCMUT.svg";
import styles from "./NavBeforeLogin.module.css"; // Import the CSS module

const NavBeforeLogin: React.FC = () => {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.logoContainer}>
            <img src={Img} alt="Logo" className={styles.logo} />
          </div>
          <hr className={`${styles.hr} ${styles.hrTop}`} />
          {}
          <div>
            <button className={styles.button} type="button">
              Students of BackKhoa
            </button>
            <button
              className={`${styles.button} ${styles.secondButton}`}
              type="button"
            >
              Lecturers of Backkhoa
            </button>
          </div>
          <hr className={`${styles.hr} ${styles.hrBottom}`} />
        </div>
      </div>
    </div>
  );
};

export default NavBeforeLogin;
