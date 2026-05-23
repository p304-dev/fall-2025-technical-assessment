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
        <div className="min-h-screen flex flex-col bg-white">

            <div className="flex items-center px-16 py-20 bg-black">
                <div className="border border-gray-300 p-6 max-w-sm">
                    <h1 className="text-white text-3xl font-bold mb-3">Find My Professor</h1>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Want to know more about the professors here at UMD? This is the perfect place to learn a bit about the courses they teach and their grade distributions.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center py-12 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter a Professor to start</h2>
                <div className="flex w-full max-w-xl">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
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

            {recentSearches.length > 0 && (
                <div className="flex flex-col items-center px-4 pb-8">
                    <div className="w-full max-w-xl">
                        <h3 className="font-semibold text-gray-900 mb-3">Recently Searched</h3>
                        <div className="flex gap-3 flex-wrap">
                            {recentSearches.map((name: string) => (
                                <button
                                    key={name}
                                    onClick={() => navigate(`/results?q=${name}`)}
                                    className="flex items-center gap-2 border border-gray-300 rounded px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                                >
                                    {name} ›
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-auto py-4 text-center text-sm text-gray-400">
                <p>All data is gathered from the <a href="https://planetterp.com" className="text-red-600 hover:underline">PlanetTerp</a> API</p>
            </div>

        </div>
    )
}
