const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);
app.use('/journal', journalRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
