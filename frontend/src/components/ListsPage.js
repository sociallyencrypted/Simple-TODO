import "../styles/ListsPage.css";
import { useRef } from "react";
import { BiSolidTrash } from "react-icons/bi";

function ListsPage({
  listSummaries,
  handleNewToDoList,
  handleDeleteToDoList,
  handleSelectList,
}) {
  const newListInputRef = useRef();

  if (listSummaries === null) {
    return <div className="ListsPage loading">Loading...</div>;
  } else if (listSummaries.length === 0) {
    return (
      <div className="ListsPage">
        <div className="box">
          <label>
            New To-Do List:&nbsp;
            <input ref={newListInputRef} type="text" />
          </label>
          <button
            onClick={() => handleNewToDoList(newListInputRef.current.value)}
          >
            New
          </button>
        </div>
        <p>There are no to-do lists!</p>
      </div>
    );
  }
  return (
    <div className="ListsPage">
      <div className="box">
        <label>
          New To-Do List:&nbsp;
          <input ref={newListInputRef} type="text" />
        </label>
        <button
          onClick={() => handleNewToDoList(newListInputRef.current.value)}
        >
          New
        </button>
      </div>
      {listSummaries.map((summary) => {
        return (
          <div
            key={summary.id}
            className="summary"
            onClick={() => handleSelectList(summary.id)}
          >
            <span className="name">{summary.name}</span>
            <span className="count">({summary.item_count} items)</span>
            <span className="flex"></span>
            <span
              className="trash"
              onClick={(evt) => {
                evt.stopPropagation();
                handleDeleteToDoList(summary.id);
              }}
            >
              <BiSolidTrash />
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ListsPage;