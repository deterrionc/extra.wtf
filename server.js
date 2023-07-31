const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// ACCESS FILES
app.use('/files/', express.static('files'))
app.use('/av', express.static('/home/OMG'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/channels', require('./routes/api/channels'));
app.use('/api/categories', require('./routes/api/categories'));
app.use('/api/files', require('./routes/api/files'));
app.use('/api/antal', require('./routes/api/antal'));

// Serve frontend built
app.use(express.static(__dirname + '/client/build'))

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html')
})

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
