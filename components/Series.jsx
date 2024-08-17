import React from "react"
import "../styles/Series.scss"

export default function Series({ data, onCharacterClick }) {
    return (
        <div className="series">
            {data.map((series) => (
                <div key={series.id} className="series-item">
                    <img src={`${series.thumbnail.path}.${series.thumbnail.extension}`} alt={series.title} />
                    <h3>{series.title}</h3>
                    <p>{series.description}</p>
                    {series.characters.items.length > 0 && (
                        <div className="characters">
                            <h4>Characters:</h4>
                            <div className="character-buttons">
                                {series.characters.items.map((character, index) => (
                                    <button key={index} onClick={() => onCharacterClick(character.name)}>
                                        {character.name}
                                    </button>
                                ))}
                            </div>

                            {/* <h4>Comics:</h4>
                            <div className="character-buttons">
                                {series.comics.items.map((comic, index) => (
                                    <button key={index} onClick={() => onCharacterClick(comic.name)}>
                                        {comic.name}
                                    </button>
                                ))}
                            </div> */}
                        </div>
                    )}
                    <a href={series.urls[0].url} target="_blank" rel="noopener noreferrer">
                        <button className="series-link-button">View Series</button>
                    </a>
                </div>
            ))}
        </div>
    )
}