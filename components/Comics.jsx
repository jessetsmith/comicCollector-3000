import "../styles/Comics.scss"

export default function Comics({ data, onCharacterClick }) {
    return (
        <div className="comics">
            {data.map((comic, index) => (
                <div key={index} className="comic-item">
                    <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} />
                    <h3>{comic.title}</h3>
                    <p>{comic.description}</p>
                    {comic.characters.items.length > 0 && (
                        <div className="character-links">
                            <h4>Characters:</h4>

                            <div className="character-buttons">
                                {comic.characters.items.map((character, index) => (
                                    <button key={index} onClick={() => onCharacterClick(character.name)}>
                                        {character.name}
                                    </button>
                                ))}
                            </div>

                            {/* <h4>Series:</h4>
                            <div className="character-buttons">
                                {comics.series.items.map((series, index) => (
                                    <button key={index} onClick={() => (series.name)}>
                                        {series.name}
                                    </button>
                                ))}
                            </div> */}
                        </div>
                    )}
                    <a href={comic.urls[0].url} target="_blank" rel="noopener noreferrer">
                        <button className="comic-link-button">View Comic</button>
                    </a>
                </div>
            ))}
        </div>
    )
}