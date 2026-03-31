const app = require('./app');
const connectDB = require('./database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
