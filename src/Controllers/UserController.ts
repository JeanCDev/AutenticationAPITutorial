import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../Models/User';

export default {

  async index(req: Request, res: Response){

    try {

      await User.getAll().then(result=>{

        res.send(result);

      }).catch(err=>{
        res.send('Users not found');
      });

    } catch (err){
      res.send('Users not found');
    }

  },

  async getUser(req: Request, res: Response){

    const id = Number(req.params.id);

    try {

      let user = new User();

      await user.getUserById(id).then(result=>{

        res.send(result);

      }).catch(err=>{
        res.send('User not found');
      });

    } catch (err){
      res.send('User not found');
    }

  },

  async insert(req: Request, res: Response){

    try{

      const photo = req.file;

      const { 
        user_name,
        user_email,
        user_password,
      } = req.body;
  
      let user = new User();
  
      await user.insert(user_name, user_email, user_password, photo.path).then((result)=>{
  
        res.send('User Inserted Successfully');
  
      }).catch(err => {
        res.send('Error to Insert User');
      });

    } catch (err){
      res.send('Error to Insert User');
    }

  },

  async update(req: Request, res: Response){

    try{ 

      const photo = req.file;

      const id = Number(req.params.id);

      const {
        new_name,
        new_email,
        new_password
      } = req.body;

      let user = new User();

      await user.getUserById(id).then(async (result)=>{

        await user.update(id, new_name, new_email, new_password, photo.path)
          .then((result)=>{

          res.send('User updated Successfully');

        }).catch(err=>{
          res.send('User not found');
        });

      }).catch(err => {res.send(err)});

    } catch (err){
      res.send('User not found');
    }

  },

  async destroy(req: Request, res: Response){

    const id = Number(req.params.id);

    try{

      let user = new User();

      await user.getUserById(id).then(async (result)=>{

        await user.delete(id).then(result=>{

          res.send('User Deleted Successfully');
  
        }).catch (err=>{
          res.send('User not found')
        });

      }).catch (err=>{res.send('User not found')})

    } catch (err){
      res.send('User not found');
    }

  },

  async login(req: Request, res: Response){

    let user = new User();

    const {user_email, user_password} = req.body;

    try{

      await user.validateUser(user_email, user_password).then((result: any)=>{

        const tokenSecret = String(process.env.TOKEN_SECRET);

        const token = jwt.sign({
          id: result.id,
          email: result.email,
          photo: result.photo,
        }, tokenSecret, {
          expiresIn:43200
        });

        res.header('token', token).send(token);

      }).catch(err=>res.send('Senha ou Email inseridos estão incorretos'));

    } catch (err){
      res.send('Senha ou Email inseridos estão incorretos');
    }

  }

}