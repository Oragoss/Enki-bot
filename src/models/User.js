import { Sequelize } from 'sequelize';
import dbConnection from '../dbConnection';

const User = dbConnection.define('user', {
	name: {
		type: Sequelize.STRING,
		unique: true
    },
    experience: Sequelize.STRING,
    numberOfCorrectAnswers: Sequelize.NUMBER,
    numberOfIncorrectAnswers: Sequelize.NUMBER,
    totalNumberOfAnswers: Sequelize.NUMBER,
    createdAt: Sequelize.NOW,
    modifiedAt: Sequelize.NOW
});

export default User;
