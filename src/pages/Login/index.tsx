// src/pages/Login.tsx
import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

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
    <div>
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleLogin}>Login</button>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        <p>Don't have an account? Please contact OISP Office</p>
      </div>
      <Footer />
    </div>
  );
}
