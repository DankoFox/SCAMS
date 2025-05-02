import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./index.css";

type RoomSchedule = {
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
	useEffect(() => {
		fetchRoomSchedules();
	}, []);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(schedules.length / itemsPerPage);
	const paginatedSchedules = schedules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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


	return (
		<div style={{ padding: "2rem", backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
		  <h2>SCAMS &gt; ROMS</h2>
	  
		  <div className="main-container">
			{/* Header with title and search */}
			<div style={{
			  display: "flex",
			  justifyContent: "space-between",
			  alignItems: "center",
			  marginBottom: "1rem"
			}}>
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
						s.room_name.includes(roomId)
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
					  <button onClick={() => alert(`View map for room ${item.room_id}`)}>
						View map
					  </button>
					</td>
				  </tr>
				))}
			  </tbody>
			</table>
	  
			{/* Pagination */}
			<div className="pagination">
			  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</button>
			  <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Prev</button>
			  {Array.from({ length: totalPages }, (_, i) => i + 1)
				.slice(Math.max(0, currentPage - 2), Math.min(currentPage + 1, totalPages))
				.map((page) => (
				  <button
					key={page}
					onClick={() => setCurrentPage(page)}
					className={page === currentPage ? "active" : ""}
				  >
					{page}
				  </button>
				))}
			  <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
			  <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
			</div>
		  </div>
		</div>
	  );
	}	  