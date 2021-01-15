import {Client} from 'pg';
import 'dotenv/config';

const connection = new Client({
  host: process.env.DB_HOST,
  database:process.env.DB_NAME,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT)
});

connection.connect();

export default connection;