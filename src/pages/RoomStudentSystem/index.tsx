import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./index.css";
import BookingModal from "../../components/BookingModal";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

type RoomSchedule = {
	booking_id: string;
	room_name: string;
	building_code: string;
	floor: number;
	date: string;
	time: string;
	course_name: string;
	course_code: string;
	group_code: string;
	status: string;
	room_id: string;
};

export default function RoomStudentPage() {
	const [schedules, setSchedules] = useState<RoomSchedule[]>([]);
	const navigate = useNavigate();
	const [roomId, setRoomId] = useState<string>("");

	const [modalOpen, setModalOpen] = useState(false);
	const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
		null,
	);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(schedules.length / itemsPerPage);
	const paginatedSchedules = schedules.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);
	const fetchRoomSchedules = async () => {
		const { data, error } = await supabase
			.from("bookings") // hoặc view tổng hợp nếu có
			.select(`
        id,
        start_datetime,
        end_datetime,
        rooms (
          id,
          name,
          floor,
          type,
          buildings ( code )
        ),
        course_groups (
          group_code,
          courses (
            course_name,
            course_code
          )
        )
      `)
			.order("start_datetime", { ascending: true });

		if (error) {
			console.error(error);
			return;
		}
		const mapped = data.map((row: any) => {
			const start = new Date(row.start_datetime);
			const end = new Date(row.end_datetime);

			return {
				booking_id: row.id,
				room_name: row.rooms.name,
				room_id: row.rooms.id,
				building_code: row.rooms.buildings.code,
				floor: row.rooms.floor,
				date: start.toLocaleDateString("en-GB"),
				time: `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`,
				course_name: row.course_groups.courses.course_name,
				course_code: row.course_groups.courses.course_code,
				group_code: row.course_groups.group_code,
				status: row.rooms.type,
			};
		});
		setSchedules(mapped);
	};

	const [userRole, setUserRole] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			const {
				data: { user },
				error: userError,
			} = await supabase.auth.getUser();

			if (userError || !user) {
				console.error("User not found or error:", userError);
				return;
			}

			const { data: userData, error: roleError } = await supabase
				.from("users")
				.select("role")
				.eq("id", user.id)
				.single();

			if (roleError) {
				console.error("Error fetching role:", roleError);
			} else {
				setUserRole(userData.role); // 'lecturer', 'student', etc.
			}
		};

		fetchRoomSchedules();
		fetchUserData();
	}, []);

	return (
		<div
			style={{
				padding: "2rem",
				backgroundColor: "#f8f9fa",
				minHeight: "100vh",
			}}
		>
			<NavBar />
			<h2>SCAMS &gt; ROMS</h2>

			<div className="main-container">
				{/* Header with title and search */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "1rem",
					}}
				>
					<h3 style={{ margin: 0 }}>All Rooms</h3>
					<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
						<input
							type="text"
							placeholder="Search by Room ID"
							value={roomId}
							onChange={(e) => setRoomId(e.target.value)}
						/>
						<button
							onClick={() => {
								if (roomId === "") fetchRoomSchedules();
								else {
									const filtered = schedules.filter((s) =>
										s.room_name.includes(roomId),
									);
									setSchedules(filtered);
									setCurrentPage(1);
								}
							}}
						>
							Filter
						</button>
					</div>
				</div>

				{userRole === "lecturer" && (
					<button
						onClick={() => {
							setSelectedBookingId(null);
							setModalOpen(true);
						}}
					>
						+ Schedule Room
					</button>
				)}

				{/* Table */}
				<table>
					<thead>
						<tr>
							<th></th>
							<th>Room ID</th>
							<th>Buildings</th>
							<th>Floor</th>
							<th>Date</th>
							<th>Time</th>
							<th>Course Name</th>
							<th>Course ID</th>
							<th>Group</th>
							<th>Status</th>
							<th>Option</th>
						</tr>
					</thead>
					<tbody>
						{paginatedSchedules.map((item, idx) => (
							<tr key={idx}>
								<td>
									<input type="radio" />
								</td>
								<td>{item.room_name}</td>
								<td>{item.building_code}</td>
								<td>{item.floor}</td>
								<td>{item.date}</td>
								<td>{item.time}</td>
								<td>{item.course_name}</td>
								<td>{item.course_code}</td>
								<td>{item.group_code}</td>
								<td>
									<span className={`status-badge status-${item.status}`}>
										{item.status}
									</span>
								</td>
								<td>
									<button
										onClick={() => alert(`View map for room ${item.room_id}`)}
									>
										View map
									</button>

									{userRole === "lecturer" && (
										<button
											onClick={() => {
												setSelectedBookingId(item.booking_id);
												setModalOpen(true);
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

				{/* Pagination */}
				<div className="pagination">
					<button
						onClick={() => setCurrentPage(1)}
						disabled={currentPage === 1}
					>
						First
					</button>
					<button
						onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
						disabled={currentPage === 1}
					>
						Prev
					</button>
					{Array.from({ length: totalPages }, (_, i) => i + 1)
						.slice(
							Math.max(0, currentPage - 2),
							Math.min(currentPage + 1, totalPages),
						)
						.map((page) => (
							<button
								key={page}
								onClick={() => setCurrentPage(page)}
								className={page === currentPage ? "active" : ""}
							>
								{page}
							</button>
						))}
					<button
						onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
						disabled={currentPage === totalPages}
					>
						Next
					</button>
					<button
						onClick={() => setCurrentPage(totalPages)}
						disabled={currentPage === totalPages}
					>
						Last
					</button>
				</div>
			</div>
			<BookingModal
				isOpen={modalOpen}
				bookingId={selectedBookingId}
				onClose={() => setModalOpen(false)}
				onUpdateSuccess={() => {
					setModalOpen(false);
					fetchRoomSchedules(); // reload table data
				}}
			/>
			<Footer />
		</div>
	);
}

