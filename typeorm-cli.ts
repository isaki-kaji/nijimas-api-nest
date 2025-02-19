import 'tsconfig-paths/register';
import dataSource from './src/db/data-source';

console.log('Using Database Config:');
console.log('Host:', process.env.DATASOURCE_HOST);
console.log('Port:', process.env.DATASOURCE_PORT);
console.log('Username:', process.env.DATASOURCE_USERNAME);
console.log('Database:', process.env.DATASOURCE_DATABASE);

export default dataSource;
