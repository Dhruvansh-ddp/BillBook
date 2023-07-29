// //  Authorization token is constant

import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./ProjectPage.css";

import { Link } from "react-router-dom";

const ProjectPage = () => {
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZiOWIzNjg4LWIyODItNGNkNS1hNjhhLWRkYWY5YmUwMTUwNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJkZXYxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3Vic2NyaWJlciIsImV4cCI6MTY5MTIwMjY0NSwiaXNzIjoiaHR0cDovL2JpbGxib29rYXBpLWVudi0xLmViYS11ZTk0dHA0cy5hcC1zb3V0aC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tLyIsImF1ZCI6IjdjZGFkNDkxLTlhNzQtNDg0NC1iNjIyLTdhNmUxNjMwY2JjNCJ9.TgWBIyEZuRfOhGgnDSiIWgfOwFO2e3S8X-HAQTuqxNk";

  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [projectData, setProjectData] = useState({
    id: "",
    contractNo: "",
    contractDate: "",
    loiNo: null,
    loiDate: null,
    projectName: "",
    contractValidity: null,
    workCompletion: null,
    clientId: "",
  });
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // const accessToken =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZiOWIzNjg4LWIyODItNGNkNS1hNjhhLWRkYWY5YmUwMTUwNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJkZXYxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3Vic2NyaWJlciIsImV4cCI6MTY4OTk0MDUyMSwiaXNzIjoiaHR0cDovL2JpbGxib29rYXBpLWVudi0xLmViYS11ZTk0dHA0cy5hcC1zb3V0aC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tLyIsImF1ZCI6IjdjZGFkNDkxLTlhNzQtNDg0NC1iNjIyLTdhNmUxNjMwY2JjNCJ9.j2Qpqs3WGszSaiaGaidiwQn2TYHfR0HNH4I6wgcfNQE";

      const response = await axios.get(
        "http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/Project?page=1&pageSize=10",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setProjects(response.data.items);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleEdit = (index) => {
    setIsEditMode(true);
    setEditIndex(index);
    setProjectData({ ...projects[index] });
  };

  //perfect
  const handleSave = async () => {
    setIsEditMode(false);
    try {
      // const accessToken =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZiOWIzNjg4LWIyODItNGNkNS1hNjhhLWRkYWY5YmUwMTUwNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJkZXYxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3Vic2NyaWJlciIsImV4cCI6MTY4OTk0MDUyMSwiaXNzIjoiaHR0cDovL2JpbGxib29rYXBpLWVudi0xLmViYS11ZTk0dHA0cy5hcC1zb3V0aC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tLyIsImF1ZCI6IjdjZGFkNDkxLTlhNzQtNDg0NC1iNjIyLTdhNmUxNjMwY2JjNCJ9.j2Qpqs3WGszSaiaGaidiwQn2TYHfR0HNH4I6wgcfNQE";

      const response = await axios.get(
        "http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/Project?page=1&pageSize=10",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const fetchedProjects = response.data.items;
      const projectExists = fetchedProjects.some(
        (p) => p.id === projectData.id
      );
      let updatedProjects;

      if (projectExists) {
        // Update existing project
        await axios.put(
          `http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/Project`,
          projectData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        updatedProjects = fetchedProjects.map((p) =>
          p.id === projectData.id ? { ...projectData } : p
        );
      } else {
        // Add new project
        await axios.post(
          "http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/Project",
          projectData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        updatedProjects = [...fetchedProjects, { ...projectData }];
      }

      setProjects(updatedProjects);
      resetProjectData();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCopy = (index) => {
    const copiedProject = { ...projects[index], id: uuidv4() };
    const updatedProjects = [
      ...projects.slice(0, index + 1),
      copiedProject,
      ...projects.slice(index + 1),
    ];
    setProjects(updatedProjects);
  };

  //delete
  const handleDelete = async (index) => {
    try {
      // const accessToken =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZiOWIzNjg4LWIyODItNGNkNS1hNjhhLWRkYWY5YmUwMTUwNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJkZXYxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3Vic2NyaWJlciIsImV4cCI6MTY4OTk0MDUyMSwiaXNzIjoiaHR0cDovL2JpbGxib29rYXBpLWVudi0xLmViYS11ZTk0dHA0cy5hcC1zb3V0aC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tLyIsImF1ZCI6IjdjZGFkNDkxLTlhNzQtNDg0NC1iNjIyLTdhNmUxNjMwY2JjNCJ9.j2Qpqs3WGszSaiaGaidiwQn2TYHfR0HNH4I6wgcfNQE";

      const projectId = projects[index].id;

      await axios.delete(
        `http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/Project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updatedProjects = projects.filter((_, i) => i !== index);
      setProjects(updatedProjects);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const resetProjectData = () => {
    setProjectData({
      id: "",
      contractNo: "",
      contractDate: "",
      loiNo: null,
      loiDate: null,
      projectName: "",
      contractValidity: null,
      workCompletion: null,
      clientId: "",
    });
  };

  return (
    <div className="project-box-container">
      <div className="add-project-box">
        <button
          className="add-button"
          onClick={() =>
            setProjects([
              ...projects,
              {
                id: uuidv4(),
                contractNo: "",
                contractDate: "",
                loiNo: null,
                loiDate: null,
                projectName: "",
                contractValidity: null,
                workCompletion: null,
                clientId: "",
              },
            ])
          }
        >
          +
        </button>
      </div>

      {projects.map((project, index) => (
        <li key={project.id}>
          <div className="project-box" key={project.id}>
            {isEditMode && index === editIndex ? (
              <div className="project-edit">
                <div>
                  <label htmlFor="contractNo">Contract No.:</label>
                  <input
                    type="text"
                    id="contractNo"
                    name="contractNo"
                    value={projectData.contractNo}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="contractDate">Contract Date:</label>
                  <input
                    type="datetime-local"
                    id="contractDate"
                    name="contractDate"
                    value={projectData.contractDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="loiNo">LOI No.:</label>
                  <input
                    type="number"
                    id="loiNo"
                    name="loiNo"
                    value={projectData.loiNo || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="loiDate">LOI Date:</label>
                  <input
                    type="datetime-local"
                    id="loiDate"
                    name="loiDate"
                    value={projectData.loiDate || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="projectName">Project Name:</label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    value={projectData.projectName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="contractValidity">Contract Validity:</label>
                  <input
                    type="number"
                    id="contractValidity"
                    name="contractValidity"
                    value={projectData.contractValidity || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="workCompletion">Work Completion:</label>
                  <input
                    type="datetime-local"
                    id="workCompletion"
                    name="workCompletion"
                    value={projectData.workCompletion || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="clientId">Client ID:</label>
                  <input
                    type="text"
                    id="clientId"
                    name="clientId"
                    value={projectData.clientId}
                    onChange={handleChange}
                  />
                </div>
                <button onClick={handleSave}>Save</button>
              </div>
            ) : (
              <div className="project-display">
                <Link to={`/tablelist/${project.id}`} key={project.id}>
                  {/* <div>
                    <strong>ID:</strong> {project.id}
                  </div> */}
                  <div>
                    <strong>Contract No.:</strong> {project.contractNo}
                  </div>
                  {/* <div>
                    <strong>Contract Date:</strong> {project.contractDate}
                  </div>
                  <div>
                    <strong>LOI No.:</strong> {project.loiNo}
                  </div>
                  <div>
                    <strong>LOI Date:</strong> {project.loiDate}
                  </div> */}
                  <div>
                    <strong>Project Name:</strong> {project.projectName}
                  </div>
                  {/* <div>
                    <strong>Contract Validity:</strong>{" "}
                    {project.contractValidity}
                  </div>
                  <div>
                    <strong>Work Completion:</strong> {project.workCompletion}
                  </div>
                  <div>
                    <strong>Client ID:</strong> {project.clientId}
                  </div> */}
                </Link>
                <button onClick={() => handleCopy(index)}>Copy</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
                <button onClick={() => handleEdit(index)}>Edit</button>
              </div>
            )}
          </div>
        </li>
      ))}
    </div>
  );
};

export default ProjectPage;
