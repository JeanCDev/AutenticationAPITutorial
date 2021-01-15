import connection from '../database';
import bcrypt from 'bcrypt';
import fs from 'fs';

export default class User{

  private userId: number | undefined;
  private userName: string | undefined;
  private userEmail: string | undefined;
  private userPassword: string | undefined;
  private userPhoto: string | undefined;

  constructor(){

    this.userId;
    this.userName;
    this.userEmail;
    this.userPassword;
    this.userPhoto;

  }

  get id(){
    return this.userId;
  }
  set id(value){
    this.userId = value;
  }

  get name(){
    return this.userName;
  }
  set name(value){
    this.userName = value;
  }

  get email(){
    return this.userEmail;
  }
  set email(value){
    this.userEmail = value;
  }

  get password(){
    return this.userPassword;
  }
  set password(value){
    this.userPassword = value;
  }

  get photo(){
    return this.userPhoto;
  }
  set photo(value){
    this.userPhoto = value;
  }

  // get all users from database
  static getAll(){

    return new Promise((resolve, reject) =>{

      connection.query(`
        SELECT * FROM users
      `, [], (err, result)=>{
        
        if(err){
          reject(err);
        } else{

          let users: object[] = [];

          result.rows.forEach(row =>{

            let user = new User();

            user.fillUserInfo(row);

            users.push(user);

          });

          resolve(users);
        }

      });

    });

  }

  // get user by id from database
  getUserById(id: number){

    return new Promise((resolve, reject) =>{

      connection.query(`
        SELECT * FROM users WHERE user_id = $1
      `, [id], (err, result)=>{

        if(!result.rows[0]){
          reject(err);
        } else{

          if(err){
            reject(err);
          } else{
  
            this.fillUserInfo(result.rows[0]);
  
            resolve(this);
          }

        }

      });

    });

  }

  // insert user into database
  insert(
    userName: string, userEmail: string, 
    userPassword: string, userPhoto: string){

    return new Promise((resolve, reject) =>{

      const imgURL = userPhoto.replace(`\\`,'/');

      this.hashPassword(userPassword).then(hash =>{

        connection.query(`
          INSERT INTO users(
            user_name,
            user_email,
            user_password,
            user_photo
          ) VALUES($1, $2, $3, $4)
        `,[userName, userEmail, hash, imgURL], (err, result)=>{

          if(err){
            reject(err);
          } else{
            resolve(result);
          }

        });

      }).catch(err =>{
        reject(err);
      });

    });

  }

  // Get user from database by email and compare the hash with password
  validateUser(email: string, password: string){

    return new Promise((resolve, reject) =>{

      connection.query(`
        SELECT * FROM users WHERE user_email = $1
      `, [email], (err, result)=>{

        if(!result.rows[0]){
          reject(err);
        } else {

          let hash = result.rows[0].user_password;

          this.compareHash(password, hash).then(ok=>{

            if(!ok){
              reject(err);
            } else {
              this.fillUserInfo(result.rows[0]);
            }

            if(err){
              reject(err);
            } else{    
              resolve(this);
            }

          }).catch(err=>{
            reject(err);
          });

        }        

      });

    });

  }

  // updates user information
  update(
    id:number, newName: string, newEmail: string, 
    newPassword: string, userPhoto: string){

      const imgURL = userPhoto.replace(`\\`,'/');

      return new Promise((resolve, reject) =>{

        fs.unlink(String(this.photo), err =>{
          if(err){
            reject(err);
            return;
          }
        });

        this.hashPassword(newPassword).then(hash=>{

          connection.query(`
            UPDATE users 
            SET 
              user_name = $1,
              user_email = $2,
              user_password = $3,
              user_photo= $4
            WHERE user_id = $5
          `, [newName, newEmail, hash, imgURL, id], (err, result)=>{

            if(err){
              reject(err);
            } else{
              resolve(result);
            }

          });

        }).catch(err=>{
          reject(err);
        });

      });

  }

  // Delete user from database
  delete(id:number){

    return new Promise((resolve, reject) =>{

      connection.query(`
        DELETE FROM users WHERE user_id = $1
      `, [id], (err, result)=>{

        fs.unlink(String(this.photo), err =>{
          if(err){
            reject(err);
            return;
          }
        });

        if(err){
          reject(err);
        } else{
          resolve(result);
        }

      });

    });

  }

  // create a hash from the original password
  hashPassword(password:string){

    return new Promise((resolve, reject) =>{

      bcrypt.hash(password, 10, (err, hash) =>{

        if(err){
          reject(err);
        } else{
          resolve(hash);
        }

      });

    });

  }

  // compare hash with inserted password
  compareHash(password:string, hash:string){

      return new Promise((resolve, reject) =>{

        bcrypt.compare(password, hash, (err, result)=>{

          if(err){
            reject(err);
          } else{
            resolve(result);
          }

        });

      });

  }

  // Formata as informações do usuário vindas do banco de dados
  fillUserInfo(data:any){

    this.id = data.user_id;
    this.name = data.user_name;
    this.email = data.user_email;
    this.password = data.user_password;
    this.photo = data.user_photo;

  }

}