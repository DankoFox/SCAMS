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
		<div style={{ padding: "2rem" }}>
			<h2>SCAMS &gt; ROMS</h2>
            <div style={{ marginBottom: "20px" }}>
				<input
					type="text"
					placeholder="Search by Room ID"
					value={roomId}
					onChange={(e) => setRoomId(e.target.value)}
				/>
                <button
                    onClick={() => {
                        if (roomId === "") 
                            fetchRoomSchedules();
                        else 
                        {
                            const filteredSchedules = schedules.filter((schedule) =>
                                schedule.room_name.includes(roomId)
                            );
                            setSchedules(filteredSchedules);
                        }
                    }}
                    style={{
                        padding: "10px 20px",
                        marginLeft: "10px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center",
                    }}
                >
                    Filter
                </button>
			</div>
			<table style={{ width: "100%", borderCollapse: "collapse" }}>
				<thead style={{ backgroundColor: "#f0f0f0" }}>
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
					{schedules.map((item, idx) => (
						<tr key={idx} style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}>
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
								<span
								>
									{item.status}
								</span>
							</td>
							<td>
								<button
									onClick={() => alert(`View map for room ${item.room_id}`)}
								>
									View map
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
