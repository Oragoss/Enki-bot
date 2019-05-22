import Discord from 'discord.js';
import { Sequelize } from 'sequelize';
import { xpGainedPerQuestion } from '../../config.json';
import User from '../models/User';

export default class UserService {
    // static async storeAnswer(message, correctAnswer) {
    //     const xp = await this.canStoreAnswer(message);
    //     if (!xp) return;

    //     xp.experience += xpGainedPerQuestion;

    //     if (correctAnswer) {
    //         xp.numberOfCorrectAnswers += 1;
    //     }
    //     else {
    //         xp.numberOfIncorrectAnswers += 1;
    //     }
    //     xp.totalNumberOfAnswers += 1;

    //     try {
    //         await User.sync({ force: true }).then(() => {
    //             User.create({
    //                 experience: xp.experience,
    //                 numberOfCorrectAnswers: xp.numberOfCorrectAnswers,
    //                 numberOfIncorrectAnswers: xp.numberOfIncorrectAnswers,
    //                 totalNumberOfAnswers: xp.totalNumberOfAnswers,
    //                 modifiedAt: Sequelize.NOW
    //             });
    //         });
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // }

    static async storeCorrectAnswer(message) {
        const xp = await this.canStoreAnswer(message);
        if (!xp) return;

        console.log(xpGainedPerQuestion);
        xp.experience += Number(xpGainedPerQuestion);
        console.log('Correct Answer method:', xp.experience);
        xp.numberOfCorrectAnswers += 1;
        console.log('Correct Answer method:', xp.numberOfCorrectAnswers);
        xp.totalNumberOfAnswers += 1;
        console.log('Correct Answer method:', xp.totalNumberOfAnswers);

        try {
            await User.sync().then(() => {
                User.create({
                    experience: xp.experience,
                    numberOfCorrectAnswers: xp.numberOfCorrectAnswers,
                    totalNumberOfAnswers: xp.totalNumberOfAnswers,
                    modifiedAt: Sequelize.NOW
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    static async storeIncorrectAnswer(message) {
        const xp = await this.canStoreAnswer(message);
        if (!xp) return;

        console.log(xpGainedPerQuestion);
        // xp.experience += xpGainedPerQuestion;
        // xp.numberOfIncorrectAnswers += 1;
        // xp.totalNumberOfAnswers += 1;
        xp.experience += Number(xpGainedPerQuestion);
        console.log('Correct Answer method:', xp.experience);
        xp.numberOfIncorrectAnswers += 1;
        console.log('Correct Answer method:', xp.numberOfIncorrectAnswers);
        xp.totalNumberOfAnswers += 1;
        console.log('Correct Answer method:', xp.totalNumberOfAnswers);

        try {
            await User.sync().then(() => {
                User.create({
                    experience: xp.experience,
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
            await this.createNewUser(message.author.id, message.author.username);
            //TODO: Return a damn message
            return true;
        }
    }

    static async displayScore(message) {
        try {
            const user = await User.findOne({ where: { discordId: message.author.id } });

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
            await this.createNewUser(message.author.id, message.author.username);
            return false;
        }
    }

    static async createNewUser(id, username) {
        return User.sync({ force: true }).then(() => {
            User.create({
                discordId: id,
                username,
                experience: 0,
                numberOfCorrectAnsers: 0,
                numberOfIncorrectAnswers: 0,
                totalNumberOfAnswers: 0,
                createdAt: Sequelize.NOW,
                modifiedAt: Sequelize.NOW
            });
        });
    }
}
