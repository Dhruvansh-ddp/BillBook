import React, { useState, useEffect } from "react";
import axios from "axios";
// import { v4 as uuidv4 } from "uuid";
import "./ProjectPage.css";
import { useParams } from "react-router-dom";

// import { Link } from "react-router-dom";

const ClickedProject = () => {
  const { projectId } = useParams();

  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZiOWIzNjg4LWIyODItNGNkNS1hNjhhLWRkYWY5YmUwMTUwNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJkZXYxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3Vic2NyaWJlciIsImV4cCI6MTY5MTIwMjY0NSwiaXNzIjoiaHR0cDovL2JpbGxib29rYXBpLWVudi0xLmViYS11ZTk0dHA0cy5hcC1zb3V0aC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tLyIsImF1ZCI6IjdjZGFkNDkxLTlhNzQtNDg0NC1iNjIyLTdhNmUxNjMwY2JjNCJ9.TgWBIyEZuRfOhGgnDSiIWgfOwFO2e3S8X-HAQTuqxNk";

  const [projects, setProjects] = useState({});

  useEffect(() => {
    fetchProjects();
  }, [projectId]);

  const fetchProjects = async () => {
    try {
      // const accessToken =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZiOWIzNjg4LWIyODItNGNkNS1hNjhhLWRkYWY5YmUwMTUwNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJkZXYxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3Vic2NyaWJlciIsImV4cCI6MTY4OTk0MDUyMSwiaXNzIjoiaHR0cDovL2JpbGxib29rYXBpLWVudi0xLmViYS11ZTk0dHA0cy5hcC1zb3V0aC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tLyIsImF1ZCI6IjdjZGFkNDkxLTlhNzQtNDg0NC1iNjIyLTdhNmUxNjMwY2JjNCJ9.j2Qpqs3WGszSaiaGaidiwQn2TYHfR0HNH4I6wgcfNQE";

      const response = await axios.get(
        `http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/Project/${projectId} `,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      //   setProjects(response.data.items);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  return (
    <div
      className="project-box"
      style={{
        width: "500px",
        height: "auto",
        padding: "10px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        boxSizing: "border-box",
        borderRadius: "30px",
      }}
    >
      <div className="project-display">
        <div>
          <strong>ID:</strong> {projects.id}
        </div>
        <div>
          <strong>Contract No.:</strong> {projects.contractNo}
        </div>
        <div>
          <strong>Contract Date:</strong> {projects.contractDate}
        </div>
        <div>
          <strong>LOI No.:</strong> {projects.loiNo}
        </div>
        <div>
          <strong>LOI Date:</strong> {projects.loiDate}
        </div>
        <div>
          <strong>Project Name:</strong> {projects.projectName}
        </div>
        <div>
          <strong>Contract Validity:</strong> {projects.contractValidity}
        </div>
        <div>
          <strong>Work Completion:</strong> {projects.workCompletion}
        </div>
        <div>
          <strong>Client ID:</strong> {projects.clientId}
        </div>
      </div>
    </div>
  );
};

export default ClickedProject;
