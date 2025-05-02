import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { HeroBanner } from "../../components/HeroBanner";
import { FeatureSection } from "../../components/FeatureSection";
import { UserType } from "../../types";
import "./index.css";

export default function Home() {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [userType, setUserType] = useState<UserType>("guest");

	const navigate = useNavigate();

	useEffect(() => {
		const getSessionAndUser = async () => {
			setIsLoading(true);
			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session) {
                setUserType("guest");
                setIsLoading(false);
                return;
            }

			const { user } = session;
			const { data, error } = await supabase
				.from("users")
				.select("name, role")
				.eq("id", user.id)
				.single();

			if (error || !data) {
				navigate("/login");
			} else if (!data.name) {
				navigate("/complete-profile");
			} else {
				if (data.role === "lecturer") {
                    setUserType("lecturer");
                } else if (data.role === "student") {
                    setUserType("student");
                }   
			}
			setIsLoading(false);
		};

		getSessionAndUser();
	}, [navigate]);

	const setupContent = () => {
        switch (userType) {
            case "lecturer":
                return {
                    title: "lecturers",
                    description: "Find your way to office and classroom or set schedules",
                    subDescription: "Ho Chi Minh City University of Technology has many buildings in a large area. Each building has meeting rooms and classrooms with qualified facilities.",
					buttons: [
                        { text: "View rooms", link: "/rooms-student" },
                        { text: "View map", link: "/map" },
                    ],
                };
            case "student":
                return {
                    title: "students",
                    description: "Find your way to office and classrooms",
					subDescription: "Ho Chi Minh City University of Technology has many buildings in a large area. Each building has meeting rooms and classrooms with qualified facilities.",
                    buttons: [
                        { text: "View rooms", link: "/rooms-student" },
                        { text: "View map", link: "/map" },
                    ],
                };
            default:
				return {
                    title: "",
                    description: "Find your way? Book room for meeting? Check schedules?",
					subDescription: "Use your school account to log in and enjoy all the convenient services of the Smart Campus System.",
                    buttons: [{ text: "Login Now", link: "/login" }],
                };
        }
    };

	const { title, description, subDescription, buttons } = setupContent();

	if (isLoading) {
        return (
            <div className="home-container">
                <NavBar />
                <div className="loading-container">
                    <h2 className="loading-text">Loading...</h2>
                </div>
            </div>
        );
    }

	return (
		<div className="home-container">
			<NavBar />
			<HeroBanner title={title} />
            <FeatureSection description={description} subDescription={subDescription} buttons={buttons} />
		</div>
	);
}