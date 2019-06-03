import { Sequelize } from 'sequelize';
import { dbPath } from './config.json';

const dbConnection = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// operatorsAliases: false,
	// SQLite only
	storage: dbPath
});

export default dbConnection;
