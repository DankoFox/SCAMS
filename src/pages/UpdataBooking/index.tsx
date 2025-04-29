import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";

// Reuse your existing types
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

type Booking = {
	id: string;
	lecturer_id: string;
	course_group_id: string;
	room_id: string;
	start_datetime: string;
	end_datetime: string;
};

export default function UpdateBookingPage() {
	const { bookingId } = useParams();
	const [rooms, setRooms] = useState<Room[]>([]);
	const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
	const [selectedRoom, setSelectedRoom] = useState<string>("");
	const [selectedGroup, setSelectedGroup] = useState<string>("");
	const [date, setDate] = useState<string>("");
	const [startTime, setStartTime] = useState<string>("");
	const [endTime, setEndTime] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [originalBooking, setOriginalBooking] = useState<Booking | null>(null);

	const navigate = useNavigate();

	useEffect(() => {
		fetchRooms();
		fetchCourseGroups();
		if (bookingId) {
			fetchBooking(bookingId);
		} else {
			setIsLoading(false);
		}
	}, [bookingId]);

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

	const fetchBooking = async (id: string) => {
		setIsLoading(true);
		const { data, error } = await supabase
			.from("bookings")
			.select("*")
			.eq("id", id)
			.single();

		if (!error && data) {
			setOriginalBooking(data);
			setSelectedRoom(data.room_id);
			setSelectedGroup(data.course_group_id);

			// Parse the datetime strings into date and time components
			const startDate = new Date(data.start_datetime);
			const endDate = new Date(data.end_datetime);

			setDate(startDate.toISOString().split("T")[0]);
			setStartTime(startDate.toTimeString().substring(0, 5));
			setEndTime(endDate.toTimeString().substring(0, 5));
		} else {
			console.error("Error fetching booking:", error);
			navigate("/bookings"); // Redirect if booking not found
		}
		setIsLoading(false);
	};

	const handleSubmit = async () => {
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

		// Check if the user is the owner of the booking (for updates)
		if (originalBooking && originalBooking.lecturer_id !== user.id) {
			alert("You can only update your own bookings.");
			return;
		}

		try {
			if (originalBooking) {
				// Update existing booking
				const { error } = await supabase
					.from("bookings")
					.update({
						course_group_id: selectedGroup,
						room_id: selectedRoom,
						start_datetime: start_datetime.toISOString(),
						end_datetime: end_datetime.toISOString(),
					})
					.eq("id", originalBooking.id);

				if (error) throw error;
				alert("Booking updated successfully!");
			} else {
				// Create new booking
				const { error } = await supabase.from("bookings").insert([
					{
						lecturer_id: user.id,
						course_group_id: selectedGroup,
						room_id: selectedRoom,
						start_datetime: start_datetime.toISOString(),
						end_datetime: end_datetime.toISOString(),
					},
				]);

				if (error) throw error;
				alert("Booking created successfully!");
			}
			navigate("/");
		} catch (error) {
			console.error(error);
			alert(`Failed to ${originalBooking ? "update" : "create"} booking.`);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<NavBar />
			<div style={{ padding: 20 }}>
				<h2>{originalBooking ? "Update Booking" : "Create a Booking"}</h2>

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

				<button onClick={handleSubmit}>
					{originalBooking ? "Update Booking" : "Submit Booking"}
				</button>
			</div>
		</div>
	);
}
