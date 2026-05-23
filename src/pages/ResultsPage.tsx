import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

interface Professor {
  name: string;
  slug: string;
  type: string;
  courses: string[];
  average_rating: number | null;
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [courseGrades, setCourseGrades] = useState<{
    [course: string]: string;
  }>({});

  useEffect(() => {
    const query = searchParams.get("q");
    if (!query) return;

    const fetchProfessor = async () => {
      try {
        const response = await axios.get(
          `https://planetterp.com/api/v1/professor?name=${query}`,
        );
        setProfessor(response.data);
        const grades: { [course: string]: string } = {};

        for (const course of response.data.courses) {
          try {
            const courseResponse = await axios.get(
              `https://planetterp.com/api/v1/course?name=${course}`,
            );
            grades[course] = courseResponse.data.average_grade ?? "N/A";
          } catch {
            grades[course] = "N/A";
          }
        }

        setCourseGrades(grades);
      } catch {
        //empty
      }
    };

    fetchProfessor();
  }, [searchParams]);

  function handleSearch() {
    if (input.trim() === "") return;
    const previous = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    const updated = [
      input,
      ...previous.filter((s: string) => s !== input),
    ].slice(0, 3);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    navigate(`/results?q=${input}`);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter") handleSearch();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="relative flex items-center justify-center px-8 py-8 border-b border-gray-200">
        <button
          onClick={() => navigate("/")}
          className="absolute left-8 text-lg text-gray-600 hover:text-gray-900 whitespace-nowrap"
        >
          ‹ Return
        </button>
        <div className="flex w-full max-w-xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter professor name..."
            type="text"
            className="flex-1 border border-gray-300 rounded-l px-4 py-2 text-gray-700 text-sm focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-gray-900 text-white px-4 py-2 rounded-r hover:bg-gray-700"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-8 py-6">
        <div className="w-full max-w-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Search Results
          </h2>

          {professor && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900">{professor.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Rating: {professor.average_rating ?? "N/A"}
              </p>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Courses:</p>
                {professor.courses.map((course) => (
                  <div key={course} className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{course}</span>
                    <span>Avg Grade: {courseGrades[course]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!professor && (
            <p className="text-gray-500 text-sm">No professor found.</p>
          )}
        </div>
      </div>

      <div className="py-4 text-center text-sm text-gray-400">
        <p>
          All data is gathered from the{" "}
          <a
            href="https://planetterp.com"
            className="text-red-600 hover:underline"
          >
            PlanetTerp
          </a>{" "}
          API
        </p>
      </div>
    </div>
  );
}
