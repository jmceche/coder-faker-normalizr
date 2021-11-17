const mysql = {
  client: 'mysql',
  connection: {
    host : 'localhost',
    port : 3306,
    user : 'admin',
    password : '0KZbeHITi3pl',
    database : 'coderback'
  },
  pool: { min: 2, max: 8}
};

export default mysql; 