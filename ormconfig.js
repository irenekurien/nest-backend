const dataSource = {
  type: 'sqlite',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '12345',
  database: 'db.sqlite',
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['migrations/*.js'],
};

module.exports = dataSource;


// import { DataSource } from "typeorm";


// export const dataSource = new DataSource({
//   type: 'sqlite',
//   host: 'localhost',
//   port: 3306,
//   username: 'root',
//   password: '12345',
//   database: 'db.sqlite',
//   entities: ['dist/src/**/*.entity.js'],
//   migrations: ['migrations/*.js'],
// });