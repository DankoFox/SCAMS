// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CompleteProfile from "./pages/CompleteProfile";
import UpdateProfile from "./pages/UpdateProfile";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/complete-profile" element={<CompleteProfile />} />
				<Route path="/update-profile" element={<UpdateProfile />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
