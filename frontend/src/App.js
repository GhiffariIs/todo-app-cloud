import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/todos`, { title, description });
      setTitle('');
      setDescription('');
      setError('');
      fetchTodos();
    } catch (err) {
      setError('Failed to add todo');
      console.error('Error adding todo:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, { completed: !completed });
      fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>📝 Todo App - Cloud Computing</h1>
        <p className="subtitle">Fullstack Todo App with React, Node.js & PostgreSQL</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            placeholder="Todo title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
          />
          <textarea
            placeholder="Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input textarea"
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Todo'}
          </button>
        </form>

        <div className="todos-list">
          {loading && todos.length === 0 ? (
            <p className="loading">Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="empty">No todos yet. Add one above! 👆</p>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content">
                  <h3 onClick={() => toggleTodo(todo.id, todo.completed)}>
                    {todo.completed && '✓ '}
                    {todo.title}
                  </h3>
                  {todo.description && <p>{todo.description}</p>}
                  <span className="todo-date">
                    {new Date(todo.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="todo-actions">
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className="btn btn-toggle"
                  >
                    {todo.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="footer">
          <p>Built with ❤️ for Cloud Computing Course</p>
        </footer>
      </div>
    </div>
  );
}

export default App;