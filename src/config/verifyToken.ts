import jwt from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';
import 'dotenv/config';

export default function verifyToken(
  req: Request, res: Response, next: NextFunction){

  const token = req.header('token');

  if (!token) return res.status(401).send('Access Denied');

  try {

    const tokenSecret = String(process.env.TOKEN_SECRET);

    const verified = jwt.verify(token, tokenSecret);

    req.user = verified;

    next();

  } catch (err) {
    res.status(400).send('Access Denied');
  }

}