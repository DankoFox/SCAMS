// src/components/NavBar.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
	const [name, setName] = useState<string | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const getUserInfo = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session) return;
			const { user } = session;
			const { data, error } = await supabase
				.from("users")
				.select("name, role")
				.eq("id", user.id)
				.single();
			if (!error && data) {
				setName(data.name);
				setRole(data.role);
			}
		};
		getUserInfo();
	}, []);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		navigate("/login");
	};

	const handleEdit = () => {
		navigate("/update-profile");
	};

	const handleCreateBooking = () => {
		navigate("/booking");
	};

	return (
		<nav
			style={{
				padding: "10px 20px",
				backgroundColor: "#f0f0f0",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<h3 style={{ margin: 0 }}>SCAMS</h3>
			<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
				<span>{name ? `Hello, ${name}` : "Loading..."}</span>
				{role === "lecturer" && (
					<button onClick={handleCreateBooking} style={{ padding: "6px 12px" }}>
						Create Booking
					</button>
				)}
				<button onClick={handleEdit} style={{ padding: "6px 12px" }}>
					Edit Profile
				</button>
				<button onClick={handleLogout} style={{ padding: "6px 12px" }}>
					Logout
				</button>
			</div>
		</nav>
	);
}
