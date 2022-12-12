import { useState } from "react";
import "./App.css";

import {
  Link,
  Outlet,
  ReactLocation,
  Router,
  useMatch,
} from "@tanstack/react-location";

import { useQuery, QueryClient, QueryClientProvider } from "react-query";
import styled from "@emotion/styled";

const queryClient = new QueryClient();

const location = new ReactLocation();

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/person/:id",
    element: <PersonDetails />,
  },
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router routes={routes} location={location}>
        <Outlet />
      </Router>
    </QueryClientProvider>
  );
}

type Person = {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  eye_color: string;
  gender: string;
  skin_color: string;
};

function PersonDetails() {
  const { data: StarWarsData } = useQuery<Person[]>(["showData"]);

  const match = useMatch();
  const id = match.params.id as unknown as number;
  if (!StarWarsData) {
    return <div>No data, sorry...</div>;
  }
  const item: Person = StarWarsData[id];

  return (
    <div>
      <h1>{item.name}</h1>
      <p>Height: {item.height}</p>
      <p>Mass: {item.mass}</p>
      <p>Hair Color: {item.hair_color}</p>
      <p>Skin Color: {item.skin_color}</p>
      <p>Eye Color: {item.eye_color}</p>
      <p>gender: {item.gender}</p>
    </div>
  );
}

const StyledLi = styled.div`
  list-style: none;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
  border-radius: 5px;
  border: 1px solid black;
  margin-bottom: 20px;
  padding: 0 10px;
`;

function Home() {
  const [input, setInput] = useState("");
  const { data: StarWarsData } = useQuery(
    ["showData"],
    () => fetch("./src/data.json").then((res) => res.json()),
    {
      initialData: [],
    }
  );

  const NewArray = StarWarsData.filter((item: any) => {
    return item.name.toLowerCase().includes(input.toLowerCase());
  });

  return (
    <main>
      {NewArray.isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Star Wars Characters</h1>
          <Input
            type="text"
            placeholder="Search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></Input>
          <div>
            {NewArray.map((item: { name: string }, id: number) => (
              <StyledLi key={id}>
                <a href="/"></a>
                <Link key={id} to={`/person/${id}`}>
                  <h2>{item.name}</h2>
                </Link>
              </StyledLi>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
