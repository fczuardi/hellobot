var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();

// var bot = new builder.TextBot();
var bot = new builder.BotConnectorBot();

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
        builder.Prompts.confirm(session, 'Are you sure?');
    },
    function (session, results) {
        console.log(results);
        if (results.response === true) {
            session.send('Bar! ' + session.dialogData.answers);
        } else {
            session.send('Ok, again then…');
        }
    }
]);

// bot.listenStdin();

server.use(bot.verifyBotFramework({
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET })
);
server.post('/v1/messages', bot.listen());

server.listen(8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});
