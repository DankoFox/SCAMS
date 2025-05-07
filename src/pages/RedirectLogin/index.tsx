import { useNavigate } from "react-router-dom";
import EmptyNav from "../../components/EmptyNav";
import Footer from "../../components/Footer";
import "./index.css"; // CSS riêng cho trang này

export default function RedirectLogin() {
  const navigate = useNavigate();

  return (
    <>
      <EmptyNav />
      <div className="redirect-container">
        <img src="/HCMUT.svg" alt="BK Logo" className="redirect-logo" />

        <hr className="redirect-divider" />

        <div className="redirect-buttons">
          <button
            className="redirect-btn"
            onClick={() => navigate("/login?mode=student")}
          >
            Students of BackKhoa
          </button>
          <button
            className="redirect-btn"
            onClick={() => navigate("/login?mode=lecturer")}
            style={{marginTop: "20px"}}
          >
            Lecturers of BackKhoa
          </button>
        </div>

        <hr className="redirect-divider" />
      </div>
      <Footer />
    </>
  );
}
