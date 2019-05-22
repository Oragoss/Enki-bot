import fetch from 'node-fetch';
import Discord from 'discord.js';
// import winston from 'winston';
import { timeoutTime } from '../../config.json';
import Trivia from '../models/Trivia';
import UserService from './UserService';

let time = null;
let repeat = true;

export default class TriviaService {
    //TODO: Implement winston
    static async getQuestion(message) {
        if (await this.canGetQuestion(message)) {
            fetch('https://opentdb.com/api.php?amount=1', { credentials: 'include' })
            .then(response => response.json())
            .then((data) => {
                if (data.results[0].type === 'multiple') {
                    this.multipleChoice(message, data);
                }
                else if (data.results[0].type === 'boolean') {
                    this.trueFalseQuestion(message, data);
                }
            });
        }
        else {
            message.reply('Please wait until this round is over before starting a new one');
        }
    }

    static async canGetQuestion(message) {
        try {
            const inUse = await Trivia.findOne({ where: { guildId: message.guild.id } });
            if (inUse) return false; //If a guild id is found then do not allow for another question to appear

            repeat = true;
            return true;
        }
        catch (err) {
            repeat = true;
            return true;
        }
    }

    static async multipleChoice(message, data) {
        const question = `${this.formatString(data.results[0].question)}`;
        const correctAnswer = ` ${this.formatString(data.results[0].correct_answer)}`;

        let answerArray = [correctAnswer];
        data.results[0].incorrect_answers.map((elem) => {
            return answerArray.push(` ${this.formatString(elem)}`);
        });

        const rand = Math.floor(Math.random() * 4);
        if (rand === 1) {
            answerArray.splice(0, 1, answerArray[2]);
            answerArray.splice(2, 1, correctAnswer);
            answerArray = this.formatAnswerArray(answerArray);
            this.storeAnswer(message, 'c');
        }
        else if (rand === 2) {
            answerArray.splice(0, 1, answerArray[1]);
            answerArray.splice(1, 1, correctAnswer);
            answerArray = this.formatAnswerArray(answerArray);
            this.storeAnswer(message, 'b');
        }
        else if (rand === 3) {
            answerArray.splice(0, 1, answerArray[3]);
            answerArray.splice(3, 1, correctAnswer);
            answerArray = this.formatAnswerArray(answerArray);
            this.storeAnswer(message, 'd');
        }
        else {
            answerArray = this.formatAnswerArray(answerArray);
            this.storeAnswer(message, 'a');
        }

        const embeddedMessage = new Discord.RichEmbed()
        .setColor('#0099ff')
		.setTitle(`${question}`)
		.setDescription('Answer with `!a <answer>`')
		.addField('A', answerArray[0].toString())
		.addField('B', answerArray[1].toString())
		.addField('C', answerArray[2].toString())
		.addField('D', answerArray[3].toString())
        .setTimestamp()
		.setFooter('Think you can guess?', 'https://i.imgur.com/8zShjHx.png');

        return Promise.resolve(message.channel.send(embeddedMessage));
    }

    static async trueFalseQuestion(message, data) {
        const question = `True or False: ${this.formatString(data.results[0].question)}`;
        const correctAnswer = `${this.formatString(data.results[0].correct_answer)}`;

        const embeddedMessage = new Discord.RichEmbed()
        .setColor('#0099ff')
		.setTitle(`${question}`)
		.setDescription('Answer with `!a <answer>`')
		.addField('True', '!true')
        .addField('False', '!false')
        .setTimestamp()
        .setFooter('Think you can guess?', 'https://i.imgur.com/8zShjHx.png');

        this.storeAnswer(message, correctAnswer.toLowerCase());

        return Promise.resolve(message.channel.send(embeddedMessage));
    }

    static async storeAnswer(message, correctAnswer) {
        await Trivia.sync({ force: true }).then(() => {
            Trivia.create({
                guildId: message.guild.id,
                correctAnswer,
                createdAt: Date.now()
            });
        });
        time = setTimeout(() => {
            if (repeat) {
                this.getQuestion(message);
            }
            message.channel.send(`Time's up! The correct answer was: \`${correctAnswer}!\``);
            Trivia.destroy({ where: { guildId: message.guild.id } });
        },
        timeoutTime);
    }

    static formatAnswerArray(answerArray) {
        return [`${answerArray[0]},`, `${answerArray[1]},`, `${answerArray[2]},`, `${answerArray[3]}`];
    }

    static formatString(string) {
        const doubleQuotes = /&quot;/g;
        const singleQuotes = /&#039;/g;
        const ampersand = /&amp;/g;
        const degree = /&deg;/g;

        const noDoubleQuotes = string.replace(doubleQuotes, '"');
        const noSingleQuotes = noDoubleQuotes.replace(singleQuotes, '\'');
        const noAmpersands = noSingleQuotes.replace(ampersand, '&');
        const noDegree = noAmpersands.replace(degree, '°');

        return noDegree;
    }

    static async answerQuestion(message, args) {
        if (!await this.canGetQuestion(message)) {
            const result = await Trivia.findOne({ where: { guildId: message.guild.id, correctAnswer: args[0].toLowerCase() } });

            if (result) {
                await Trivia.destroy({ where: { guildId: message.guild.id } });
                clearTimeout(time);

                if (repeat) {
                    this.getQuestion(message);
                }

                const embeddedMessage = new Discord.RichEmbed()
                .setColor('#0dd306')
                .setTitle('Correct!')
                .setTimestamp();
                console.log('Correct answer');
                await UserService.storeCorrectAnswer(message);
                return message.reply(embeddedMessage);
            }

            const embeddedMessage = new Discord.RichEmbed()
            .setColor('#d30c20')
            .setTitle('Incorrect')
            .setTimestamp();

            console.log('Incorrect answer');
            await UserService.storeIncorrectAnswer(message);
            message.reply(embeddedMessage);
        }
        else {
            const embeddedMessage = new Discord.RichEmbed()
            .setColor('#FF6600')
            .setTitle('You need to first start a game with the `!trivia` command')
            .setTimestamp();

            message.reply(embeddedMessage);
        }
    }

    //TODO: Clean up the last 50 of your messages?
    static turnOffTrivia(message) {
        repeat = false;
        clearTimeout(time);
        Trivia.destroy({ where: { guildId: message.guild.id } });

        const embeddedMessage = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle('I\'ll just go back to sleep then...')
            .setTimestamp();

        message.channel.send(embeddedMessage);
    }
}
