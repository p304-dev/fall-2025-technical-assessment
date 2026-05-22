import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function LandingPage() {

    const [search, setSearch] = useState("")
    const [recentSearches, setRecentSearches] = useState(
        JSON.parse(localStorage.getItem("recentSearches") || "[]")
    )
    const navigate = useNavigate()

    function handleSearch() {
        if (search.trim() === "") return
        const previous = JSON.parse(localStorage.getItem("recentSearches") || "[]")
        const updated = [search, ...previous.filter((s: string) => s !== search)].slice(0, 3)
        localStorage.setItem("recentSearches", JSON.stringify(updated))
        setRecentSearches(updated)
        navigate(`/results?q=${search}`)
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Enter") handleSearch()
    }

    return (
        <div>

            <div>
                <h1>Find My Professor</h1>
                <p>Want to know more about the professors here at UMD? This is the perfect place to learn a bit about the courses they teach and their grade distributions.</p>
            </div>

            <div>
                <h2>Enter a Professor to start</h2>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter professor name..."
                    type="text"
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {recentSearches.length > 0 && (
                <div>
                    <h2>Recently Searched</h2>
                    {recentSearches.map((name: string) => (
                        <button key={name} onClick={() => navigate(`/results?q=${name}`)}>
                            {name}
                        </button>
                    ))}
                </div>
            )}

            <div>
                <p>All data is gathered from the PlanetTerp API</p>
            </div>

        </div>
    )
}
