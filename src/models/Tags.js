import { Sequelize } from 'sequelize';
import dbConnection from '../dbConnection';

const Tags = dbConnection.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false
	}
});

export default Tags;
