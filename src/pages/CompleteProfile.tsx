import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function CompleteProfile() {
	const [name, setName] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const navigate = useNavigate();

	const handleUpdate = async () => {
		setErrorMsg("");
		const { data: userData } = await supabase.auth.getUser();

		if (!userData?.user) return setErrorMsg("User not found");

		const { error } = await supabase
			.from("users")
			.update({ name })
			.eq("id", userData.user.id);

		if (error) return setErrorMsg(error.message);

		navigate("/");
	};

	return (
		<div style={{ padding: 20 }}>
			<h2>Complete Your Profile</h2>
			<input placeholder="Name" onChange={(e) => setName(e.target.value)} />
			<br />

			<br />
			<button onClick={handleUpdate}>Save</button>
			{errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
		</div>
	);
}
