
let userId = sessionStorage.getItem('userId');
let logoutBtn = document.querySelector('.logoutBtn');
console.log(userId);

if (userId) {
    // Selecting the task container
    let tasksContainer = document.querySelector('#tasks');
    let newTaskForm = document.querySelector('#new-task-form');
    let newTaskInput = document.querySelector('#new-task-input');

    // Function to fetch and display tasks
    async function fetchTasks() {
        try {
            let response = await fetch(`http://localhost:3000/api/users/${userId}/tasks`, { method: 'GET' });
            let tasks = await response.json();

            tasksContainer.innerHTML = ''; // Clear previous content

            if (tasks.length > 0) {
                tasks.forEach(task => {
                    renderTask(task); // Render each task using the renderTask function
                });
            } else {
                tasksContainer.innerHTML = '<p class="text-muted">No tasks available.</p>';
            }
        } catch (error) {
            console.error('Failed to load tasks:', error);
        }
    }

    // Function to render a task as a div inside #tasks
    function renderTask(task) {
        let taskElement = document.createElement('div');
        taskElement.classList.add('task');

        taskElement.innerHTML = `
            <div class="content">
                <input type="text" class="text" value="${task.task}" readonly>
            </div>
            <div class="actions">
                <button class="edit" data-id="${task.id}">Edit</button>
                <button class="delete" data-id="${task.id}">Delete</button>
            </div>
        `;

        tasksContainer.prepend(taskElement);

        // Add event listener to delete button
        taskElement.querySelector('.delete').addEventListener('click', async () => {
            const taskId = task.id;
        
            try {
                // Send delete request to the backend
                const response = await fetch(`http://localhost:3000/api/users/${userId}/tasks/${taskId}`, {
                    method: 'DELETE',
                });
        
                if (response.ok) {
                    taskElement.remove(); // Remove the task element from the UI
                    // console.log(`Task with ID ${taskId} deleted successfully.`);
                    alert('Task deleted Successfully')
                } else {
                    console.error('Failed to delete task');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        });
        

        // Add event listener to edit button (optional if you want to implement editing functionality)
        taskElement.querySelector('.edit').addEventListener('click', async (e) => {
            const editButton = e.target;
            const taskInput = taskElement.querySelector('.text');

            // Toggle between edit and save
            if (editButton.innerText.toLowerCase() === "edit") {
                editButton.innerText = "Save";
                taskInput.removeAttribute("readonly");
                taskInput.focus();
            } else {
                editButton.innerText = "Edit";
                taskInput.setAttribute("readonly", "readonly");

                const updatedTaskContent = taskInput.value;

                // Send the updated task to the backend
                try {
                    const response = await fetch(`http://localhost:3000/api/users/${userId}/tasks/${task.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ task: updatedTaskContent }),
                    });

                    if (response.ok) {
                        const updatedTask = await response.json();
                        alert('Task Updated Successfully')
                        // console.log("Task updated:", updatedTask);
                    } else {
                        alert('Failed to update task');
                    }
                } catch (error) {
                    console.error('Error updating task:', error);
                    alert('Failed to update task');
                }
            }
        });   
    }
    // Function to create a new task
    async function createTask(taskContent) {
        try {
            let response = await fetch(`http://localhost:3000/api/users/${userId}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: taskContent })
            });

            if (response.ok) {
                let newTask = await response.json();
                renderTask(newTask); // Add the new task to the UI
            } else {
                console.error('Failed to create task');
            }
        } catch (error) {
            // console.error('Failed to create task:', error);
        }
    }

    // Add event listener to handle form submission
    newTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let taskContent = newTaskInput.value.trim();

        if (taskContent) {
            createTask(taskContent); // Call createTask function
            newTaskInput.value = ''; // Clear the input field
        } else {
            alert('Please enter a task');
        }
    });

    

    // Call fetchTasks function on page load to display tasks
    document.addEventListener('DOMContentLoaded', fetchTasks);

    // Log out button event (Log out user)
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('userId');
        window.location.href = '/FRONTEND/index.html';
    });

} else {
    window.location.href = '/FRONTEND/index.html';
}

