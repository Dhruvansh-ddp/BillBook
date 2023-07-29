// // need to add params
// // authtoken constant

import React, { useEffect, useState, useCallback } from "react";
import "./TableList.css";
import { v4 as uuidv4 } from "uuid";
// import { useParams } from "react-router-dom";

const Measurement = () => {
  //   const { projectId } = useParams();

  // for getting data by default if any
  const getDataUrl =
    // `http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/ContractItem/GetByProjectId?projectId=${projectId}&page=1&pageSize=10`;
    `http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/MeasurementBook/GetByBillId?billId=01da9439-3719-4b63-0d21-08db8b7cc0af&page=1&pageSize=10`;

  // for saving data we entered on page
  const saveDataUrl =
    "http://billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/MeasurementBook/";

  const [measurementBook, setmeasurementBook] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImZiOWIzNjg4LWIyODItNGNkNS1hNjhhLWRkYWY5YmUwMTUwNyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJkZXYxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3Vic2NyaWJlciIsImV4cCI6MTY5MTIwMjY0NSwiaXNzIjoiaHR0cDovL2JpbGxib29rYXBpLWVudi0xLmViYS11ZTk0dHA0cy5hcC1zb3V0aC0xLmVsYXN0aWNiZWFuc3RhbGsuY29tLyIsImF1ZCI6IjdjZGFkNDkxLTlhNzQtNDg0NC1iNjIyLTdhNmUxNjMwY2JjNCJ9.TgWBIyEZuRfOhGgnDSiIWgfOwFO2e3S8X-HAQTuqxNk";

  // Fetch data on component

  const fetchData = useCallback(async () => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    try {
      const response = await fetch(getDataUrl, { headers });
      const data = await response.json();
      setmeasurementBook(
        data.items.map((item) => ({ ...item, isEditing: false }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [getDataUrl, authToken]); // Include dependencies in the useCallback dependency array

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // const handleEdit = (index) => {
  //   const updatedData = [...measurementBook];
  //   updatedData[index].isEditing = true;
  //   setmeasurementBook(updatedData);
  //   setEditedData([updatedData[index], ...editedData]); // Replace the existing editedData with the selected row
  // };

  const handleEdit = (index) => {
    const updatedData = [...measurementBook];
    updatedData[index].isEditing = true;
    setmeasurementBook(updatedData);

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

    const itemToDelete = measurementBook[index];
    const head =
      index > 0
        ? measurementBook[index - 1].id
        : "00000000-0000-0000-0000-000000000000";
    const tail =
      index < measurementBook.length - 1
        ? measurementBook[index + 1].id
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
        "billbookapi-env-1.eba-ue94tp4s.ap-south-1.elasticbeanstalk.com/api/MeasurementBook",
        {
          method: "DELETE",
          headers,
          body: JSON.stringify(deletePayload),
        }
      );

      if (response.ok) {
        // Data deleted successfully
        const updatedData = [...measurementBook];
        updatedData.splice(index, 1);
        setmeasurementBook(updatedData);
      } else {
        // Handle delete error
        console.error("Delete error:", response.statusText);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleCopy = (index) => {
    console.log("Copy row at index:", index);

    const copiedRow = { ...measurementBook[index] };
    const newId = uuidv4();

    // Update the ID, head, and tail of the copied row
    copiedRow.id = newId;
    copiedRow.head =
      index > 0
        ? measurementBook[index - 1].id
        : "00000000-0000-0000-0000-000000000000";
    copiedRow.tail =
      index < measurementBook.length - 1
        ? measurementBook[index + 1].id
        : "00000000-0000-0000-0000-000000000000";

    const updatedData = [...measurementBook];
    updatedData.splice(index + 1, 0, copiedRow);
    setmeasurementBook(updatedData);

    // Add the copied row to the editedData state
    setEditedData([...editedData, copiedRow]);
  };

  const handleAddRow = (index) => {
    const newId = uuidv4();
    console.log("new id: ", newId);
    const newRowIndex = index + 1;

    const headId =
      index >= 0
        ? measurementBook[index].id
        : "00000000-0000-0000-0000-000000000000";
    const tailId =
      index + 1 < measurementBook.length
        ? measurementBook[index + 1].id
        : "00000000-0000-0000-0000-000000000000";

    const newEditedRow = {
      id: newId, // Assign the newId to the id property
      // id: null,
      description: "string",
      no: 1,
      l: 0,
      b: 0,
      d_H: 0,
      subtotal: 0,
      remark: "string",
      contractItemId: "f55891a2-092a-4b0b-ab0c-21f54f3eccbd",
      tags: "string",
      billId: "01da9439-3719-4b63-0d21-08db8b7cc0af",
      // projectId: "1125823d-b99b-4812-d164-08db6cd80e5c",
      //   projectId: projectId,
      head: headId,
      tail: tailId,
    };
    // const newEditedRow = {
    //   measurementBookDTO: {
    //     id: newId,
    //     description: "string",
    //     no: 1,
    //     l: 0,
    //     b: 0,
    //     d_H: 0,
    //     subtotal: 0,
    //     remark: "string",
    //     contractItemId: "f55891a2-092a-4b0b-ab0c-21f54f3eccbd",
    //     tags: "string",
    //     billId: "01da9439-3719-4b63-0d21-08db8b7cc0af",
    //   },
    //   head: headId,
    //   tail: tailId,
    // };

    const updatedData = [
      ...measurementBook.slice(0, newRowIndex),
      newEditedRow,
      ...measurementBook.slice(newRowIndex),
    ];

    setmeasurementBook(updatedData);
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
    const updatedData = [...measurementBook];
    updatedData[index].isEditing = false;
    setmeasurementBook(updatedData);
    setEditedData(editedData.filter((item, i) => i !== index));
  };

  // // PUT request and sortedafter logic

  //   const getSortedAfter = (rowId) => {
  //     const rowIndex = measurementBook.findIndex((item) => item.id === rowId);
  //     if (rowIndex > 0) {
  //       return measurementBook[rowIndex - 1].id; // Return the id of the row above
  //     } else {
  //       return "00000000-0000-0000-0000-000000000000"; // Return "00000000-0000-0000-0000-000000000000" if no row above
  //     }
  //   };

  // // //  Only post
  // const postData = async (newRow) => {
  //   try {
  //     const formattedData = {
  //       measurementBookDTO: {
  //         id: newRow.id,
  //         sorNo: newRow.sorNo,
  //         item: newRow.item,
  //         hsn: newRow.hsn,
  //         poQty: newRow.poQty,
  //         stdUnitId: newRow.stdUnitId,
  //         unit: newRow.unit,
  //         rate: newRow.rate,
  //         projectId: "1125823d-b99b-4812-d164-08db6cd80e5c",
  //         sortedAfter: newRow.head,
  //       },
  //       head: newRow.head,
  //       tail: newRow.tail,
  //     };

  //     if (!newRow.id) {
  //       formattedData.measurementBookDTO.head =
  //         newRow.index === 0
  //           ? "00000000-0000-0000-0000-000000000000"
  //           : measurementBook[newRow.index - 1].id;
  //       formattedData.measurementBookDTO.tail =
  //         newRow.index === measurementBook.length - 1
  //           ? "00000000-0000-0000-0000-000000000000"
  //           : measurementBook[newRow.index + 1].id;
  //     }

  //     console.log("Request Payload:", formattedData);

  //     return formattedData; // Return the formatted data
  //   } catch (error) {
  //     console.error("Format error:", error);
  //     throw error; // Re-throw the error to be handled by the caller
  //   }
  // };

  // //
  // //put
  // const putData = async (updatedRow) => {
  //   try {
  //     const formattedData = {
  //       id: updatedRow.id,
  //       sorNo: updatedRow.sorNo,
  //       item: updatedRow.item,
  //       hsn: updatedRow.hsn,
  //       poQty: updatedRow.poQty,
  //       stdUnitId: updatedRow.stdUnitId,
  //       unit: updatedRow.unit,
  //       rate: updatedRow.rate,
  //       projectId: updatedRow.projectId,
  //       sortedAfter: getSortedAfter(updatedRow.id), // Set sortedAfter based on the row's position
  //     };

  //     console.log("PUT Request Payload:", formattedData);

  //     return formattedData; // Return the formatted data
  //   } catch (error) {
  //     console.error("Format error:", error);
  //     throw error; // Re-throw the error to be handled by the caller
  //   }
  // };

  // // // put and post
  // //
  // //
  // const handleSaveEdit = async (index) => {
  //   try {
  //     const updatedData = [...measurementBook];
  //     updatedData[index] = {
  //       ...updatedData[index],
  //       ...editedData[index],
  //       isEditing: false,
  //     };

  //     console.log("updated data index:", updatedData[index]);

  //     const item = updatedData[index];
  //     const existingItemUrl = `${getDataUrl} `;
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };

  //     // Fetch the backend data to compare the id
  //     const response = await fetch(existingItemUrl, { headers });

  //     if (response.ok) {
  //       // Item exists in backend data, use PUT request
  //       const formattedData = await putData(item);
  //       const putResponse = await fetch(saveDataUrl, {
  //         method: "PUT",
  //         headers,
  //         body: JSON.stringify(formattedData),
  //       });

  //       if (putResponse.ok) {
  //         console.log("Item updated successfully.");
  //       } else {
  //         console.error("PUT request failed:", putResponse.statusText);
  //       }
  //     } else {
  //       // Item doesn't exist in backend data, use POST request
  //       const formattedData = await postData(item);
  //       const postResponse = await fetch(saveDataUrl, {
  //         method: "POST",
  //         headers,
  //         body: JSON.stringify(formattedData),
  //       });

  //       if (postResponse.ok) {
  //         console.log("Item created successfully.");
  //       } else {
  //         console.error("POST request failed:", postResponse.statusText);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Save error:", error);
  //   }
  // };

  ////1.0
  // const handleSaveEdit = async (index) => {
  //   const updatedData = [...measurementBook];
  //   updatedData[index] = {
  //     ...updatedData[index], // Preserve the existing properties of the row
  //     ...editedData[index], // Include the edited properties
  //     isEditing: false, // Set isEditing to false
  //   };

  //   console.log("updated data index:", updatedData[index]);

  //   try {
  //     const item = updatedData[index];

  //     // Fetch the existing item from the backend by ID
  //     const existingItemUrl = `${getDataUrl}`;
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //     };

  //     const response = await fetch(existingItemUrl, { headers });
  //     const existingItemData = await response.json();

  //     console.log("existing itemsdata: ", existingItemData);

  //     if (response.ok && existingItemData) {
  //       // Data already exists, send a PUT request
  //       await putData(item);
  //     } else {
  //       // Data is new, send a POST request
  //       await postData(updatedData[index], index);
  //     }
  //   } catch (error) {
  //     console.error("Save error:", error);
  //   }
  // };

  //// 1.5
  // const handleSaveEdit = async (index) => {
  //   try {
  //     const updatedData = [...measurementBook];
  //     updatedData[index] = {
  //       ...updatedData[index],
  //       ...editedData[index],
  //       isEditing: false,
  //     };

  //     console.log("updated data index:", updatedData[index]);

  //     const item = updatedData[index];
  //     let response;

  //     if (item.id) {
  //       const existingItemUrl = `${getDataUrl}/${item.id}`;
  //       const headers = {
  //         Authorization: `Bearer ${authToken}`,
  //       };

  //       response = await fetch(existingItemUrl, { headers });
  //     }

  //     if (response?.ok) {
  //       const formattedData = await putData(item);
  //       await putData(formattedData); // Remove this line to avoid duplication
  //     } else {
  //       const formattedData = await postData(item);
  //       await postData(formattedData); // Remove this line to avoid duplication
  //     }
  //   } catch (error) {
  //     console.error("Save error:", error);
  //   }
  // };

  ////2
  // const handleSaveEdit = async (index) => {
  //   try {
  //     const updatedData = [...measurementBook];
  //     updatedData[index] = {
  //       ...updatedData[index], // Preserve the existing properties of the row
  //       ...editedData[index], // Include the edited properties
  //       isEditing: false, // Set isEditing to false
  //     };

  //     console.log("updated data index:", updatedData[index]);

  //     const item = updatedData[index];
  //     let response;

  //     // Determine if the data already exists based on the ID
  //     if (item.id) {
  //       const existingItemUrl = `${getDataUrl}/${item.id}`;
  //       const headers = {
  //         Authorization: `Bearer ${authToken}`,
  //       };

  //       response = await fetch(existingItemUrl, { headers });
  //     }

  //     if (response?.ok) {
  //       // Data already exists, send a PUT request
  //       const formattedData = await putData(item);
  //       await putData(formattedData);
  //     } else {
  //       // Data is new, send a POST request
  //       const formattedData = await postData(item);
  //       await postData(formattedData, index);
  //     }
  //   } catch (error) {
  //     console.error("Save error:", error);
  //   }
  // };

  // const sendPutRequest = async (formattedData) => {
  //   try {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //       "Content-Type": "application/json",
  //     };

  //     console.log("PUT Request Payload:", formattedData);
  //     console.log("PUT Request Headers:", headers);

  //     const response = await fetch(`${saveDataUrl}`, {
  //       method: "PUT",
  //       headers,
  //       body: JSON.stringify(formattedData),
  //     });

  //     if (response.ok || response.status === 204) {
  //       // Data updated successfully
  //       // Update measurementBook state and remove the updated row from editedData
  //       const updatedmeasurementBook = measurementBook.map((item) =>
  //         item.id === formattedData.id ? formattedData : item
  //       );
  //       setmeasurementBook(updatedmeasurementBook);

  //       const updatedEditedData = editedData.filter(
  //         (item) => item.id !== formattedData.id
  //       );
  //       setEditedData(updatedEditedData);
  //     } else {
  //       // Handle update error
  //       const errorResponse = await response.json(); // Parse the error response as JSON
  //       console.error("Update error:", errorResponse);
  //     }
  //   } catch (error) {
  //     console.error("Update error:", error);
  //   }
  // };

  // const sendPostRequest = async (formattedData, index) => {
  //   try {
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //       "Content-Type": "application/json",
  //     };

  //     console.log("POST Request Payload:", formattedData);
  //     console.log("POST Request Headers:", headers);

  //     const response = await fetch(`${saveDataUrl}`, {
  //       method: "POST",
  //       headers,
  //       body: JSON.stringify(formattedData),
  //     });

  //     if (response.ok || response.status === 204) {
  //       // Data saved successfully
  //       // Update measurementBook state and remove the saved row from editedData
  //       const updatedmeasurementBook = [...measurementBook];
  //       updatedmeasurementBook[index] = {
  //         ...updatedmeasurementBook[index], // Preserve the existing properties of the row
  //         ...formattedData.measurementBookDTO, // Include the new properties from the response
  //         isEditing: false, // Set isEditing to false
  //       };

  //       setmeasurementBook(updatedmeasurementBook);

  //       const updatedEditedData = [...editedData];
  //       updatedEditedData.splice(index, 1);
  //       setEditedData(updatedEditedData);
  //     } else {
  //       // Handle save error
  //       const errorResponse = await response.json(); // Parse the error response as JSON
  //       console.error("Save error:", errorResponse);
  //     }
  //   } catch (error) {
  //     console.error("Save error:", error);
  //   }
  // };

  // // // post working
  const handleSaveEdit = async (index) => {
    console.log("Save edited row at index:", index);

    const updatedData = [...measurementBook];
    updatedData[index] = {
      ...updatedData[index], // Preserve the existing properties of the row
      ...editedData[index], // Include the edited properties
      isEditing: false, // Set isEditing to false
    };

    try {
      const item = updatedData[index];

      const formattedData = {
        measurementBookDTO: {
          id: item.id,
          description: item.description,
          no: parseInt(item.no),
          l: parseInt(item.l),
          b: parseInt(item.b),
          d_H: parseInt(item.d_H),
          subtotal: parseInt(item.subtotal),
          remark: item.remark,
          // projectId: "1125823d-b99b-4812-d164-08db6cd80e5c",
          contractItemId: item.contractItemId,
          tags: item.tags,
          billId: "01da9439-3719-4b63-0d21-08db8b7cc0af",
          // head: item.head,
          // tail: item.tail,
        },
        head: item.head,
        tail: item.tail,
      };

      if (!item.id) {
        formattedData.measurementBookDTO.head =
          index === 0
            ? "00000000-0000-0000-0000-000000000000"
            : updatedData[index - 1].id;
        formattedData.measurementBookDTO.tail =
          index === updatedData.length - 1
            ? "00000000-0000-0000-0000-000000000000"
            : updatedData[index + 1].id;
      }

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

      console.log(response);

      if (response.ok || response.status === 204) {
        // Data saved successfully
        // Update measurementBook state and remove the saved row from editedData
        setmeasurementBook(updatedData);

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

  //// no use for now
  // const handleSave = async () => {
  //   const newId = uuidv4();
  //   try {
  //     const formattedData = editedData.map((item, index) => {
  //       const newItem = {
  //         measurementBookDTO: {
  //           id: item.id || newId,
  //           sorNo: item.sorNo ?? index + 1,
  //           item: item.item,
  //           hsn: item.hsn,
  //           poQty: item.poQty,
  //           stdUnitId: item.stdUnitId,
  //           unit: item.unit,
  //           rate: item.rate,
  //           projectId: "1125823d-b99b-4812-d164-08db6cd80e5c",
  //           sortedAfter: item.head,
  //         },
  //         head: item.head,
  //         tail: item.tail,
  //       };

  //       if (!item.id) {
  //         newItem.measurementBookDTO.head =
  //           index === 0
  //             ? "00000000-0000-0000-0000-000000000000"
  //             : editedData[index - 1]?.id;
  //         newItem.measurementBookDTO.tail =
  //           index === editedData.length - 1
  //             ? "00000000-0000-0000-0000-000000000000"
  //             : editedData[index + 1]?.id;
  //       }

  //       return newItem;
  //     });
  //     console.log("Request Payload:", formattedData);
  //     //
  //     const headers = {
  //       Authorization: `Bearer ${authToken}`,
  //       "Content-Type": "application/json",
  //     };

  //     // console.log("Request Headers:", headers);
  //     console.log("Sending request with data:", JSON.stringify(formattedData)); // Log the request data

  //     //
  //     const response = await fetch(saveDataUrl, {
  //       method: "POST",
  //       headers,
  //       body: JSON.stringify(formattedData),
  //     });

  //     console.log("Response Data:", responseData);
  //     const responseData = await response.json();

  //     if (response.ok) {
  //       // Data saved successfully
  //       // Update measurementBook state and clear editedData
  //       setmeasurementBook(
  //         measurementBook.map((item) => ({ ...item, isEditing: false }))
  //       );
  //       setEditedData([]);
  //     } else {
  //       // Handle save error
  //       console.error("Save error:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Save error:", error);
  //   }
  // };

  return (
    <div className="table-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {/* comment id  */}
              <th>ID</th>
              <th>Description</th>
              <th>no</th>
              <th>l</th>
              <th>b</th>
              <th>d_H</th>
              <th>subtotal</th>
              <th>remark</th>
              <th>contractItemId</th>
              <th>tags</th>
              <th>billId</th>
            </tr>
          </thead>
          <tbody>
            {measurementBook.map((item, index) => (
              <tr className="tr-rows" key={index}>
                <td>
                  {/* ID  */}
                  <div className="cell-content">{item.id}</div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="text"
                        value={editedData[index]?.description || ""}
                        onChange={(e) =>
                          handleInputChange(e, index, "description")
                        }
                      />
                    ) : (
                      item.description
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="number"
                        value={editedData[index]?.no || ""}
                        onChange={(e) => handleInputChange(e, index, "no")}
                      />
                    ) : (
                      item.no
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="number"
                        value={editedData[index]?.l || ""}
                        onChange={(e) => handleInputChange(e, index, "l")}
                      />
                    ) : (
                      item.l
                    )}
                  </div>
                </td>
                <td>
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="number"
                        value={editedData[index]?.b || ""}
                        onChange={(e) => handleInputChange(e, index, "b")}
                      />
                    ) : (
                      item.b
                    )}
                  </div>
                </td>
                <td>
                  {" "}
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="number"
                        value={editedData[index]?.d_H || ""}
                        onChange={(e) => handleInputChange(e, index, "d_H")}
                      />
                    ) : (
                      item.d_H
                    )}
                  </div>
                </td>
                <td>
                  {" "}
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="number"
                        value={editedData[index]?.subtotal || ""}
                        onChange={(e) =>
                          handleInputChange(e, index, "subtotal")
                        }
                      />
                    ) : (
                      item.subtotal
                    )}
                  </div>
                </td>
                <td>
                  {" "}
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="text"
                        value={editedData[index]?.remark || ""}
                        onChange={(e) => handleInputChange(e, index, "remark")}
                      />
                    ) : (
                      item.remark
                    )}
                  </div>
                </td>
                <td>
                  {" "}
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="text"
                        value={editedData[index]?.contractItemId || ""}
                        onChange={(e) =>
                          handleInputChange(e, index, "contractItemId")
                        }
                      />
                    ) : (
                      item.contractItemId
                    )}
                  </div>
                </td>
                <td>
                  {" "}
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="text"
                        value={editedData[index]?.tags || ""}
                        onChange={(e) => handleInputChange(e, index, "tags")}
                      />
                    ) : (
                      item.tags
                    )}
                  </div>
                </td>
                <td>
                  {" "}
                  <div className="cell-content">
                    {item.isEditing ? (
                      <input
                        type="text"
                        value={editedData[index]?.billId || ""}
                        onChange={(e) => handleInputChange(e, index, "billId")}
                      />
                    ) : (
                      item.billId
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
      {/* <button onClick={handleSave}>Save</button> */}
    </div>
  );
};

export default Measurement;
