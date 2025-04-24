import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
	const [name, setName] = useState("");
	const [role, setRole] = useState("student");
	const [errorMsg, setErrorMsg] = useState("");
	const navigate = useNavigate();

	const handleUpdate = async () => {
		setErrorMsg("");
		const { data: userData } = await supabase.auth.getUser();

		if (!userData?.user) return setErrorMsg("User not found");

		const { error } = await supabase
			.from("users")
			.update({ name, role })
			.eq("id", userData.user.id);

		if (error) return setErrorMsg(error.message);

		navigate("/");
	};

	return (
		<div style={{ padding: 20 }}>
			<h2>Complete Your Profile</h2>
			<input placeholder="Name" onChange={(e) => setName(e.target.value)} />
			<br />
			<select value={role} onChange={(e) => setRole(e.target.value)}>
				<option value="lecturer">Lecturer</option>
				<option value="staff">Staff</option>
				<option value="guest">Guest</option>
				<option value="security">Security</option>
			</select>
			<br />
			<button onClick={handleUpdate}>Save</button>
			{errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
		</div>
	);
}
