import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import BookingModal from "../BookingModal";

type Booking = {
	id: string;
	room: {
		id: string;
		name: string;
		floor: number;
		building: {
			id: string;
			name: string;
		};
	};
	start_datetime: string;
	end_datetime: string;
	course_group: {
		id: string;
		group_code: string;
		course: {
			id: string;
			course_name: string;
			course_code: string;
		};
	};
};

type LecturerBookingsProps = {
	lecturerId: string;
};

export default function LecturerBookings({
	lecturerId,
}: LecturerBookingsProps) {
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
		null,
	);

	const fetchBookings = async () => {
		try {
			const { data, error } = await supabase
				.from("bookings")
				.select(`
          id,
          start_datetime,
          end_datetime,
          rooms!room_id (
            id,
            name,
            floor,
            buildings!building_id (
              id,
              name
            )
          ),
          course_groups!course_group_id (
            id,
            group_code,
            courses!course_id (
              id,
              course_name,
              course_code
            )
          )
        `)
				.eq("lecturer_id", lecturerId)
				.order("start_datetime", { ascending: true });

			console.log("Lecturer ID:", lecturerId);
			console.log("Raw Data:", data);

			if (error) {
				console.error("Supabase query error:", error);
				return;
			}

			if (!error && data) {
				const formattedData = data.map((booking) => ({
					id: booking.id,
					start_datetime: booking.start_datetime,
					end_datetime: booking.end_datetime,
					room: {
						...booking.rooms,
						building: booking.rooms.buildings,
					},
					course_group: {
						id: booking.course_groups.id,
						group_code: booking.course_groups.group_code,
						course: booking.course_groups.courses,
					},
				}));
				console.log("Formatted data:", formattedData);
				setBookings(formattedData as Booking[]);
			}
		} catch (err) {
			console.error("Exception in fetchBookings:", err);
		}
	};

	useEffect(() => {
		fetchBookings();
	}, [lecturerId]);

	const formatDate = (datetime: string) => {
		const dateObj = new Date(datetime);
		return dateObj.toLocaleDateString();
	};

	const formatTime = (datetime: string) => {
		const dateObj = new Date(datetime);
		return dateObj.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const checkStatus = (start_datetime: string) => {
		const now = new Date();
		const start = new Date(start_datetime);
		return start > now ? "Incoming" : "Passed";
	};

	const handleEditBooking = (bookingId: string) => {
		setSelectedBookingId(bookingId);
		setIsModalOpen(true);
	};

	const handleCreateBooking = () => {
		setSelectedBookingId(null);
		setIsModalOpen(true);
	};

	return (
		<div style={{ marginTop: 20 }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h2>Your Bookings</h2>
				<button
					onClick={handleCreateBooking}
					style={{
						padding: "8px 16px",
						backgroundColor: "#4CAF50",
						color: "white",
						border: "none",
						borderRadius: "4px",
						cursor: "pointer",
					}}
				>
					Create New Booking
				</button>
			</div>

			{bookings.length === 0 ? (
				<p>No bookings found.</p>
			) : (
				<table
					border={1}
					cellPadding={10}
					style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}
				>
					<thead>
						<tr>
							<th>Room</th>
							<th>Building</th>
							<th>Floor</th>
							<th>Date</th>
							<th>Time</th>
							<th>Course</th>
							<th>Course Code</th>
							<th>Group</th>
							<th>Status</th>
							<th>Options</th>
						</tr>
					</thead>
					<tbody>
						{bookings.map((booking) => (
							<tr key={booking.id}>
								<td>{booking.room.name}</td>
								<td>{booking.room.building.name}</td>
								<td>{booking.room.floor}</td>
								<td>{formatDate(booking.start_datetime)}</td>
								<td>
									{formatTime(booking.start_datetime)} -{" "}
									{formatTime(booking.end_datetime)}
								</td>
								<td>{booking.course_group.course.course_name}</td>
								<td>{booking.course_group.course.course_code}</td>
								<td>{booking.course_group.group_code}</td>
								<td>{checkStatus(booking.start_datetime)}</td>
								<td>
									{checkStatus(booking.start_datetime) === "Passed" ? (
										<button
											disabled
											style={{
												padding: "6px 12px",
												backgroundColor: "#cccccc",
												color: "#666666",
												border: "none",
												borderRadius: "4px",
												cursor: "not-allowed",
											}}
										>
											Edit
										</button>
									) : (
										<button
											onClick={() => handleEditBooking(booking.id)}
											style={{
												padding: "6px 12px",
												backgroundColor: "#2196F3",
												color: "white",
												border: "none",
												borderRadius: "4px",
												cursor: "pointer",
											}}
										>
											Edit
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			<BookingModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				bookingId={selectedBookingId}
				onUpdateSuccess={fetchBookings}
			/>
		</div>
	);
}
