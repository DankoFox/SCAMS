import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
import EmptyNav from "../../components/EmptyNav";
import "./index.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode") || "student";
  const isLecturer = mode === "lecturer";

  const handleLogin = async () => {
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return setErrorMsg(error.message);

    const { data: profile } = await supabase
      .from("users")
      .select("name")
      .eq("id", data.user.id)
      .single();

    if (!profile?.name) {
      navigate("/complete-profile");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <EmptyNav />
      <div className="login-container">
        {/* LEFT SIDE */}
        <div className="login-left">
          <div className="login-left-header">
            <h1>Central Authentication Service</h1>
          </div>
          <div className="login-left-content">
            <div className="login-left-text">
              <h2>{isLecturer ? "Lecturers – SCAMS" : "Students – SCAMS"}</h2>
              <p>
                You need to use HCMUT account to login. Your HCMUT account allows you to
                access many school systems including information center, email, ...
              </p>
              <p>
                To protect account, you should sign out and turn off browser completely
                after you finish your work which needs authentication service.
              </p>
            </div>
            <div className="login-left-image">
              <img
                src={isLecturer ? "/lecturer_login.png" : "/student_login.png"}
                alt={isLecturer ? "Lecturer login" : "Student login"}
                className="login-image"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-right">
          <h3>Enter Username and Password</h3>
          <div className="login-divider" />
          <input
            className="login-input"
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMsg && <p className="error-text">{errorMsg}</p>}
          <p className="forgot-text">
            <a href="#">Cannot log in?</a>
          </p>
          <button className="login-button" onClick={handleLogin}>
            Log in
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
