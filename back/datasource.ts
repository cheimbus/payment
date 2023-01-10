// import { DataSource } from 'typeorm';
// import dotenv from 'dotenv';
// import { Order } from 'src/entitis/Order';
// import { Payment } from 'src/entitis/Payment';

// dotenv.config();
// const dataSource = new DataSource({
//   type: 'mysql',
//   host: 'localhost',
//   port:
//     3306,
//   username:
//     'root',
//   password:
//     '123123123',
//   database:
//     'exam',
//   entities: [Order, Payment],
//   charset: 'utf8mb4',
//   synchronize: false,
//   logging: true,
// });

// export default dataSource;
// dataSource
//   .initialize()
//   .then(() => console.log('Data Source has been initialized'))
//   .catch((error) => console.error('Error initializing Data Source', error));
