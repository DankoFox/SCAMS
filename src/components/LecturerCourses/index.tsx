import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

type CourseGroup = {
	id: string;
	group_code: string;
};

type Course = {
	id: string;
	course_code: string;
	course_name: string;
	groups: CourseGroup[];
};

interface LecturerCoursesProps {
	lecturerId: string;
}

export default function LecturerCourses({ lecturerId }: LecturerCoursesProps) {
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (lecturerId) {
			fetchLecturerCourses(lecturerId);
		}
	}, [lecturerId]);

	const fetchLecturerCourses = async (lecturerId: string) => {
		setLoading(true);

		const { data, error } = await supabase
			.from("course_lecturers")
			.select(`
        id,
        group_id,
        course_groups (
          id,
          group_code,
          course_id,
          courses (
            id,
            course_code,
            course_name
          )
        )
      `)
			.eq("lecturer_id", lecturerId);

		if (!error && data) {
			// Process the data to organize courses with their groups
			const coursesMap = new Map<string, Course>();

			data.forEach((item: any) => {
				const courseId = item.course_groups.courses.id;
				const groupInfo = {
					id: item.course_groups.id,
					group_code: item.course_groups.group_code,
				};

				if (coursesMap.has(courseId)) {
					// Add group to existing course
					const course = coursesMap.get(courseId)!;
					course.groups.push(groupInfo);
				} else {
					// Create new course with this group
					coursesMap.set(courseId, {
						id: courseId,
						course_code: item.course_groups.courses.course_code,
						course_name: item.course_groups.courses.course_name,
						groups: [groupInfo],
					});
				}
			});

			setCourses(Array.from(coursesMap.values()));
		}

		setLoading(false);
	};

	return (
		<div style={{ marginTop: 20 }}>
			<h2>Courses you are teaching</h2>
			{loading ? (
				<p>Loading courses...</p>
			) : courses.length > 0 ? (
				<div>
					{courses.map((course) => (
						<div key={course.id} style={{ marginBottom: 15 }}>
							<h3>
								<strong>{course.course_code}</strong>: {course.course_name}
							</h3>
							<div style={{ marginLeft: 20 }}>
								<h4>Groups:</h4>
								<ul>
									{course.groups.map((group) => (
										<li key={group.id}>Group {group.group_code}</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>
			) : (
				<p>No courses assigned yet.</p>
			)}
		</div>
	);
}
