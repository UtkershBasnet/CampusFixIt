const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
console.log("MONGO_URI =", process.env.MONGODB_URI);

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));

app.get('/', (req, res) => {
    res.send('Campus FixIt API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
