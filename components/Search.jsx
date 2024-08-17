import "../styles/Search.scss"
import { useState, useEffect } from "react"
import md5 from "md5"
import Characters from "./Characters"
import Comics from "./Comics"
import Series from "./Series"
import Loading from "./Loading"

export default function Search() {
    const [searchType, setSearchType] = useState("characters")
    const [searchQuery, setSearchQuery] = useState("")
    const [characterData, setCharacterData] = useState(null)
    const [comicData, setComicData] = useState(null)
    const [seriesData, setSeriesData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [characterShelf, setCharacterShelf] = useState([])
    const [comicShelf, setComicShelf] = useState([])
    const [seriesShelf, setSeriesShelf] = useState([])

    const publicKey = import.meta.env.VITE_PUBLIC_KEY
    const privateKey = import.meta.env.VITE_PRIVATE_KEY

    useEffect(() => {
        const savedCharacterShelf = JSON.parse(sessionStorage.getItem("characterShelf")) || []
        const savedComicShelf = JSON.parse(sessionStorage.getItem("comicShelf")) || []
        const savedSeriesShelf = JSON.parse(sessionStorage.getItem("seriesShelf")) || []
        setCharacterShelf(savedCharacterShelf)
        setComicShelf(savedComicShelf)
        setSeriesShelf(savedSeriesShelf)
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault()
        if (searchType === "characters") {
            getCharacterData()
        } else if (searchType === "comics") {
            getComicData()
        } else if (searchType === "series") {
            getSeriesData()
        }
    }

    const getCharacterData = (characterName = searchQuery) => {
        setCharacterData(null)
        setComicData(null)
        setSeriesData(null)
        setLoading(true)
        setErrorMessage("")

        const timeStamp = new Date().getTime()
        const hash = generateHash(timeStamp)

        const url = `https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}&nameStartsWith=${characterName}`

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(result => {
                if (result.data.results.length === 0) {
                    setErrorMessage("No characters found. Please try a different name.")
                } else {
                    setCharacterData(result.data)
                    addToShelf("character", characterName, result.data)
                }
                setLoading(false)
            })
            .catch(error => {
                console.log("There was an error:", error)
                setLoading(false)
            })
    }

    const getComicData = (character = null) => {
        setLoading(true);
        setErrorMessage("");
        console.log(character);

        const timeStamp = new Date().getTime();
        const hash = generateHash(timeStamp);

        let url;
        if (character.id) {
            // Check if comics for this character are already stored
            const storedComics = JSON.parse(sessionStorage.getItem(`comics_${character.id}`));
            if (storedComics) {
                setComicData(storedComics);
                setLoading(false);
                return;
            }

            // Fetch comics for a specific character
            url = `https://gateway.marvel.com:443/v1/public/comics?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}&characters=${character.id}`;
        } else {
            // Check if comics for this search query are already stored
            const storedComics = JSON.parse(sessionStorage.getItem(`comics_${searchQuery}`));
            if (storedComics) {
                setComicData(storedComics);
                setLoading(false);
                return;
            }

            // Fetch comics based on search query
            url = `https://gateway.marvel.com:443/v1/public/comics?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}&titleStartsWith=${searchQuery}`;
        }

        console.log("Fetching comics with URL:", url);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                console.log("API response:", result);
                if (result.data && result.data.results.length === 0) {
                    setErrorMessage("No comics found.");
                } else if (result.data) {
                    setComicData(result.data);
                    addToShelf("comic", character.name, character);
                    if (character.id) {
                        sessionStorage.setItem(`comics_${character.id}`, JSON.stringify(result.data));
                    } else {
                        sessionStorage.setItem(`comics_${searchQuery}`, JSON.stringify(result.data));
                    }
                } else {
                    throw new Error("Unexpected API response structure");
                }
            })
            .catch(error => {
                console.error("Error fetching comics:", error);
                setErrorMessage("Failed to fetch comics. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const getSeriesData = () => {
        setCharacterData(null)
        setComicData(null)
        setSeriesData(null)
        setLoading(true)
        setErrorMessage("")

        const timeStamp = new Date().getTime()
        const hash = generateHash(timeStamp)

        const url = `https://gateway.marvel.com:443/v1/public/series?apikey=${publicKey}&hash=${hash}&ts=${timeStamp}&titleStartsWith=${searchQuery}`

        console.log("Fetching series with URL:", url);

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .then(result => {
                if (result.data.results.length === 0) {
                    setErrorMessage("No series found. Please try a different title.")
                } else {
                    setSeriesData(result.data)
                    addToShelf("series", searchQuery, result.data)
                }
                setLoading(false)
            })
            .catch(error => {
                console.log("There was an error:", error)
                setLoading(false)
            })
    }

    const generateHash = (timeStamp) => {
        return md5(timeStamp + privateKey + publicKey)
    }

    const handleChange = (event) => {
        setSearchQuery(event.target.value)
    }

    const handleReset = () => {
        setCharacterData(null)
        setComicData(null)
        setSeriesData(null)
        setSearchQuery("")
        setErrorMessage("")
    }

    const handleBackToCharacters = () => {
        setComicData(null)
        setSeriesData(null)
    }

    const addToShelf = (type, name, data) => {
        let updatedShelf;
        if (type === "character") {
            updatedShelf = [...characterShelf, { name, data }];
            setCharacterShelf(updatedShelf);
            sessionStorage.setItem("characterShelf", JSON.stringify(updatedShelf));
        } else if (type === "comic") {
            // Include character names in the shelf entry
            const characterName = name;
            updatedShelf = [...comicShelf, { name: `${name}`, data }]; // Update name format
            setComicShelf(updatedShelf);
            sessionStorage.setItem("comicShelf", JSON.stringify(updatedShelf));
        } else if (type === "series") {
            updatedShelf = [...seriesShelf, { name, data }];
            setSeriesShelf(updatedShelf);
            sessionStorage.setItem("seriesShelf", JSON.stringify(updatedShelf));
        }
    }

    const handleShelfClick = (type, data) => {
        if (type === "character") {
            setCharacterData(data);
            setComicData(null);
            setSeriesData(null);
        } else if (type === "comic") {
            const storedComics = JSON.parse(sessionStorage.getItem(`comics_${data.id}`));
            setComicData(storedComics);
            setCharacterData(null);
            setSeriesData(null);
        } else if (type === "series") {
            setSeriesData(data);
            setCharacterData(null);
            setComicData(null);
        }
        setErrorMessage("");
    }

    const handleCharacterClick = (characterName) => {
        const existingCharacter = characterShelf.find(item => item.name === characterName);
        if (existingCharacter) {
            setCharacterData(existingCharacter.data);
            setComicData(null); // Ensure comics are not shown
        } else {
            getCharacterData(characterName);
        }
    }

    return (
        <>
            <form className="search" onSubmit={handleSubmit}>
                <div className="search-row">
                    <select onChange={(e) => setSearchType(e.target.value)} value={searchType}>
                        <option value="characters">Characters</option>
                        <option value="comics">Comics</option>
                        <option value="series">Series</option>
                    </select>
                    <input
                        placeholder={`ENTER ${searchType.toUpperCase()} NAME`}
                        type="text"
                        onChange={handleChange}
                        value={searchQuery}
                    />
                </div>
                <div className="buttons">
                    <button type="submit">Search</button>
                    <button type="reset" className="reset" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>

            {(characterShelf.length > 0 || comicShelf.length > 0 || seriesShelf.length > 0) && (
                <div className="comic-shelf">
                    <h2>Comic Shelf</h2>
                    {characterShelf.length > 0 && (
                        <div className="shelf-section">
                            <h3>Characters</h3>
                            <div className="shelf-buttons">
                                {characterShelf.map((entry, index) => (
                                    <button key={index} onClick={() => handleShelfClick("character", entry.data)}>
                                        {entry.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {comicShelf.length > 0 && (
                        <div className="shelf-section">
                            <h3>Comics</h3>
                            <div className="shelf-buttons">
                                {comicShelf.map((entry, index) => (
                                    <button key={index} onClick={() => handleShelfClick("comic", entry.data)}>
                                        {entry.name} {/* This now includes the character names */}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {seriesShelf.length > 0 && (
                        <div className="shelf-section">
                            <h3>Series</h3>
                            <div className="shelf-buttons">
                                {seriesShelf.map((entry, index) => (
                                    <button key={index} onClick={() => handleShelfClick("series", entry.data)}>
                                        {entry.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {loading && <Loading />}

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {!comicData && !seriesData && characterData && characterData.results && characterData.results.length > 0 && (
                <Characters
                    data={characterData.results}
                    onClick={(character) => {
                        setCharacterData(null); // Hide character results
                        getComicData(character); // Fetch comics for the clicked character
                    }}
                />
            )}

            {comicData && (
                <>
                    {characterData && (
                        <button className="back-button" onClick={handleBackToCharacters}>
                            Back to Characters
                        </button>
                    )}
                    {comicData.results[0] && (
                        <Comics
                            data={comicData.results}
                            onCharacterClick={handleCharacterClick}
                        />
                    )}
                </>
            )}

            {seriesData && (
                <>
                    {characterData && (
                        <button className="back-button" onClick={handleBackToCharacters}>
                            Back to Characters
                        </button>
                    )}
                    {seriesData.results[0] && (
                        <Series
                            data={seriesData.results}
                            onCharacterClick={handleCharacterClick}
                        />
                    )}
                </>
            )}
        </>
    )
}