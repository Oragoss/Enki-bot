import fetch from 'node-fetch';
// import winston from 'winston';
import { timeoutTime } from '../../config.json';
import Trivia from '../models/Trivia';
//TODO use this instead of the absolute url
// import triviaLink from '../../config.json';

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
        const doubleQuotes = /&quot;/g;
        const singleQuotes = /&#039;/g;

        const question = `${data.results[0].question.replace(doubleQuotes, '"')}`;
        data.results[0].question.replace(singleQuotes, '\'');
        const correctAnswer = ` ${data.results[0].correct_answer.replace(doubleQuotes, '"')}`;
        correctAnswer.replace(singleQuotes, '\'');

        let answerArray = [correctAnswer];
        data.results[0].incorrect_answers.map((elem) => {
            elem.replace(doubleQuotes, '"');
            return answerArray.push(` ${elem}`);
        });

        const rand = Math.floor(Math.random() * 4);
        if (rand === 1) {
            const replacement = answerArray[2].replace(singleQuotes, '\'');
            answerArray.splice(0, 1, replacement);
            answerArray.splice(2, 1, correctAnswer);
            answerArray = this.formatAnswerArray(answerArray);
            this.storeAnswer(message, 'c');
        }
        else if (rand === 2) {
            const replacement = answerArray[1].replace(singleQuotes, '\'');
            answerArray.splice(0, 1, replacement);
            answerArray.splice(1, 1, correctAnswer);
            answerArray = this.formatAnswerArray(answerArray);
            this.storeAnswer(message, 'b');
        }
        else if (rand === 3) {
            const replacement = answerArray[3].replace(singleQuotes, '\'');
            answerArray.splice(0, 1, replacement);
            answerArray.splice(3, 1, correctAnswer);
            answerArray = this.formatAnswerArray(answerArray);
            this.storeAnswer(message, 'd');
        }
        else {
            answerArray = this.formatAnswerArray(answerArray);
            this.storeAnswer(message, 'a');
        }

        return Promise.resolve(message.channel.send(`${question}\n ${answerArray.toString()}`));
    }

    static async trueFalseQuestion(message, data) {
        const doubleQuotes = /&quot;/g;
        const singleQuotes = /&#039;/g;

        const question = `True or False: ${data.results[0].question.replace(doubleQuotes, '"')}`;
        data.results[0].question.replace(singleQuotes, '\'');
        console.log(question);

        const correctAnswer = ` ${data.results[0].correct_answer.replace(doubleQuotes, '"')}`;
        correctAnswer.replace(singleQuotes, '\'');

        this.storeAnswer(message, correctAnswer.toLowerCase());
        return Promise.resolve(message.channel.send(`${question}`));
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
        return [`A) ${answerArray[0]}, B) ${answerArray[1]}, C) ${answerArray[2]}, D) ${answerArray[3]}`];
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

                return message.reply('Correct!');
            }
            message.reply('Sorry, wrong answer...');
        }
        else {
            message.reply('You need to first start a game with the `!trivia` command');
        }
    }

    static turnOffTrivia() {
        repeat = false;
    }
}
