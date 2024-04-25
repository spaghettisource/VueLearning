<template>
  <div>
    <h2>Todo List</h2>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error.message }}</div>

    <ul v-if="!loading && !error">
      <li v-for="todo in todos" :key="todo._id">
        <div>
          <span>{{ todo.title }}</span>
          <span>{{ todo.description }}</span>
          <input type="checkbox" v-model="todo.completed" @change="handleUpdate(todo)">
        </div>
        <div>
          <template v-if="editItemId !== todo._id">
            <button @click="handleEdit(todo)">Edit</button>
            <button @click="handleDelete(todo._id)">Delete</button>
          </template>
          <template v-else>
            <input type="text" v-model="editedDescription" />
            <button @click="saveEdit(todo)">Save</button>
            <button @click="cancelEdit">Cancel</button>
          </template>
        </div>
      </li>
    </ul>
    <button @click="refreshData">Refresh Data</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todos: [],
      loading: true,
      error: null,
      editItemId: null,
      editedDescription: ''
    };
  },
  created() {
    this.fetchTodos();
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await fetch('http://localhost:3000/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        this.todos = await response.json();
        this.loading = false;
      } catch (error) {
        this.error = error;
        this.loading = false;
      }
    },
    async handleUpdate(todo) {
      try {
        const response = await fetch(`http://localhost:3000/todos/${todo._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(todo)
        });

        if (!response.ok) {
          throw new Error('Failed to update todo');
        }

        // No need to update local state, just refresh data
        this.refreshData();
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    },
    async handleDelete(todoId) {
      try {
        const response = await fetch(`http://localhost:3000/todos/${todoId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete todo');
        }

        // No need to update local state, just refresh data
        this.refreshData();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    },
    handleEdit(todo) {
      this.editItemId = todo._id;
      this.editedDescription = todo.description;
    },
    async saveEdit(todo) {
      try {
        const response = await fetch(`http://localhost:3000/todos/${todo._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ...todo, description: this.editedDescription })
        });

        if (!response.ok) {
          throw new Error('Failed to save todo edit');
        }

        this.cancelEdit(); // Exit edit mode
        this.refreshData(); // Refresh data after saving edit
      } catch (error) {
        console.error('Error saving todo edit:', error);
      }
    },
    cancelEdit() {
      this.editItemId = null;
      this.editedDescription = '';
    },
    refreshData() {
      this.loading = true;
      this.error = null;
      this.fetchTodos(); // Reload data from server
    }
  }
};
</script>

<style>
.error {
  color: red;
}
</style>
