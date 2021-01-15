import connection from '../';

export default {

  createUserTable(){

    return new Promise((resolve,reject)=>{

      connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          user_id SERIAL NOT NULL,
          user_name VARCHAR(256) NOT NULL,
          user_email VARCHAR(256) NOT NULL,
          user_password VARCHAR(64) NOT NULL,
          user_photo VARCHAR
        )
      `, [], (err, result)=>{

        if(err){
          reject(err);
        } else {
          resolve(result);
        }

      });

    });
    

  }

}
