import http from 'http';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Create the server
const server = http.createServer(async (req, res) => {
  // Set response headers
  res.setHeader('Content-Type', 'application/json');

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Allow your frontend's origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
  if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
  }

            // Helper functions (CRUD operations)
  // Handle different request methods
  if (req.method === 'POST' && req.url === '/api/users/create-user') { // Handle create user endpoint
    let body = '';
    
    // Collect the request body data
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // Once the body is fully received
    req.on('end', async () => {
      try {
        const { fname, lname, email, password } = JSON.parse(body);  // Parse the incoming JSON data

        // Create a new user
        const newUser = await  prisma.user.create({
            data: {
              fname,
              lname,
              email,
              password, // Ideally, you'd hash the password before saving it
            },
          });

        // Respond with the created user
        res.statusCode = 201;
        res.end(JSON.stringify({ message: 'User created successfully', user: newUser }));
      } catch (error) {
        res.statusCode = 500;
        console.error('Error creating user:', error); // Log error for debugging  
        res.end(JSON.stringify({ message: error.message }));
      }
    });
  }else if (req.method === 'POST' && req.url === '/api/auth/login') { // Handle login endpoint
    let body = '';

    // Collect the request body data
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // Once the body is fully received
    req.on('end', async () => {
      try {
        // Parse the incoming JSON data
        const { email, password } = JSON.parse(body);

        // Find the user by email
        const user = await prisma.user.findUnique({
          where: {
            email: email, // Lookup user by email
          },
        });

        if (!user) {
          // If no user found with the email
          res.statusCode = 400;
          res.end(JSON.stringify({ message: 'Invalid email or password' }));
          return;
        }

        // If the password matches exactly, respond with success
        if (user.password === password) {
          // Exclude the password from the response
          const { password: _, ...userWithoutPassword } = user;
          res.statusCode = 200;
          res.end(JSON.stringify({ message: 'Login successful', user: userWithoutPassword }));
        } else {
          // If the passwords don't match
          res.statusCode = 400;
          res.end(JSON.stringify({ message: 'Invalid email or password' }));
        }
      } catch (error) {
        console.error('Error logging in:', error); // Log error for debugging
        res.statusCode = 500;
        res.end(JSON.stringify({ message: 'Error logging in', error: error.message }));
      }
    }
    )} else if (req.method === 'POST' && req.url === '/api/users/create-task') { // create task endpoint
    let body = '';

    // Collect the request body data
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { task, userId } = JSON.parse(body);  // Parse the incoming JSON data

        // Create a new task
        const newTask =  await prisma.task.create({
            data: {
              task: task, // Task description
              userId: userId, // User ID associated with the task
            },
          });

        // Respond with the created task
        res.statusCode = 201;
        res.end(JSON.stringify({ message: 'Task created successfully'}));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ message: error.message }));
      }
    });
  } else if (req.method === 'PUT' && req.url === '/api/update-task') { // Handle update task endpoint
    let body = '';

    // Collect the request body data
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // Once the body is fully received
    req.on('end', async () => {
      try {
        const { taskId, userId, newTaskDescription } = JSON.parse(body);

        // Validate that taskId, userId, and newTaskDescription are provided
        if (!taskId || !userId || !newTaskDescription) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ message: 'taskId, userId, and newTaskDescription are required' }));
        }

        // Update the task in the database if it belongs to the specified user
        const updatedTask = await prisma.task.update({
          where: {
            id: taskId,
            userId: userId  // Ensure the task belongs to the specified user
          },
          data: {
            task: newTaskDescription,  // Update the task description
          },
        });

        // Check if the task was found and updated
        if (updatedTask.count === 0) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ message: 'Task not found or user does not have permission to update this task' }));
        }

        // Respond with a success message
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'Task updated successfully', task: updatedTask }));
      } catch (error) {
        console.error('Error updating task:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ message: 'Error updating task', error: error.message }));
      }
    })}else  if (req.method === 'DELETE' && req.url === '/api/delete-task') { // Handle delete task endpoint
        let body = '';
    
        // Collect the request body data
        req.on('data', chunk => {
          body += chunk.toString();
        });
    
        // Once the body is fully received
        req.on('end', async () => {
          try {
            const { taskId, userId } = JSON.parse(body);
    
            // Validate that taskId and userId are provided
            if (!taskId || !userId) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ message: 'taskId and userId are required' }));
            }
    
            // Delete the task from the database if it belongs to the specified user
            const deletedTask = await prisma.task.delete({
              where: {
                id: taskId,
                userId: userId  // Ensure the task belongs to the specified user
              },
            });
    
            // Check if the task was found and deleted
            if (deletedTask.count === 0) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ message: 'Task not found or user does not have permission to delete this task' }));
            }
    
            // Respond with a success message
            res.statusCode = 200;
            res.end(JSON.stringify({ message: 'Task deleted successfully' }));
          } catch (error) {
            console.error('Error deleting task:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Error deleting task', error: error.message }));
          }
        })} else {
    // Handle unsupported routes or methods
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



