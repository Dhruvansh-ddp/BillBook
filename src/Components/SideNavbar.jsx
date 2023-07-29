import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import "./SideNavbar.css";

const SideNavbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <aside
      className={`sidenavbar-container ${isSidebarOpen ? "open" : "closed"}`}
    >
      <ToggleButtonGroup
        orientation="vertical"
        value={isSidebarOpen ? "list" : ""}
        exclusive
        onChange={toggleSidebar}
      >
        <ToggleButton value="list" aria-label="list">
          <ViewListIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      <ul className="navbar-menu">
        <li className="navbar-item">
          <Link to="/" className="navbar-link">
            Dashboard
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/projectpage" className="navbar-link">
            Projects
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/clients" className="navbar-link">
            Clients
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/billlist" className="navbar-link">
            BillList
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/tablelist" className="navbar-link">
            Table
          </Link>
        </li>
        <li className="navbar-item">
          <Link to="/measurement" className="navbar-link">
            Measurement
          </Link>
        </li>
      </ul>

      {!isSidebarOpen && (
        <button className="show-sidebar-button" onClick={toggleSidebar}>
          <ToggleButtonGroup
            orientation="vertical"
            value={isSidebarOpen ? "list" : ""}
            exclusive
            onChange={toggleSidebar}
          >
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </button>
      )}
    </aside>
  );
};

export default SideNavbar;
