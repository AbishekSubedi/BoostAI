const { spawn } = require('child_process');
const path = require('path');

// Start the FastAPI server
const pythonPath = process.env.PYTHON_PATH || 'python'; // Use environment variable or default
const fastApiServer = spawn(pythonPath, ['-m', 'uvicorn', 'fastapi_server:app', '--host', '0.0.0.0', '--port', '5005'], {
  stdio: 'inherit'
});

console.log('FastAPI server started on port 5005');

// Handle process termination
process.on('SIGINT', () => {
  fastApiServer.kill();
  process.exit();
});