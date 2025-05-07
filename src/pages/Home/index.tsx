import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import BuildingList from "../../components/BuildingList";
import LecturerCourses from "../../components/LecturerCourses";
import LecturerBookings from "../../components/LecturerBookings";

export default function Home() {
	const [name, setName] = useState<string | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const [userId, setUserId] = useState<string | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		const getSessionAndUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				navigate("/redirect-login");
				return;
			}

			const { user } = session;
			const { data, error } = await supabase
				.from("users")
				.select("name, role")
				.eq("id", user.id)
				.single();

			if (error || !data) {
				navigate("/landing-page");
			} else if (!data.name) {
				navigate("/complete-profile");
			} else {
				setName(data.name);
				setRole(data.role);
				setUserId(user.id);
			}
		};

		getSessionAndUser();
	}, []);

	return (
		<div>
			<NavBar />

			<div style={{ padding: 20 }}>
				<h1>Welcome, {name || "Loading..."}</h1>
				{role && (
					<p>
						<strong>Role:</strong>{" "}
						{role.charAt(0).toUpperCase() + role.slice(1)}
					</p>
				)}

				{/* If user is lecturer, show courses with groups */}
				{role === "lecturer" && userId && (
					<>
						<LecturerCourses lecturerId={userId} />

						<LecturerBookings lecturerId={userId} />
					</>
				)}

				{/* Building list component */}
				<div style={{ marginTop: 30 }}>
					<BuildingList />
				</div>
			</div>
		</div>
	);
}
