const express = require('express');
const cors = require('cors');
const registrationRoutes = require('./routes/registrationRoutes');
const statsRouter = require('./routes/stats');
const adminRouter = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', registrationRoutes);
app.use('/api', statsRouter);
app.use('/api', adminRouter);

module.exports = app;
