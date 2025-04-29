import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";

// Define types to match the actual data structure from Supabase
type Room = {
	id: string;
	name: string;
	floor: number | null;
	building: {
		id: string;
		name: string;
	};
};

type CourseGroup = {
	id: string;
	group_code: string;
	course: {
		id: string;
		course_name: string;
	};
};

// Type for raw data returned from Supabase
interface RoomData {
	id: string;
	name: string;
	floor: number | null;
	building: {
		id: string;
		name: string;
	};
}

interface CourseGroupData {
	group_id: string;
	course_groups: {
		id: string;
		group_code: string;
		course: {
			id: string;
			course_name: string;
		};
	};
}

export default function BookingPage() {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
	const [selectedRoom, setSelectedRoom] = useState<string>("");
	const [selectedGroup, setSelectedGroup] = useState<string>("");
	const [date, setDate] = useState<string>("");
	const [startTime, setStartTime] = useState<string>("");
	const [endTime, setEndTime] = useState<string>("");

	const navigate = useNavigate();

	useEffect(() => {
		fetchRooms();
		fetchCourseGroups();
	}, []);

	const fetchRooms = async () => {
		const { data, error } = await supabase.from("rooms").select(`
        id,
        name,
        floor,
        building:building_id (
          id,
          name
        )
      `);

		if (!error && data) {
			// Use type assertion to override TypeScript's inference
			const roomData: Room[] = (data as any).map((room: any) => ({
				id: room.id,
				name: room.name,
				floor: room.floor,
				building: room.building && {
					id: room.building.id,
					name: room.building.name,
				},
			}));

			setRooms(roomData);
		} else {
			console.error("Error fetching rooms:", error);
		}
	};

	const fetchCourseGroups = async () => {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			navigate("/login");
			return;
		}

		const { user } = session;

		const { data, error } = await supabase
			.from("course_lecturers")
			.select(`
        group_id,
        course_groups:group_id (
          id, 
          group_code, 
          course:course_id (
            id, 
            course_name
          )
        )
      `)
			.eq("lecturer_id", user.id);

		if (!error && data) {
			// Use type assertion to override TypeScript's inference
			const groups: CourseGroup[] = (data as any).map((item: any) => ({
				id: item.course_groups.id,
				group_code: item.course_groups.group_code,
				course: item.course_groups.course && {
					id: item.course_groups.course.id,
					course_name: item.course_groups.course.course_name,
				},
			}));

			setCourseGroups(groups);
		} else {
			console.error("Error fetching course groups:", error);
		}
	};

	const handleBooking = async () => {
		if (!selectedRoom || !selectedGroup || !date || !startTime || !endTime) {
			alert("Please fill in all fields.");
			return;
		}

		const start_datetime = new Date(`${date}T${startTime}:00`);
		const end_datetime = new Date(`${date}T${endTime}:00`);

		if (start_datetime >= end_datetime) {
			alert("Start time must be before end time.");
			return;
		}

		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (!session) {
			navigate("/login");
			return;
		}

		const { user } = session;

		const { error } = await supabase.from("bookings").insert([
			{
				lecturer_id: user.id,
				course_group_id: selectedGroup,
				room_id: selectedRoom,
				start_datetime: start_datetime.toISOString(),
				end_datetime: end_datetime.toISOString(),
			},
		]);

		if (error) {
			console.error(error);
			alert("Failed to create booking.");
		} else {
			alert("Booking created successfully!");
			navigate("/");
		}
	};

	return (
		<div>
			<NavBar />
			<div style={{ padding: 20 }}>
				<h2>Create a Booking</h2>

				<div style={{ marginBottom: 15 }}>
					<label>Room:</label>
					<br />
					<select
						value={selectedRoom}
						onChange={(e) => setSelectedRoom(e.target.value)}
					>
						<option value="">Select a room</option>
						{rooms.map((room) => (
							<option key={room.id} value={room.id}>
								{room.name} (Floor {room.floor ?? "N/A"}, {room.building.name})
							</option>
						))}
					</select>
				</div>

				<div style={{ marginBottom: 15 }}>
					<label>Course Group:</label>
					<br />
					<select
						value={selectedGroup}
						onChange={(e) => setSelectedGroup(e.target.value)}
					>
						<option value="">Select a course group</option>
						{courseGroups.map((group) => (
							<option key={group.id} value={group.id}>
								{group.course.course_name} - Group {group.group_code}
							</option>
						))}
					</select>
				</div>

				<div style={{ marginBottom: 15 }}>
					<label>Date:</label>
					<br />
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
					/>
				</div>

				<div style={{ marginBottom: 15 }}>
					<label>Start Time:</label>
					<br />
					<input
						type="time"
						value={startTime}
						onChange={(e) => setStartTime(e.target.value)}
					/>
				</div>

				<div style={{ marginBottom: 15 }}>
					<label>End Time:</label>
					<br />
					<input
						type="time"
						value={endTime}
						onChange={(e) => setEndTime(e.target.value)}
					/>
				</div>

				<button onClick={handleBooking}>Submit Booking</button>
			</div>
		</div>
	);
}
