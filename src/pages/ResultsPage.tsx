import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

interface Professor {
    name: string
    courses: string[]
    average_rating: number | null
}

export default function ResultsPage() {

    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [input, setInput] = useState("")
    const [results, setResults] = useState<Professor[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const fetchProfessors = async (query: string) => {
        setLoading(true)
        setError("")
        try {
            const response = await fetch(`https://planetterp.com/api/v1/professors?search=${query}&limit=10`)
            const data = await response.json()
            setResults(data)
        } catch {
            setError("Something went wrong. Please try again.")
        }
        setLoading(false)
    }

    useEffect(() => {
        const query = searchParams.get("q")
        if (query) {
            setInput(query)
            fetchProfessors(query)
        }
    }, [searchParams])

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
        <div>

            <div>
                <button onClick={() => navigate("/")}>Return</button>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter professor name..."
                    type="text"
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div>
                <h2>Search Results</h2>

                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && results.length === 0 && <p>No professors found.</p>}

                {results.map((professor) => (
                    <div key={professor.name}>
                        <h3>{professor.name}</h3>
                        <p>Rating: {professor.average_rating ?? "N/A"}</p>
                        <p>Courses: {professor.courses.slice(0, 5).join(", ")}</p>
                    </div>
                ))}
            </div>

            <div>
                <p>All data is gathered from the PlanetTerp API</p>
            </div>

        </div>
    )
}
