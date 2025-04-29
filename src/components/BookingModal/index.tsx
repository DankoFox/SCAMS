import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./index.css";

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

type BookingModalProps = {
	isOpen: boolean;
	onClose: () => void;
	bookingId: string | null;
	onUpdateSuccess: () => void;
};

export default function BookingModal({
	isOpen,
	onClose,
	bookingId,
	onUpdateSuccess,
}: BookingModalProps) {
	const [rooms, setRooms] = useState<Room[]>([]);
	const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);
	const [selectedRoom, setSelectedRoom] = useState<string>("");
	const [selectedGroup, setSelectedGroup] = useState<string>("");
	const [date, setDate] = useState<string>("");
	const [startTime, setStartTime] = useState<string>("");
	const [endTime, setEndTime] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [lecturerId, setLecturerId] = useState<string>("");

	// Reset form when modal closes
	useEffect(() => {
		if (!isOpen) {
			setSelectedRoom("");
			setSelectedGroup("");
			setDate("");
			setStartTime("");
			setEndTime("");
		}
	}, [isOpen]);

	// Load data when modal opens with a booking ID
	useEffect(() => {
		if (isOpen) {
			fetchRooms();
			fetchCourseGroups();

			if (bookingId) {
				fetchBooking(bookingId);
			} else {
				setIsLoading(false);
			}
		}
	}, [isOpen, bookingId]);

	// Get current user session
	useEffect(() => {
		const getUserSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (session?.user) {
				setLecturerId(session.user.id);
			}
		};

		getUserSession();
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
			onClose();
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
			onClose();
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

		try {
			if (bookingId) {
				// Update existing booking
				const { error } = await supabase
					.from("bookings")
					.update({
						course_group_id: selectedGroup,
						room_id: selectedRoom,
						start_datetime: start_datetime.toISOString(),
						end_datetime: end_datetime.toISOString(),
					})
					.eq("id", bookingId);

				if (error) throw error;
				alert("Booking updated successfully!");
			} else {
				// Create new booking
				const { error } = await supabase.from("bookings").insert([
					{
						lecturer_id: lecturerId,
						course_group_id: selectedGroup,
						room_id: selectedRoom,
						start_datetime: start_datetime.toISOString(),
						end_datetime: end_datetime.toISOString(),
					},
				]);

				if (error) throw error;
				alert("Booking created successfully!");
			}
			onUpdateSuccess();
			onClose();
		} catch (error) {
			console.error(error);
			alert(`Failed to ${bookingId ? "update" : "create"} booking.`);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<div className="modal-header">
					<h2>{bookingId ? "Update Booking" : "Create a Booking"}</h2>
					<button className="close-button" onClick={onClose}>
						×
					</button>
				</div>

				<div className="modal-body">
					{isLoading ? (
						<div className="loading">Loading...</div>
					) : (
						<form>
							<div className="form-group">
								<label>Room:</label>
								<select
									value={selectedRoom}
									onChange={(e) => setSelectedRoom(e.target.value)}
								>
									<option value="">Select a room</option>
									{rooms.map((room) => (
										<option key={room.id} value={room.id}>
											{room.name} (Floor {room.floor ?? "N/A"},{" "}
											{room.building.name})
										</option>
									))}
								</select>
							</div>

							<div className="form-group">
								<label>Course Group:</label>
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

							<div className="form-group">
								<label>Date:</label>
								<input
									type="date"
									value={date}
									onChange={(e) => setDate(e.target.value)}
								/>
							</div>

							<div style={{ display: "flex", gap: "15px" }}>
								<div className="form-group" style={{ flex: 1 }}>
									<label>Start Time:</label>
									<input
										type="time"
										value={startTime}
										onChange={(e) => setStartTime(e.target.value)}
									/>
								</div>

								<div className="form-group" style={{ flex: 1 }}>
									<label>End Time:</label>
									<input
										type="time"
										value={endTime}
										onChange={(e) => setEndTime(e.target.value)}
									/>
								</div>
							</div>
						</form>
					)}
				</div>

				<div className="modal-footer">
					<button className="cancel-button" onClick={onClose}>
						Cancel
					</button>
					<button className="save-button" onClick={handleSubmit}>
						{bookingId ? "Update Booking" : "Create Booking"}
					</button>
				</div>
			</div>
		</div>
	);
}
