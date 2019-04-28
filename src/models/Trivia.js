import { Sequelize } from 'sequelize';
import dbConnection from '../dbConnection';

const Trivia = dbConnection.define('trivia', {
	guildId: {
		type: Sequelize.STRING,
		unique: true
    },
	correctAnswer: Sequelize.STRING,
	hasTimerStarted: Sequelize.BOOLEAN,
	createdAt: Sequelize.NOW
});

export default Trivia;
