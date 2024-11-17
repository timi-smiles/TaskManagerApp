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
    )} else if (req.url.match(/^\/api\/users\/([0-9]+)\/tasks$/) && req.method === 'POST'){ // create task endpoint
    
      const userId = parseInt(req.url.split('/')[3], 10);
      let body = '';

    // Collect the request body data
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { task } = JSON.parse(body);  // Parse the incoming JSON data

        // Create a new task
        const newTask =  await prisma.task.create({
            data: {
              task: task, // Task description
              userId: userId, // User ID associated with the task
            },
          });

          if (!newTask) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User does not exist' }));
            return;
        }


        // Respond with the created task
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newTask));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to create task' }));
      }
    })} else if (req.url.match(/^\/api\/users\/([0-9]+)\/tasks$/) && req.method === 'GET') { //Handle get operations for tasks 
      const userId = parseInt(req.url.split('/')[3]);
  
      try {
          // Fetch all tasks for the user
          const tasks = await prisma.task.findMany({
              where: {
                  userId: userId, // Filter tasks by the user ID
              },
          });
  
          if (!tasks || tasks.length === 0) {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Tasks not found for this user' }));
              return;
          }
  
          // Return the tasks if found
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(tasks));
      } catch (error) {
          // Handle any errors
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to fetch tasks' }));
      }
  }else if (req.url.match(/\/api\/users\/([0-9]+)\/tasks\/([0-9]+)/) && req.method === 'PUT') { // Handle Update operation for task
      const userId = parseInt(req.url.split('/')[3], 10); // Extract userId from URL
      const taskId = parseInt(req.url.split('/')[5], 10); // Extract taskId from URL
  
      let body = '';
  
      req.on('data', chunk => {
          body += chunk.toString();
      });
  
      req.on('end', async () => {
          try {
              const { task } = JSON.parse(body); // Get task description from request body

              // Check if the task exists for the given user
              const existingTask = await prisma.task.findFirst({
                  where: {
                      id: taskId,
                      userId: userId,
                  },
              });
  
              if (!existingTask) {
                  res.writeHead(404, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Task not found for this user' }));
                  return;
              }
  
              // Update the task
              const updatedTask = await prisma.task.update({
                  where: { id: taskId },
                  data: {
                      task: task, // Updated task description
                  },
              });
  
              // Respond with the updated task
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Task successfully updated', updatedTask }));
          } catch (error) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to update the task' }));
          }
      });
  } else if (req.url.match(/\/api\/users\/([0-9]+)\/tasks\/([0-9]+)/) && req.method === 'DELETE') { // Handle Delete operation for task
    const userId = parseInt(req.url.split('/')[3], 10); // Extract userId from URL
    const taskId = parseInt(req.url.split('/')[5], 10); // Extract taskId from URL

    // Check if the task exists for the given user
    const existingTask = await prisma.task.findUnique({
        where: {
            id: taskId,
            userId: userId,
        },
    });

    if (!existingTask) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Task not found for this user' }));
        return;
    }

    // Delete the task
    try {
        await prisma.task.delete({
            where: { id: taskId },
        });

        // Respond with success
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Task successfully deleted' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to delete the task' }));
    }
} else {
    // Handle unsupported routes or methods
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});


// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



