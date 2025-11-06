import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',          // tu usuario
  password: '',          // tu contraseña
  database: 'proyect',   // nombre de tu BD
});
