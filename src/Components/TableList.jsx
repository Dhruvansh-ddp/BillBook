// // used little different approach for practice, for fetching data
// // auth token is constant. Link page and page size is constant.
// // data will only be sent (put or post) if you click edit and then save.

import React, { useEffect, useState } from "react";
import "./TableList.css";
import { v4 as uuidv4 } from "uuid";
import { Link, useParams } from "react-router-dom";
import ClickedProject from "./ClickedProject";
import BillList from "./BillList";

const TableList = () => {
  const { projectId } = useParams();

  // for getting data by default if any
  const getDataUrl =
    // "http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/ContractItem/GetByProjectId?projectId=1125823d-b99b-4812-d164-08db6cd80e5c&page=1&pageSize=10";
    `http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/ContractItem/GetByProjectId?projectId=${projectId}&page=1&pageSize=10`;

  // for saving data we entered on page
  const saveDataUrl =
    "http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/ContractItem";
  const [contractItems, setContractItems] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZiOWIzNjg4LWIyODItNGNkNS1hNjhhLWRkYWY5YmUwMTUwNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJkZXYxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3Vic2NyaWJlciIsImV4cCI6MTY5MTIwMjY0NSwiaXNzIjoiaHR0cDovL2JpbGxib29rYXBpLWVudi0xLmViYS11ZTk0dHA0cy5hcC1zb3V0aC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tLyIsImF1ZCI6IjdjZGFkNDkxLTlhNzQtNDg0NC1iNjIyLTdhNmUxNjMwY2JjNCJ9.TgWBIyEZuRfOhGgnDSiIWgfOwFO2e3S8X-HAQTuqxNk";

  useEffect(() => {
    fetchData();
  }, [projectId]);

  // Fetch data on component
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

  const handleEdit = (index) => {
    const updatedData = [...contractItems];
    updatedData[index].isEditing = true;
    setContractItems(updatedData);

    // Check if the row exists in editedData
    const existingRowIndex = editedData.findIndex(
      (item) => item.id === updatedData[index].id
    );
    if (existingRowIndex !== -1) {
      // Update the existing row in editedData
      const updatedEditedData = [...editedData];
      updatedEditedData[existingRowIndex] = updatedData[index];
      setEditedData(updatedEditedData);
    } else {
      // Add the new row to editedData
      setEditedData([updatedData[index], ...editedData]);
    }
  };

  // Handle delete button click
  const handleDelete = async (index) => {
    console.log("Delete row at index:", index);

    const itemToDelete = contractItems[index];
    const head =
      index > 0
        ? contractItems[index - 1].id
        : "00000000-0000-0000-0000-000000000000";
    const tail =
      index < contractItems.length - 1
        ? contractItems[index + 1].id
        : "00000000-0000-0000-0000-000000000000";

    const deletePayload = {
      contractItemId: itemToDelete.id,
      head,
      tail,
    };

    console.log("Delete Payload:", deletePayload);

    try {
      const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(
        "http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/ContractItem",
        {
          method: "DELETE",
          headers,
          body: JSON.stringify(deletePayload),
        }
      );

      if (response.ok) {
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

  // copy button
  const handleCopy = (index) => {
    console.log("Copy row at index:", index);

    const copiedRow = { ...contractItems[index] };
    const newId = uuidv4();

    // Update the ID, head, and tail of the copied row
    copiedRow.id = newId;
    copiedRow.head =
      index > 0
        ? contractItems[index - 1].id
        : "00000000-0000-0000-0000-000000000000";
    copiedRow.tail =
      index < contractItems.length - 1
        ? contractItems[index + 1].id
        : "00000000-0000-0000-0000-000000000000";

    const updatedData = [...contractItems];
    updatedData.splice(index + 1, 0, copiedRow);
    setContractItems(updatedData);

    // Add the copied row to the editedData state
    setEditedData([...editedData, copiedRow]);
  };

  // add row
  const handleAddRow = (index) => {
    const newId = uuidv4();
    console.log("new id: ", newId);
    const newRowIndex = index + 1;

    const headId =
      index >= 0
        ? contractItems[index].id
        : "00000000-0000-0000-0000-000000000000";
    const tailId =
      index + 1 < contractItems.length
        ? contractItems[index + 1].id
        : "00000000-0000-0000-0000-000000000000";

    const newEditedRow = {
      id: newId, // Assign the newId to the id property
      sorNo: 0,
      item: "string",
      hsn: 0,
      poQty: 0,
      stdUnitId: 0,
      unit: "string",
      rate: 0,
      // projectId: "1125823d-b99b-4812-d164-08db6cd80e5c",
      projectId: projectId,
      head: headId,
      tail: tailId,
    };

    const updatedData = [
      ...contractItems.slice(0, newRowIndex),
      newEditedRow,
      ...contractItems.slice(newRowIndex),
    ];

    setContractItems(updatedData);
    setEditedData([...editedData, newEditedRow]); // Include the new row in editedData
  };

  // Handle input change
  ////old
  const handleInputChange = (e, index, field) => {
    const { value } = e.target;

    const updatedRow = { ...editedData[index], [field]: value };
    const updatedData = [...editedData];
    updatedData[index] = updatedRow;

    setEditedData(updatedData);
  };

  const handleCancelEdit = (index) => {
    const updatedData = [...contractItems];
    updatedData[index].isEditing = false;
    setContractItems(updatedData);
    setEditedData(editedData.filter((item, i) => i !== index));
  };

  // // PUT request and sortedafter logic

  const getSortedAfter = (rowId) => {
    const rowIndex = contractItems.findIndex((item) => item.id === rowId);
    if (rowIndex > 0) {
      return contractItems[rowIndex - 1].id; // Return the id of the row above
    } else {
      return "00000000-0000-0000-0000-000000000000"; // Return "00000000-0000-0000-0000-000000000000" if no row above
    }
  };

  // // //  Only post
  const postData = async (newRow) => {
    try {
      const formattedData = {
        contractItemDTO: {
          id: newRow.id,
          sorNo: newRow.sorNo,
          item: newRow.item,
          hsn: newRow.hsn,
          poQty: newRow.poQty,
          stdUnitId: newRow.stdUnitId,
          unit: newRow.unit,
          rate: newRow.rate,
          projectId: "1125823d-b99b-4812-d164-08db6cd80e5c",
          sortedAfter: newRow.head,
        },
        head: newRow.head,
        tail: newRow.tail,
      };

      if (!newRow.id) {
        formattedData.contractItemDTO.head =
          newRow.index === 0
            ? "00000000-0000-0000-0000-000000000000"
            : contractItems[newRow.index - 1].id;
        formattedData.contractItemDTO.tail =
          newRow.index === contractItems.length - 1
            ? "00000000-0000-0000-0000-000000000000"
            : contractItems[newRow.index + 1].id;
      }

      console.log("Request Payload:", formattedData);

      return formattedData; // Return the formatted data
    } catch (error) {
      console.error("Format error:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  // //
  // //put
  const putData = async (updatedRow) => {
    try {
      const formattedData = {
        id: updatedRow.id,
        sorNo: parseInt(updatedRow.sorNo),
        item: updatedRow.item,
        hsn: parseInt(updatedRow.hsn),
        poQty: parseInt(updatedRow.poQty),
        stdUnitId: updatedRow.stdUnitId,
        unit: updatedRow.unit,
        rate: parseInt(updatedRow.rate),
        projectId: updatedRow.projectId,
        sortedAfter: getSortedAfter(updatedRow.id), // Set sortedAfter based on the row's position
      };

      console.log("PUT Request Payload:", formattedData);

      return formattedData; // Return the formatted data
    } catch (error) {
      console.error("Format error:", error);
      throw error; // Re-throw the error to be handled by the caller
    }
  };

  ///repeating function for fetching temp. you can use efficiently later on
  // Create a separate array to store existing item IDs

  const existingItemIds = [];

  // Fetch backend data and populate existingItemIds array
  const fetchBackendData = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };

      const response = await fetch(getDataUrl, { headers });
      if (response.ok) {
        const data = await response.json();

        // Check if the 'items' property exists and is an array
        if (Array.isArray(data.items)) {
          // If 'items' is an array, extract the 'id' properties and add them to existingItemIds
          existingItemIds.push(...data.items.map((item) => item.id));
        } else {
          console.error("Invalid data format: 'items' is not an array.");
        }

        console.log("Existing Item IDs:", existingItemIds);
      } else {
        console.error("Failed to fetch backend data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching backend data:", error);
    }
  };

  // Call the function to fetch backend data and populate existingItemIds array
  fetchBackendData();

  const handleSaveEdit = async (index) => {
    try {
      const updatedData = [...contractItems];
      updatedData[index] = {
        ...updatedData[index],
        ...editedData[index],
        isEditing: false,
      };

      console.log("updated data index:", updatedData[index]);

      const item = updatedData[index];
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      };

      // Check if the item ID exists in existingItemIds array
      if (existingItemIds.includes(item.id)) {
        // Item exists in backend data, use PUT request
        const formattedData = await putData(item);
        const putResponse = await fetch(saveDataUrl, {
          method: "PUT",
          headers,
          body: JSON.stringify(formattedData),
        });

        if (putResponse.ok) {
          console.log("Item updated successfully.");
        } else {
          console.error("PUT request failed:", putResponse.statusText);
        }
      } else {
        // Item doesn't exist in backend data, use POST request
        const formattedData = await postData(item);
        const postResponse = await fetch(saveDataUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(formattedData),
        });

        if (postResponse.ok) {
          console.log("Item created successfully.");
          // Update existingItemIds array with the new item's ID
          existingItemIds.push(item.id);
        } else {
          console.error("POST request failed:", postResponse.statusText);
        }
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
        <>
          <ClickedProject />

          <Link to={`/billlist/${projectId}`}>
            <button>Go to Bill List</button>
          </Link>

          <table>
            <thead>
              <tr>
                {/* comment id  */}
                {/* <th>ID</th> */}
                <th>sorNo</th>
                <th>Item</th>
                <th>HSN</th>
                <th>POQty</th>
                <th>StdUnitId</th>
                <th>Unit</th>
                <th>Rate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contractItems.map((item, index) => (
                <tr className="tr-rows" key={index}>
                  {/* <td>
                  <div className="cell-content">{item.id}</div>
                </td> */}
                  <td>
                    <div className="cell-content">
                      {item.isEditing ? (
                        <input
                          type="number"
                          value={editedData[index]?.sorNo || ""}
                          onChange={(e) => handleInputChange(e, index, "sorNo")}
                        />
                      ) : (
                        item.sorNo
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      {item.isEditing ? (
                        <input
                          type="text"
                          value={editedData[index]?.item || ""}
                          onChange={(e) => handleInputChange(e, index, "item")}
                        />
                      ) : (
                        item.item
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      {item.isEditing ? (
                        <input
                          type="number"
                          value={editedData[index]?.hsn || ""}
                          onChange={(e) => handleInputChange(e, index, "hsn")}
                        />
                      ) : (
                        item.hsn
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="cell-content">
                      {item.isEditing ? (
                        <input
                          type="number"
                          value={editedData[index]?.poQty || ""}
                          onChange={(e) => handleInputChange(e, index, "poQty")}
                        />
                      ) : (
                        item.poQty
                      )}
                    </div>
                  </td>
                  <td>
                    {" "}
                    <div className="cell-content">
                      {item.isEditing ? (
                        <input
                          type="number"
                          value={editedData[index]?.stdUnitId || ""}
                          onChange={(e) =>
                            handleInputChange(e, index, "stdUnitId")
                          }
                        />
                      ) : (
                        item.stdUnitId
                      )}
                    </div>
                  </td>
                  <td>
                    {" "}
                    <div className="cell-content">
                      {item.isEditing ? (
                        <input
                          type="text"
                          value={editedData[index]?.unit || ""}
                          onChange={(e) => handleInputChange(e, index, "unit")}
                        />
                      ) : (
                        item.unit
                      )}
                    </div>
                  </td>
                  <td>
                    {" "}
                    <div className="cell-content">
                      {item.isEditing ? (
                        <input
                          type="number"
                          value={editedData[index]?.rate || ""}
                          onChange={(e) => handleInputChange(e, index, "rate")}
                        />
                      ) : (
                        item.rate
                      )}
                    </div>
                  </td>
                  {/* <td>{item.sortedAfter}</td>
                <td>{item.head}</td>
                <td>{item.tail}</td> */}
                  <td>
                    {" "}
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
                          <button onClick={() => handleEdit(index)}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(index)}>
                            Delete
                          </button>
                          <button onClick={() => handleCopy(index)}>
                            Copy
                          </button>
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
        </>
      )}
      <button onClick={handleAddRow}>Add Row</button>
      {/* <button onClick={handleSave}>Save</button> */}
    </div>
  );
};

export default TableList;
