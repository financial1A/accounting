const express = require('express');
const http = require('http');

const app = express();

const availablePorts = [3000, 3001, 3002, 3003, 3004];
const userPorts = new Set();

app.get('/', (req, res) => {
  let currentPort = null;

  // Find an available port
  for (const port of availablePorts) {
    if (!userPorts.has(port)) {
      currentPort = port;
      break;
    }
  }

  if (!currentPort) {
    res.send('No space available. Please try again later.');
    return;
  }

  // Allocate the port to the user
  userPorts.add(currentPort);
  res.redirect(`http://127.0.0.1:${currentPort}`);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
