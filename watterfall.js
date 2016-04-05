var builder = require('botbuilder');

var bot = new builder.TextBot();

bot.add('/', [
    function (session) {
        session.dialogData.answers = [];
        builder.Prompts.text(session, 'Hello');
    },
    function (session, results) {
        session.dialogData.answers.push(results.response);
        builder.Prompts.text(session, 'World');
    },
    function (session, results) {
        session.dialogData.answers.push(results.response);
        builder.Prompts.text(session, 'Foo');
    },
    function (session, results) {
        session.dialogData.answers.push(results.response);
        session.send('Bar! ' + session.dialogData.answers);
    }
]);

bot.listenStdin();
