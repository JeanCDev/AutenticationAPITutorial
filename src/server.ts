import express from 'express';
import router from './routes';
import 'dotenv/config';
import path from 'path';

const app = express();

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(router);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.listen(process.env.PORT, ()=>{
  console.log('Server is running!');
});