import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Container } from "react-bootstrap";

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
  const [history, setHistory] = useState([]);
  const [banList, setBanList] = useState([]);

  const URL = "https://pokeapi.co/api/v2/pokemon";

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
        pokeObj["types"] = data.types.map((type) => type.type.name);
        console.log(pokeObj);
        setData(pokeObj);
      }
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
          <History history={history} />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} xl={6}>
          <h1>Poke Picker</h1>
          <SearchButton
            onSearch={fetchData}
            data={data}
            setHistory={setHistory}
            history={history}
          />
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
        </Col>
        <Col xs={3} sm={3} md={3} lg={3} xl={3}>
          <BanList banList={banList} setBanList={setBanList} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;