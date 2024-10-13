import "../styles/ToDoList.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BiSolidTrash } from "react-icons/bi";

function ToDoList({ listId, handleBackButton }) {
  const labelRef = useRef();
  const [listData, setListData] = useState(null);

  useEffect(() => {
    const fetchListData = async () => {
      const response = await axios.get(`/api/lists/${listId}`);
      const newListData = await response.data;
      setListData(newListData);
    };
    fetchListData();
  }, [listId]);

  const createNewItem = async (label) => {
    const response = await axios.post(`/api/lists/${listData.id}/items`, {
      label: label,
    });
    setListData(await response.data);
  };

  const deleteItem = async (id) => {
    const response = await axios.delete(
      `/api/lists/${listData.id}/items/${id}`
    );
    setListData(await response.data);
  };

  const toggleCheck = async (itemId, newState) => {
    const response = await axios.patch(
      `/api/lists/${listData.id}/checked_state`,
      {
        item_id: itemId,
        checked_state: newState,
      }
    );
    setListData(await response.data);
  };

  if (listData === null) {
    return (
      <div className="ToDoList loading">
        <button className="back" onClick={handleBackButton}>
          Back
        </button>
        Loading to-do list ...
      </div>
    );
  }
  return (
    <div className="ToDoList">
      <button className="back" onClick={handleBackButton}>
        Back
      </button>
      <h1>List: {listData.name}</h1>
      <div className="box">
        <label>
          New Item:&nbsp;
          <input id={labelRef} type="text" />
        </label>
        <button
          onClick={() => createNewItem(document.getElementById(labelRef).value)}
        >
          New
        </button>
      </div>
      {listData.items.length > 0 ? (
        listData.items.map((item) => {
          return (
            <div
              key={item.id}
              className={item.checked ? "item checked" : "item"}
              onClick={() => toggleCheck(item.id, !item.checked)}
            >
              <span>{item.checked ? "✅" : "⬜️"} </span>
              <span className="label">{item.label} </span>
              <span className="flex"></span>
              <span
                className="trash"
                onClick={(evt) => {
                  evt.stopPropagation();
                  deleteItem(item.id);
                }}
              >
                <BiSolidTrash />
              </span>
            </div>
          );
        })
      ) : (
        <div className="box">There are currently no items.</div>
      )}
    </div>
  );
}

export default ToDoList;