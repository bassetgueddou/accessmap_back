const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);


app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API AccessMap');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));