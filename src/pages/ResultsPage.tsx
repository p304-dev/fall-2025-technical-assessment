import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

interface Professor {
    name: string
    courses: string[]
    average_rating: number | null
}

export default function ResultsPage() {

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [input, setInput] = useState(searchParams.get("q") || "")
    const [results] = useState<Professor[]>([])

    function handleSearch() {
        if (input.trim() === "") return
        const previous = JSON.parse(localStorage.getItem("recentSearches") || "[]")
        const updated = [input, ...previous.filter((s: string) => s !== input)].slice(0, 3)
        localStorage.setItem("recentSearches", JSON.stringify(updated))
        navigate(`/results?q=${input}`)
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Enter") handleSearch()
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
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Search Results</h2>

                    {results.length === 0 && (
                        <p className="text-gray-500 text-sm">No professors found.</p>
                    )}

                    <div className="flex flex-col gap-3">
                        {results.map((professor) => (
                            <div key={professor.name} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                <h3 className="font-semibold text-gray-900">{professor.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">Rating: {professor.average_rating ?? "N/A"}</p>
                                <p className="text-sm text-gray-500 mt-1">Courses: {professor.courses.slice(0, 5).join(", ")}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-4 text-center text-sm text-gray-400">
                <p>All data is gathered from the <a href="https://planetterp.com" className="text-red-600 hover:underline">PlanetTerp</a> API</p>
            </div>

        </div>
    )
}
