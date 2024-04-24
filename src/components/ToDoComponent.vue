<template>
    <div>
      <ul>
        <li v-for="item in data" :key="item.id">
          <template v-if="editItemId === item.id">
            <input type="text" v-model="editedDescription" />
            <button @click="handleUpdate(item.id)">Save</button>
            <button @click="cancelEdit">Cancel</button>
          </template>
          <template v-else>
            {{ item.description }}
            <button @click="handleEdit(item.id, item.description)">Edit</button>
            <button @click="handleDelete(item.id)">Delete</button>
          </template>
        </li>
      </ul>
      <button @click="logMessage">Log Message</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        data: null,
        loading: true,
        error: null,
        editItemId: null,
        editedDescription: ''
      };
    },
    created() {
      this.fetchData();
    },
    methods: {
      async fetchData() {
        try {
          const response = await fetch('http://localhost:3000/todos');
          if (!response.ok) {
            throw new Error('Failed to fetch todos');
          }
          const jsonData = await response.json();
          this.data = jsonData;
        } catch (error) {
          this.error = error;
        } finally {
          this.loading = false;
        }
      },
      async handleUpdate(id) {
        try {
          const response = await fetch(`http://localhost:3000/todos/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: this.editedDescription, completed: true })
          });
  
          if (!response.ok) {
            throw new Error('Failed to update todo');
          }
  
          const updatedTodo = await response.json();
          this.data = this.data.map(todo => (todo.id === id ? updatedTodo : todo));
          this.editItemId = null; // Exit edit mode after successful update
        } catch (error) {
          console.error('Error updating todo:', error);
          // Handle error state or display error to the user
        }
      },
      async handleDelete(id) {
        try {
          const response = await fetch(`http://localhost:3000/todos/${id}`, {
            method: 'DELETE'
          });
  
          if (!response.ok) {
            throw new Error('Failed to delete todo');
          }
  
          this.data = this.data.filter(todo => todo.id !== id);
        } catch (error) {
          console.error('Error deleting todo:', error);
          // Handle error state or display error to the user
        }
      },
      handleEdit(id, initialDescription) {
        this.editItemId = id; // Enter edit mode for the selected item
        this.editedDescription = initialDescription; // Set initial description for editing
      },
      cancelEdit() {
        this.editItemId = null; // Cancel edit mode
        this.editedDescription = ''; // Clear edited description
      },
      async logMessage() {
        console.log('Fetching todos...');
        const response = await fetch('http://localhost:3000/todos');
        console.log('Response:', response);
      }
    }
  };
  </script>
  