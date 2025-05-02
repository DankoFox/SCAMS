// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CompleteProfile from "./pages/CompleteProfile";
import UpdateProfile from "./pages/UpdateProfile";
import BookingPage from "./pages/Booking";
import UpdateBookingPage from "./pages/UpdataBooking";
import RoomStudentPage from "./pages/RoomStudentSystem";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/complete-profile" element={<CompleteProfile />} />
				<Route path="/update-profile" element={<UpdateProfile />} />
				<Route path="/booking" element={<BookingPage />} />
				<Route
					path="/bookings/:bookingId/edit"
					element={<UpdateBookingPage />}
				/>
				<Route path="/rooms-student" element={<RoomStudentPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
