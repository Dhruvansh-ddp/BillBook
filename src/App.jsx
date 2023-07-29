import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import SideNavbar from "./Components/SideNavbar";
import ProjectPage from "./Components/ProjectPage";
import TableList from "./Components/TableList";
import BillList from "./Components/BillList";

import "./App.css";
import Measurement from "./Components/Measurement";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container">
          <SideNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projectpage" element={<ProjectPage />} />
            <Route path="/tablelist/:projectId" element={<TableListPage />} />
            <Route path="/billlist/:projectId" element={<BillList />} />
            <Route path="/measurement" element={<Measurement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Home = () => {
  return <h1 className="HomePage">Welcome to the Home Page</h1>;
};

const TableListPage = () => {
  // Get the projectId from the URL using useParams hook
  const { projectId } = useParams();

  return <TableList projectId={projectId} />;
};

export default App;
