import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

export default function App() {
  const [data, setData] = useState(""); // state variable to store the joke data

  // useEffect is used to perform side effects in functional components
  // In this case, we want to fetch the joke data from the API and update the state
  useEffect(() => {
    const URL = "https://v2.jokeapi.dev/joke/Any?safe-mode"; // API endpoint URL
    const fetchData = async () => {
      try {
        const response = await axios.get(URL); // send GET request to the API
        // Assuming the API response structure, adjust if necessary
        if (response.data.error) {
          console.log("Error fetching joke:", response.data.message);
        } else {
          // Check the response from JokeAPI documentation for correct properties
          setData(
            response.data.setup
              ? `${response.data.setup} ... ${response.data.delivery}` // if the response has setup and delivery properties, combine them
              : response.data.joke // otherwise, use the joke property
          );
        }
      } catch (error) {
        console.error("There was an error fetching the joke:", error);
      }
    };
    
    fetchData(); // call the fetchData function to fetch the joke data
  }, []); // The empty array ensures this effect runs only once after the initial render
  // this is a dependency array. if we had a dependency, it would only run when the value of the dependency changes
  // for example, if we had a dependency element on width of the viewpoint, it would only run when the width changes
  // dependency array expects a variable or an array of variables that are used to determine if the effect should run again
  
  // Note about console.log() printing the data twice:
  // console.log(response.data);
  // Your App component is being rendered in strict mode. In React's strict mode, components may render twice in order to detect potential problems in the code. This only happens in development mode and not in production.

  return (
    <>
      <h1>Hello World</h1>
      <h2>{data}</h2>
    </>
  );
}
