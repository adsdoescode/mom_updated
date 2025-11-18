const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve Round_1 at root from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Serve Round_2 at /round2 route
app.use('/round2', express.static(path.join(__dirname, 'build-round2')));

// Download route for mission document
app.get('/download/mission-document', (req, res) => {
  res.download(path.join(__dirname, 'Mission_Critical_Document.docx'), 'Mission_Critical_Document.docx');
});

// SPA fallback routes for Round_1
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// SPA fallback for Round_2
app.get('/round2*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build-round2', 'index.html'));
});

// Catch all other routes and serve Round_1 index (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📍 Round 1: http://localhost:${PORT}/`);
  console.log(`📍 Round 2: http://localhost:${PORT}/round2`);
});
