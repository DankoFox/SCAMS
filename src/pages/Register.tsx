// src/pages/Register.tsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("student");
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");
	const navigate = useNavigate();

	const handleRegister = async () => {
		setErrorMsg("");

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) return setErrorMsg(error.message);

		if (data?.user) {
			// Optional: You can redirect immediately or later update their profile
			setSuccessMsg(
				"Registration successful! Please check your email to confirm your account.",
			);
			navigate("/"); // Go to Home
		}
	};

	return (
		<div style={{ padding: 20 }}>
			<h2>Register</h2>
			<input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
			<br />
			<input
				type="password"
				placeholder="Password"
				onChange={(e) => setPassword(e.target.value)}
			/>
			<br />
			<select value={role} onChange={(e) => setRole(e.target.value)}>
				<option value="lecturer">Lecturer</option>
				<option value="staff">Staff</option>
				<option value="guest">Guest</option>
				<option value="security">Security</option>
			</select>
			<br />
			<button onClick={handleRegister}>Register</button>
			{errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
			{successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
			<p>
				Already have an account? <a href="/login">Login</a>
			</p>
		</div>
	);
}
