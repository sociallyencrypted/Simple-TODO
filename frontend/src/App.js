import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ListsPage from './components/ListsPage';
import ToDoList from './components/ToDoList';

function App() {
  const [listSummaries, setListSummaries] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    reloadData().catch(console.error);
  }, []);

  async function reloadData() {
    const response = await axios.get('/api/lists');
    const data = await response.data;
    setListSummaries(data);
  }

  async function handleNewToDoList(newName) {
    const updateData = async () => {
      const newListData = {
        name: newName,
      };

      await axios.post('/api/lists', newListData);
      reloadData().catch(console.error);
    };
  updateData();
  }

  function handleDeleteToDoList(id) {
    const updateData = async () => {
      await axios.delete(`/api/lists/${id}`);
      reloadData().catch(console.error);
    };
    updateData();
  }

  function handleSelectList(id) {
    console.log("Selecting item", id);
    setSelectedItem(id);
  }

  function backToList() {
    setSelectedItem(null);
    reloadData().catch(console.error);
  }

  if (selectedItem === null) {
    return (
      <div className="App">
        <ListsPage
          listSummaries={listSummaries}
          handleNewToDoList={handleNewToDoList}
          handleDeleteToDoList={handleDeleteToDoList}
          handleSelectList={handleSelectList}
        />
      </div>
    );
  }
  else {
    return (
      <div className="App">
        <ToDoList listId={selectedItem} handleBackButton={backToList} />
      </div>
    );
  }

}

export default App;
