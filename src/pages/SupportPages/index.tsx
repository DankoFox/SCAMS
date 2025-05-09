// đây là trang hỗ trợ người dùng
import React from "react";
import styles from "./index.module.css";
import Img from "../../../public/support.svg";

const StudentSupport: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <img src={Img} alt="" />
        </div>
        <div className={styles.textContent}>
          <h1>
            Want to know more information?
            <br />
            <strong>Have issue logging in?</strong>
          </h1>
          <p>
            Send an email showing your request or issues to (including forgotten
            passwords) to <br />
            <a href="mailto:support@hcmut.edu.vn">support@hcmut.edu.vn</a> .
            Admin will respond within a day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentSupport;
