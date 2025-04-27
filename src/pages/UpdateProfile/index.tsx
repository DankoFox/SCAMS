import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
	const [name, setName] = useState("");
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
				.select("name")
				.eq("id", userData.user.id)
				.single();

			if (error) {
				setErrorMsg("Failed to load user data");
			} else {
				setName(data.name || "");
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
			.update({ name })
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

			<br />
			<button onClick={handleUpdate}>Save Changes</button>
			{errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
		</div>
	);
}
