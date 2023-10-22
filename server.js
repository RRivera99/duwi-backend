const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const path = require('path');
const cors = require('cors'); 

app.use(express.json());

//

app.use(express.static(path.join(__dirname, 'front')));

//

app.use(cors({
  origin: 'http://localhost:5173',  
  optionsSuccessStatus: 200  
}));

app.use(express.json());

//modificado por nodemailer
app.use(express.urlencoded({ extended: false }));

app.use(require('./src/Routes/NotificationRoutes.js'))

//

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://DBUSER:PF123@cluster0.x6eafwv.mongodb.net/DB_PF', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Conexión a MongoDB establecida');
});
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PTIONS, PUT, DELETE');
  next();
});
const moviesRoutes = require('./src/Routes/MoviesRoutes');
const seriesRoutes = require('./src/Routes/SeriesRoutes');
const userRoutes = require('./src/Routes/UserRoutes');
const donationRoutes = require('./src/Routes/DonationRoutes')
const notificationRoutes = require('./src/Routes/NotificationRoutes');

app.use('/', moviesRoutes);
app.use('/', seriesRoutes);
app.use('/', userRoutes);
app.use('/', donationRoutes);
app.use('/', notificationRoutes);

app.listen(port, () => {
  console.log(`El servidor está escuchando en el puerto ${port}`);
});
module.exports = app;