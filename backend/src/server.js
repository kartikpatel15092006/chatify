const express = require('express'); 
const Path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route');
dotenv.config();
const app = express();
const connectDB = require('./lib/db');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use("/api/messages",messageRoutes)

if (process.env.NODE_ENV === 'production') {

  const distPath = Path.join(__dirname, '../../frontend/dist');

  app.use(express.static(distPath));

  app.use((req, res) => {
    res.sendFile(Path.join(distPath, 'index.html'));
  });

}


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
connectDB();});


