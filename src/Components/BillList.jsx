// Bill ID as params left

import React, { useEffect, useState } from "react";
import "./TableList.css";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";

const BillList = () => {
  const { projectId } = useParams();

  // API endpoint URLs
  const getDataUrl =
    // "http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/Bill/GetByProjectId?projectId=1125823d-b99b-4812-d164-08db6cd80e5c&page=1&pageSize=10";
    `http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/Bill/GetByProjectId?projectId=${projectId}&page=1&pageSize=10`;

  const saveDataUrl =
    "http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/Bill";

  // State variables
  const [contractItems, setContractItems] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample authToken for demonstration purposes
  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZiOWIzNjg4LWIyODItNGNkNS1hNjhhLWRkYWY5YmUwMTUwNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJkZXYxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3Vic2NyaWJlciIsImV4cCI6MTY5MTIwMjY0NSwiaXNzIjoiaHR0cDovL2JpbGxib29rYXBpLWVudi0xLmViYS11ZTk0dHA0cy5hcC1zb3V0aC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tLyIsImF1ZCI6IjdjZGFkNDkxLTlhNzQtNDg0NC1iNjIyLTdhNmUxNjMwY2JjNCJ9.TgWBIyEZuRfOhGgnDSiIWgfOwFO2e3S8X-HAQTuqxNk";

  // Fetch data from the API
  const fetchData = async () => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const response = await fetch(getDataUrl, { headers });
      const data = await response.json();
      setContractItems(
        data.items.map((item) => ({ ...item, isEditing: false }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle editing of a row
  //   const handleEdit = (index) => {
  //     const updatedData = [...contractItems];
  //     updatedData[index].isEditing = true;
  //     setContractItems(updatedData);

  //     // Check if the row exists in editedData
  //     const existingRowIndex = editedData.findIndex(
  //       (item) => item.id === updatedData[index].id
  //     );
  //     if (existingRowIndex !== -1) {
  //       // Update the existing row in editedData
  //       const updatedEditedData = [...editedData];
  //       updatedEditedData[existingRowIndex] = {
  //         ...updatedData[index], // Include the projectId for the row being edited
  //       };

  //       setEditedData(updatedEditedData);
  //     } else {
  //       // Add the new row to editedData
  //       setEditedData([...editedData, updatedData[index]]);
  //     }
  //   };

  const handleEdit = (index) => {
    const updatedData = [...contractItems];
    updatedData[index].isEditing = true;
    setContractItems(updatedData);

    // Copy the data of the row being edited
    const editedRowData = { ...updatedData[index] };

    // Check if the row exists in editedData
    const existingRowIndex = editedData.findIndex(
      (item) => item.id === updatedData[index].id
    );
    if (existingRowIndex !== -1) {
      // Update the existing row in editedData
      const updatedEditedData = [...editedData];
      updatedEditedData[existingRowIndex] = editedRowData;
      setEditedData(updatedEditedData);
    } else {
      // Add the new row to editedData
      setEditedData([...editedData, editedRowData]);
    }
  };

  // Handle deletion of a row
  const handleDelete = async (index) => {
    console.log("Delete row at index:", index);

    // Delete the row from the API
    try {
      const itemToDelete = contractItems[index];

      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };

      const deletePayload = {
        contractItemId: itemToDelete.id,
      };

      const response = await fetch(saveDataUrl, {
        method: "DELETE",
        headers,
        body: JSON.stringify(deletePayload),
      });

      if (response.ok || response.status === 204) {
        // Data deleted successfully
        const updatedData = [...contractItems];
        updatedData.splice(index, 1);
        setContractItems(updatedData);
      } else {
        // Handle delete error
        console.error("Delete error:", response.statusText);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Handle copying a row
  const handleCopy = (index) => {
    console.log("Copy row at index:", index);

    // Copy the row and assign a new ID
    const copiedRow = { ...contractItems[index] };
    const newId = uuidv4();
    copiedRow.id = newId;

    const updatedData = [...contractItems];
    updatedData.splice(index + 1, 0, copiedRow);
    setContractItems(updatedData);

    // Add the copied row to the editedData state
    setEditedData([...editedData, copiedRow]);
  };

  // Handle adding a new row
  const handleAddRow = (index) => {
    const newId = uuidv4();
    console.log("new id: ", newId);
    const newRowIndex = index + 1;

    // Define the data for the new row
    const newEditedRow = {
      id: newId, // Assign the newId to the id property
      invoiceNo: "string",
      name: "string",
      invoiceDate: "2023-07-23T12:59:56.975", // Date and time in the correct format
      typeBill: 1,
      status: 1,
      projectId: "1125823d-b99b-4812-d164-08db6cd80e5c",
    };

    const updatedData = [
      ...contractItems.slice(0, newRowIndex),
      newEditedRow,
      ...contractItems.slice(newRowIndex),
    ];

    setContractItems(updatedData);
    setEditedData([...editedData, newEditedRow]); // Include the new row in editedData
  };

  // Handle input change during editing
  const handleInputChange = (e, index, field) => {
    const { value } = e.target;

    const updatedRow = { ...editedData[index], [field]: value };
    const updatedData = [...editedData];
    updatedData[index] = updatedRow;

    setEditedData(updatedData);
  };

  // Handle canceling editing of a row
  const handleCancelEdit = (index) => {
    const updatedData = [...contractItems];
    updatedData[index].isEditing = false;
    setContractItems(updatedData);
    setEditedData(editedData.filter((item, i) => i !== index));
  };

  // Handle saving the changes made to a row
  const handleSaveEdit = async (index) => {
    console.log("Save edited row at index:", index);

    const updatedData = [...contractItems];
    updatedData[index] = {
      ...updatedData[index], // Preserve the existing properties of the row
      ...editedData[index], // Include the edited properties
      isEditing: false, // Set isEditing to false
    };

    try {
      const item = updatedData[index];

      const formattedData = {
        id: item.id,
        invoiceNo: item.invoiceNo,
        name: item.name,
        invoiceDate: item.invoiceDate,
        typeBill: parseInt(item.typeBill),
        status: parseInt(item.status),
        // projectId: "1125823d-b99b-4812-d164-08db6cd80e5c",
        projectId: item.projectId,
      };

      console.log("Request Payload:", formattedData);

      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(saveDataUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(formattedData),
      });

      console.log("Response:", response);

      if (response.ok || response.status === 204) {
        // Data saved successfully
        // Update contractItems state and remove the saved row from editedData
        setContractItems(updatedData);

        const updatedEditedData = [...editedData];
        updatedEditedData.splice(index, 1);
        setEditedData(updatedEditedData);
      } else {
        // Handle save error
        console.error("Save error:", response.statusText);
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div className="table-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>InvoiceNO</th>
              <th>Name</th>
              <th>invoiceDate</th>
              <th>TypeBill</th>
              <th>Status</th>
              <th>ProjectId</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contractItems.map((item, index) => (
              <tr className="tr-rows" key={index}>
                <td>
                  <div className="cell-content">{item.id}</div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="text"
                        value={editedData[index]?.invoiceNo || ""}
                        onChange={(e) =>
                          handleInputChange(e, index, "invoiceNo")
                        }
                      />
                    ) : (
                      item.invoiceNo
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="text"
                        value={editedData[index]?.name || ""}
                        onChange={(e) => handleInputChange(e, index, "name")}
                      />
                    ) : (
                      item.name
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="datetime-local"
                        value={editedData[index]?.invoiceDate || ""}
                        onChange={(e) =>
                          handleInputChange(e, index, "invoiceDate")
                        }
                      />
                    ) : (
                      item.invoiceDate
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="number"
                        value={editedData[index]?.typeBill || ""}
                        onChange={(e) =>
                          handleInputChange(e, index, "typeBill")
                        }
                      />
                    ) : (
                      item.typeBill
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="number"
                        value={editedData[index]?.status || ""}
                        onChange={(e) => handleInputChange(e, index, "status")}
                      />
                    ) : (
                      item.status
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="text"
                        value={editedData[index]?.projectId || ""}
                        onChange={(e) =>
                          handleInputChange(e, index, "projectId")
                        }
                      />
                    ) : (
                      item.projectId
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <>
                        <button onClick={() => handleSaveEdit(index)}>
                          Save
                        </button>
                        <button onClick={() => handleCancelEdit(index)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button onClick={() => handleDelete(index)}>
                          Delete
                        </button>
                        <button onClick={() => handleCopy(index)}>Copy</button>
                        <button onClick={() => handleAddRow(index)}>
                          Add Row
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleAddRow}>Add Row</button>
    </div>
  );
};

export default BillList;
