import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";

type Building = {
	id: string;
	name: string;
	code: string;
};

type Room = {
	id: string;
	name: string;
	floor: number | null;
	capacity: number;
	type: string | null;
};

type CourseGroup = {
	id: string;
	group_code: string;
};

type Course = {
	id: string;
	course_code: string;
	course_name: string;
	groups: CourseGroup[];
};

export default function Home() {
	const [name, setName] = useState<string | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const [buildings, setBuildings] = useState<Building[]>([]);
	const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
	const [roomsByBuilding, setRoomsByBuilding] = useState<{
		[key: string]: Room[];
	}>({});
	const [courses, setCourses] = useState<Course[]>([]);

	const navigate = useNavigate();

	useEffect(() => {
		const getSessionAndUser = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
				navigate("/login");
				return;
			}

			const { user } = session;
			const { data, error } = await supabase
				.from("users")
				.select("name, role")
				.eq("id", user.id)
				.single();

			if (error || !data) {
				navigate("/login");
			} else if (!data.name) {
				navigate("/complete-profile");
			} else {
				setName(data.name);
				setRole(data.role);

				if (data.role === "lecturer") {
					fetchLecturerCourses(user.id);
				}
			}
		};

		getSessionAndUser();
		fetchBuildings();
	}, []);

	const fetchBuildings = async () => {
		const { data, error } = await supabase
			.from("buildings")
			.select("id, name, code")
			.order("code");

		if (!error && data) {
			setBuildings(data);
		}
	};

	const fetchLecturerCourses = async (lecturerId: string) => {
		const { data, error } = await supabase
			.from("course_lecturers")
			.select(`
				id,
				group_id,
				course_groups (
					id,
					group_code,
					course_id,
					courses (
						id,
						course_code,
						course_name
					)
				)
			`)
			.eq("lecturer_id", lecturerId);

		if (!error && data) {
			// Process the data to organize courses with their groups
			const coursesMap = new Map<string, Course>();

			data.forEach((item: any) => {
				const courseId = item.course_groups.courses.id;
				const groupInfo = {
					id: item.course_groups.id,
					group_code: item.course_groups.group_code,
				};

				if (coursesMap.has(courseId)) {
					// Add group to existing course
					const course = coursesMap.get(courseId)!;
					course.groups.push(groupInfo);
				} else {
					// Create new course with this group
					coursesMap.set(courseId, {
						id: courseId,
						course_code: item.course_groups.courses.course_code,
						course_name: item.course_groups.courses.course_name,
						groups: [groupInfo],
					});
				}
			});

			setCourses(Array.from(coursesMap.values()));
		}
	};

	const toggleExpand = async (buildingId: string) => {
		setExpanded((prev) => ({ ...prev, [buildingId]: !prev[buildingId] }));

		// Load rooms if not already loaded
		if (!roomsByBuilding[buildingId]) {
			const { data, error } = await supabase
				.from("rooms")
				.select("*")
				.eq("building_id", buildingId)
				.order("floor");

			if (!error && data) {
				setRoomsByBuilding((prev) => ({ ...prev, [buildingId]: data }));
			}
		}
	};

	const goToRoomSchedule = (roomId: string) => {
		navigate(`/room/${roomId}`);
	};

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
				{role === "lecturer" && (
					<div style={{ marginTop: 20 }}>
						<h2>Courses you are teaching</h2>
						{courses.length > 0 ? (
							<div>
								{courses.map((course) => (
									<div key={course.id} style={{ marginBottom: 15 }}>
										<h3>
											<strong>{course.course_code}</strong>:{" "}
											{course.course_name}
										</h3>
										<div style={{ marginLeft: 20 }}>
											<h4>Groups:</h4>
											<ul>
												{course.groups.map((group) => (
													<li key={group.id}>Group {group.group_code}</li>
												))}
											</ul>
										</div>
									</div>
								))}
							</div>
						) : (
							<p>No courses assigned yet.</p>
						)}
					</div>
				)}

				{/* Building list */}
				<h2 style={{ marginTop: 30 }}>Buildings & Rooms</h2>
				{buildings.map((building) => (
					<div key={building.id} style={{ marginBottom: 10 }}>
						<div
							onClick={() => toggleExpand(building.id)}
							style={{
								cursor: "pointer",
								backgroundColor: "#eee",
								padding: "10px",
								borderRadius: "8px",
							}}
						>
							<strong>{building.code}</strong>: {building.name}
						</div>
						{expanded[building.id] && roomsByBuilding[building.id] && (
							<div style={{ marginLeft: 20, marginTop: 5 }}>
								{roomsByBuilding[building.id].map((room) => (
									<div
										key={room.id}
										onClick={() => goToRoomSchedule(room.id)}
										style={{
											padding: "6px 12px",
											cursor: "pointer",
											backgroundColor: "#f9f9f9",
											borderBottom: "1px solid #ddd",
										}}
									>
										{room.name} (Floor: {room.floor ?? "N/A"}, Capacity:{" "}
										{room.capacity}, Type: {room.type || "N/A"})
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
