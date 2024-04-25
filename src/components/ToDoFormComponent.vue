<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="title">Title:</label>
      <input
        type="text"
        id="title"
        name="title"
        v-model="formData.title"
      />
    </div>
    <div>
      <label for="description">Description:</label>
      <input
        type="text"
        id="description"
        name="description"
        v-model="formData.description"
      />
    </div>
    <div>
      <label for="completed">Completed:</label>
      <input
        type="checkbox"
        id="completed"
        name="completed"
        v-model="formData.completed"
      />
    </div>
    <button type="submit">Submit</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        title: '',
        description: '',
        completed: false  // Initialize completed as false by default
      }
    };
  },
  methods: {
    async handleSubmit() {
      console.log('Form submitted:', this.formData);
      try {
        const response = await fetch('http://localhost:3000/todos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });

        if (!response.ok) {
          throw new Error('Failed to create todo');
        }

        //const data = await response.json();
        // You can perform additional actions after successful submission, like updating state or displaying a success message
        this.formData.title = '';
        this.formData.description = '';
        this.formData.completed = false;  // Reset completed to false after submission
      } catch (error) {
        console.error('Error creating todo:', error);
        // Handle error scenarios, e.g., display an error message to the user
      }
    }
  }
};
</script>
