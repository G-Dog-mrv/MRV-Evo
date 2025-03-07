import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://mrvevo-dev-api.azurewebsites.net';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', category: '' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', category: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/items/`);
      console.log('Fetched items:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const fetchItem = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/items/${id}`);
      console.log('Fetched item:', response.data);
      setSelectedItem(response.data);
    } catch (error) {
      console.error('Fetch item error:', error);
    }
  };

  const createItem = async () => {
    try {
      console.log('Posting new item:', newItem);
      const response = await axios.post(`${API_URL}/items/`, newItem);
      console.log('POST response:', response.data);
      await fetchItems();
      setNewItem({ name: '', description: '', category: '' });
    } catch (error) {
      console.error('POST error:', error);
    }
  };

  const startEdit = (item) => {
    setEditItem(item);
    setEditForm({ name: item.Name, description: item.Description, category: item.Category });
  };

  const updateItem = async (id) => {
    try {
      console.log('Updating item:', editForm);
      const response = await axios.put(`${API_URL}/items/${id}`, editForm);
      console.log('PUT response:', response.data);
      await fetchItems();
      setEditItem(null);
      setEditForm({ name: '', description: '', category: '' });
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      console.log('Deleting item with ID:', id);
      await axios.delete(`${API_URL}/items/${id}`);
      console.log('Item deleted');
      await fetchItems();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div>
      <h1>MRV Evo Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.Id}>
            {item.Name} - {item.Category}
            <button onClick={() => fetchItem(item.Id)}>View</button>
            <button onClick={() => startEdit(item)}>Edit</button>
            <button onClick={() => deleteItem(item.Id)}>Delete</button>
          </li>
        ))}
      </ul>

      {selectedItem && (
        <div>
          <h2>Item Details</h2>
          <p>ID: {selectedItem.Id}</p>
          <p>Name: {selectedItem.Name}</p>
          <p>Description: {selectedItem.Description}</p>
          <p>Category: {selectedItem.Category}</p>
          <button onClick={() => setSelectedItem(null)}>Close</button>
        </div>
      )}

      {editItem && (
        <div>
          <h2>Edit Item</h2>
          <input
            value={editForm.name}
            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Name"
          />
          <input
            value={editForm.description}
            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
            placeholder="Description"
          />
          <input
            value={editForm.category}
            onChange={e => setEditForm({ ...editForm, category: e.target.value })}
            placeholder="Category"
          />
          <button onClick={() => updateItem(editItem.Id)}>Save</button>
          <button onClick={() => setEditItem(null)}>Cancel</button>
        </div>
      )}

      <h2>Add New Item</h2>
      <input
        value={newItem.name}
        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
        placeholder="Name"
      />
      <input
        value={newItem.description}
        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
        placeholder="Description"
      />
      <input
        value={newItem.category}
        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
        placeholder="Category"
      />
      <button onClick={createItem}>Add Item</button>
    </div>
  );
}

export default App;