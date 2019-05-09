import { Sequelize } from 'sequelize';
import dbConnection from '../dbConnection';

const User = dbConnection.define('user', {
  id: { type: Sequelize.STRING, primaryKey: true },
	discordId: {
		type: Sequelize.STRING,
		unique: true
  },
  username: Sequelize.STRING,
  experience: Sequelize.STRING,
  numberOfCorrectAnswers: Sequelize.NUMBER,
  numberOfIncorrectAnswers: Sequelize.NUMBER,
  totalNumberOfAnswers: Sequelize.NUMBER,
  createdAt: Sequelize.NOW,
  modifiedAt: Sequelize.NOW
});

export default User;
