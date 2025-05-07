import { useNavigate } from "react-router-dom";
import TaskBar from "../../components/GuestNav";
import Footer from "../../components/Footer";
import "./index.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Reuse Navbar */}
      <TaskBar />

      {/* Hero Section */}
      <div className="home-hero">
        <img
          src="/campus_bg.png" // <-- ảnh nền
          alt="Campus background"
          className="home-hero-bg"
        />
        <div className="home-hero-text">
          <p>Welcome To</p>
          <h1>SMART CAMPUS SYSTEM</h1>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="home-intro">
        <div className="home-intro-left">
          <img
            src="/library.png" // <-- ảnh thư viện
            alt="Library"
            className="home-intro-image"
          />
        </div>
        <div className="home-intro-right">
          <h3>Find your way? Book room for meeting? Check schedules?</h3>
          <p>
            Use your school account to log in and enjoy all the convenient
            services of the Smart Campus System.
          </p>
          <button className="home-login-button" onClick={() => navigate("/redirect-login")}>
            Login Now
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}
