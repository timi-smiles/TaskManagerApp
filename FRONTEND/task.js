// let userId = sessionStorage.getItem('userId');
// let logoutBtn = document.querySelector('.logoutBtn');
// console.log(userId);


// if(userId) {
    
    
// 	// Log out button event (Log out user)
//     logoutBtn.addEventListener('click', () => {
//         sessionStorage.removeItem('userId'); // Clear the user ID from session storage
//         window.location.href = '/FRONTEND/index.html'; // Redirect to the main page
//     });

// 	window.addEventListener('load', () => {
// 		const form = document.querySelector("#new-task-form");
// 		const input = document.querySelector("#new-task-input");
// 		const list_el = document.querySelector("#tasks");
	
// 		form.addEventListener('submit', (e) => {
// 			e.preventDefault();
	
// 			const task = input.value;
	
// 			const task_el = document.createElement('div');
// 			task_el.classList.add('task');
	
// 			const task_content_el = document.createElement('div');
// 			task_content_el.classList.add('content');
	
// 			task_el.appendChild(task_content_el);
	
// 			const task_input_el = document.createElement('input');
// 			task_input_el.classList.add('text');
// 			task_input_el.type = 'text';
// 			task_input_el.value = task;
// 			task_input_el.setAttribute('readonly', 'readonly');
	
// 			task_content_el.appendChild(task_input_el);
	
// 			const task_actions_el = document.createElement('div');
// 			task_actions_el.classList.add('actions');
			
// 			const task_edit_el = document.createElement('button');
// 			task_edit_el.classList.add('edit');
// 			task_edit_el.innerText = 'Edit';
	
// 			const task_delete_el = document.createElement('button');
// 			task_delete_el.classList.add('delete');
// 			task_delete_el.innerText = 'Delete';
	
// 			task_actions_el.appendChild(task_edit_el);
// 			task_actions_el.appendChild(task_delete_el);
	
// 			task_el.appendChild(task_actions_el);
	
// 			list_el.appendChild(task_el);
	
// 			input.value = '';
	
// 			task_edit_el.addEventListener('click', (e) => {
// 				if (task_edit_el.innerText.toLowerCase() == "edit") {
// 					task_edit_el.innerText = "Save";
// 					task_input_el.removeAttribute("readonly");
// 					task_input_el.focus();
// 				} else {
// 					task_edit_el.innerText = "Edit";
// 					task_input_el.setAttribute("readonly", "readonly");
// 				}
// 			});
	
// 			task_delete_el.addEventListener('click', (e) => {
// 				list_el.deleteTask(task_el);
// 			});
// 		});
// 	});


// } else {
//     window.location.href = '/FRONTEND/index.html'
// }




// let userId = sessionStorage.getItem('userId');
// let logoutBtn = document.querySelector('.logoutBtn');
// console.log(userId);

// if (userId) {
//     // Log out button event
//     logoutBtn.addEventListener('click', () => {
//         sessionStorage.removeItem('userId');
//         window.location.href = '/FRONTEND/index.html';
//     });

//     window.addEventListener('load', async () => {
//         const form = document.querySelector("#new-task-form");
//         const input = document.querySelector("#new-task-input");
//         const list_el = document.querySelector("#tasks");

// // Selecting the task container
// let tasksContainer = document.querySelector('#tasks');

// // Function to fetch and display tasks
// async function fetchTasks() {
//     try {
//         let response = await fetch(`http://localhost:8000/api/users/${userId}/tasks`, { method: 'GET' });
//         let tasks = await response.json();

//         tasksContainer.innerHTML = ''; // Clear previous content

//         if (tasks.length > 0) {
//             tasks.forEach(task => {
//                 renderTask(task); // Render each task using the renderTask function
//             });
//         } else {
//             tasksContainer.innerHTML = '<p class="text-muted">No tasks available.</p>';
//         }
//     } catch (error) {
//         console.error('Failed to load tasks:', error);
//     }
// }

// // Function to render a task as a div inside #tasks
// function renderTask(task) {
//     let taskElement = document.createElement('div');
//     taskElement.classList.add('task');  // Add class 'task' for styling

//     taskElement.innerHTML = `
//         <div class="content">
//             <input type="text" class="text" value="${task.task}" readonly>
//         </div>
//         <div class="actions">
//             <button class="edit" data-id="${task.id}">Edit</button>
//             <button class="delete" data-id="${task.id}">Delete</button>
//         </div>
//     `;

//     // Append the task element to the tasks container
//     tasksContainer.appendChild(taskElement);

//     // Add event listener to delete button
//     taskElement.querySelector('.delete').addEventListener('click', async () => {
//         const taskId = taskElement.querySelector('.delete').getAttribute('data-id');
//         await deleteTask(taskId); // Call the deleteTask function with the task ID
//     });

//     // Add event listener to edit button (optional if you want to implement editing functionality)
//     taskElement.querySelector('.edit').addEventListener('click', () => {
//         // Add your edit functionality here
//         alert(`Edit task with ID: ${task.id}`);
//     });
// }

// // Function to delete a task
// async function deleteTask(taskId) {
//     try {
//         // Send DELETE request to backend
//         let response = await fetch(`http://localhost:8000/api/users/${userId}/tasks/${taskId}`, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         let result = await response.json();

//         if (result.message) {
//             alert(result.message); // Show message if deletion fails
//         } else {
//             // Remove the task from the DOM if successful
//             let taskElement = document.querySelector(`.task .delete[data-id='${taskId}']`).closest('.task');
//             if (taskElement) {
//                 tasksContainer.removeChild(taskElement); // Remove task from container
//             }
//         }
//     } catch (error) {
//         console.error('Error deleting task:', error);
//     }
// }

// // Call fetchTasks function on page load to display tasks
// document.addEventListener('DOMContentLoaded', () => {
//     fetchTasks(); // Fetch and display tasks when the page loads
// })
// else {
//     window.location.href = "/FRONTEND/index.html";
// }

