import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

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

export default function BuildingList() {
	const [buildings, setBuildings] = useState<Building[]>([]);
	const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
	const [roomsByBuilding, setRoomsByBuilding] = useState<{
		[key: string]: Room[];
	}>({});

	const navigate = useNavigate();

	useEffect(() => {
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
			<h2>Buildings & Rooms</h2>
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
	);
}
