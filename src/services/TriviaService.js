import fetch from 'node-fetch';
// import winston from 'winston';
import { timeout } from '../../config.json';
import Trivia from '../models/Trivia';
//TODO use this instead of the absolute url
// import triviaLink from '../../config.json';

let time = null;

export default class TriviaService {
    //TODO: Implement winston
    static async getQuestion(message) {
        //TODO: Fix this
        // if (await this.canGetQuestion(message)) {
            fetch('https://opentdb.com/api.php?amount=1', { credentials: 'include' })
            .then(response => response.json())
            .then((data) => {
                if (data.results[0].type === 'multiple') {
                    this.multipleChoice(message, data);
                }
                else if (data.results[0].type === 'boolean') {
                    message.channel.send('Still gotta implement true or false');
                    // this.trueFalseQuestion(message, data);
                }
            });
        // }
        // else {
        //     message.reply('Please wait until this round is over before starting a new one');
        // }
    }

    static async canGetQuestion(message) {
        //=====================================
        // TODO: For some reason this always causes an error.
        //=====================================
        const inUse = await Trivia.findOne({ where: { guildId: message.guild.id } });
        if (inUse) return false; //If a guild id is found then do not allow for another question to appear

        return true;
    }

    static async multipleChoice(message, data) {
        const regex = /&quot;/g;
        const regex2 = /&#039;/g;

        const question = `${data.results[0].question.replace(regex, '"')}`;
        question.replace(regex2, '\'');
        const correctAnswer = ` ${data.results[0].correct_answer.replace(regex, '"')}`;
        correctAnswer.replace(regex2, '\'');
        const answerArray = [correctAnswer];
        data.results[0].incorrect_answers.map((elem) => {
            elem.replace(regex, '"');
            return answerArray.push(` ${elem}`);
        });

        const rand = Math.floor(Math.random() * 4);
        if (rand === 1) {
            const replacement = answerArray[2].replace(regex2, '\'');
            answerArray.splice(0, 1, replacement);
            answerArray.splice(2, 1, correctAnswer);
            this.storeAnswer(message, 'c');
        }
        else if (rand === 2) {
            const replacement = answerArray[1].replace(regex2, '\'');
            answerArray.splice(0, 1, replacement);
            answerArray.splice(1, 1, correctAnswer);
            this.storeAnswer(message, 'b');
        }
        else if (rand === 3) {
            const replacement = answerArray[3].replace(regex2, '\'');
            answerArray.splice(0, 1, replacement);
            answerArray.splice(3, 1, correctAnswer);
            this.storeAnswer(message, 'd');
        }
        else {
            this.storeAnswer(message, 'a');
        }

        return Promise.resolve(message.channel.send(`${question}\n ${answerArray.toString()}`));
    }

    // static async trueFalseQuestion(message, data) {

    // }

    static async storeAnswer(message, correctAnswer) {
        await Trivia.sync({ force: true }).then(() => {
            Trivia.create({
                guildId: message.guild.id,
                correctAnswer,
                hasTimerStarted: true,
                createdAt: Date.now()
            });
        });
        time = setTimeout(() => message.channel.send(`Time's up! The correct answer was ${correctAnswer}!`), timeout);
    }

    static async answerQuestion(message, args) {
        const result = await Trivia.findOne({ where: { guildId: message.guild.id, correctAnswer: args[0] } });
        // await Trivia.findOne({ where: { guildId: message.guild.id } }).getDataValue('hasTimerStarted')

        if (result) {
            //TODO //Delete the entry for that server
            clearTimeout(time);
            return message.channel.send('Correct!');
        }
        message.channel.send('Sorry, wrong answer...');
    }
}
