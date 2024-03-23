import { useState, useEffect } from "react";
// import react bootstrap components
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Container} from "react-bootstrap";

import "./App.css";

function SearchButton({ onSearch, data, setHistory, history }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
    setHistory([...history, data]);
  };

  return (
    <button type="submit" onClick={handleSubmit}>
      Search
    </button>
  );
}

function BanList({ banList, setBanList }) {
  const removeFromBanList = (typeToRemove) => {
    setBanList(banList.filter((type) => type !== typeToRemove));
  };

  return (
    <div>
      <h2>Banned Pokemon Types:</h2>
      <ul>
        {banList.map((type, index) => (
          <li key={index}>
            <button onClick={() => removeFromBanList(type)}>{type}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function History({ history }) {
  return (
    <div>
      <h2>Previously Seen Pokemon:</h2>
      <ul>
        {history.map((pokemon, index) => (
          <li key={index}>
            <img src={pokemon.imageURL} alt={pokemon.name} />
            <p>{pokemon.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]); //array of objects of previous dog data
  const [banList, setBanList] = useState([]); //arrays of arrays for each property of the dog
  const [isBanListShown, setIsBanListShown] = useState(false);
  const [isHistoryShown, setIsHistoryShown] = useState(false);

  const URL = "https://pokeapi.co/api/v2/pokemon"; // API endpoint URL

  const addToBanList = (type) => {
    setBanList((prevBanList) => [...prevBanList, type]);
  };

  const fetchData = async () => {
    const pokeObj = {};
    const maxBanListSize = 18;
    if (banList.length >= maxBanListSize) {
      alert("Ban list is full");
      return;
    }
    try {
      const random = Math.floor(Math.random() * 800) + 1;
      const response = await fetch(URL + `/${random}`);
      const data = await response.json();

      // Check if any of the Pokemon's types are in the ban list
      const isBanned = data.types.some((type) =>
        banList.includes(type.type.name)
      );
      if (isBanned) {
        console.log("Banned Pokemon found, fetching again...");
        fetchData();
      } else {
        console.log("Pokemon not in ban list");
        pokeObj["name"] = data.name;
        pokeObj["imageURL"] = data.sprites.front_default;
        pokeObj["height"] = data.height;
        pokeObj["weight"] = data.weight;
        pokeObj["types"] = data.types.map((type) => type.type.name); // Get all types
        console.log(pokeObj);
        setData(pokeObj);
      }
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount
  return (
    <>
      <div style={{position: 'relative'}}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        {isHistoryShown && (
  <div>
    <History history={history} />
  </div>
)}
          <div>
            <h1>Pokemon Picker</h1>
            <SearchButton
              onSearch={fetchData}
              data={data}
              setHistory={setHistory}
              history={history}
            />
            <button onClick={() => setIsBanListShown(!isBanListShown)}>
              Ban List
            </button>
            <button onClick={() => setIsHistoryShown(!isHistoryShown)}>
              History
            </button>
            {data && (
              <div>
                <h2>{data.name}</h2>
                <img src={data.imageURL} alt={data.name} />
                <p>Height: {data.height}</p>
                <p>Weight: {data.weight}</p>
                <p>
                  Types:{" "}
                  {data.types.map((type, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (!banList.includes(type)) {
                          addToBanList(type);
                        }
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </p>
              </div>
            )}
          </div>
          {isBanListShown && (
            <BanList banList={banList} setBanList={setBanList} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
