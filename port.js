const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

const availablePorts = [3000, 3001, 3002];
let currentPortIndex = 0;

app.get('/', (req, res) => {
  const currentPort = availablePorts[currentPortIndex];
  const nextPortIndex = (currentPortIndex + 1) % availablePorts.length;
  const nextPort = availablePorts[nextPortIndex];

  // Check if the current port is available
  const server = http.createServer();
  server.listen(currentPort);

  server.on('listening', () => {
    server.close();
    res.redirect(`http://127.0.0.1:${currentPort}`);
  });

  server.on('error', (err) => {
    // Port is not available, try the next one
    currentPortIndex = nextPortIndex;
    res.redirect(`http://127.0.0.1:${nextPort}`);
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
