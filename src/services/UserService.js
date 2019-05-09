import Discord from 'discord.js';
import { Sequelize } from 'sequelize';
import { xpGainedPerQuestion } from '../../config.json';
import User from '../models/User';

export default class UserService {
    static async storeAnswer(message, correctAnswer) {
        const xp = await this.canStoreAnswer(message);
        if (!xp) return;

        xp.experience += xpGainedPerQuestion;

        if (correctAnswer) {
            xp.numberOfCorrectAnswers += 1;
        }
        else {
            xp.numberOfIncorrectAnswers += 1;
        }
        xp.totalNumberOfAnswers += 1;

        try {
            await User.sync({ force: true }).then(() => {
                User.create({
                    experience: xp.experience,
                    numberOfCorrectAnswers: xp.numberOfCorrectAnswers,
                    numberOfIncorrectAnswers: xp.numberOfIncorrectAnswers,
                    totalNumberOfAnswers: xp.totalNumberOfAnswers,
                    modifiedAt: Sequelize.NOW
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    static async canStoreAnswer(message) {
        try {
            const inUse = await User.findOne({ where: { discordId: message.author.id } });

            if (inUse) return inUse; //If a user is found then return that user

            return false;
        }
        catch (err) {
            await User.sync({ force: true }).then(() => {
                User.create({
                    discordId: message.author.id,
                    username: message.author.username,
                    experience: 0,
                    numberOfCorrectAnsers: 0,
                    numberOfIncorrectAnswers: 0,
                    totalNumberOfAnswers: 0,
                    createdAt: Sequelize.NOW,
                    modifiedAt: Sequelize.NOW
                });
            });
            return false;
        }
    }

    static async displayScore(message) {
        try {
            const user = await User.findOne({ where: { discordId: message.author.id } });
            // console.log(user);
            console.log(message.author.username);

            const embeddedMessage = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle(`${message.author.username}'s score!`)
            .setDescription('This is your score for playing trivia.')
            .addField('Number of correct answers', user.numberOfCorrectAnswers)
            .addField('Number of incorrect answers', user.numberOfIncorrectAnswers)
            .addField('Total number of attempted answers', user.totalNumberOfAnswers)
            .addField('Accuracy', ((user.numberOfCorrectAnswers / user.totalNumberOfAnswers) * 100) + '%')
            .setTimestamp()
            .setFooter('You rock!', 'https://i.imgur.com/8zShjHx.png');

            return Promise.resolve(message.channel.send(embeddedMessage));
        }
        catch (err) {
            await User.sync({ force: true }).then(() => {
                User.create({
                    discordId: message.author.id,
                    username: message.author.username,
                    experience: 0,
                    numberOfCorrectAnsers: 0,
                    numberOfIncorrectAnswers: 0,
                    totalNumberOfAnswers: 0,
                    createdAt: Sequelize.NOW,
                    modifiedAt: Sequelize.NOW
                });
            });
            return false;
        }
    }
}
