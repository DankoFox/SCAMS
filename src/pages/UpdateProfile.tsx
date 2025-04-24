import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfile = async () => {
			setErrorMsg("");
			const { data: userData } = await supabase.auth.getUser();

			if (!userData?.user) {
				setErrorMsg("User not found");
				setLoading(false);
				return;
			}

			const { data, error } = await supabase
				.from("users")
				.select("name, role")
				.eq("id", userData.user.id)
				.single();

			if (error) {
				setErrorMsg("Failed to load user data");
			} else {
				setName(data.name || "");
				setRole(data.role || "student");
			}

			setLoading(false);
		};

		fetchProfile();
	}, []);

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

	if (loading) return <p>Loading...</p>;

	return (
		<div style={{ padding: 20 }}>
			<h2>Update Your Profile</h2>
			<input
				placeholder="Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<br />
			<select value={role} onChange={(e) => setRole(e.target.value)}>
				<option value="lecturer">Lecturer</option>
				<option value="staff">Staff</option>
				<option value="guest">Guest</option>
				<option value="security">Security</option>
			</select>
			<br />
			<button onClick={handleUpdate}>Save Changes</button>
			{errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
		</div>
	);
}
