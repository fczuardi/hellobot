var restify = require('restify');
var builder = require('botbuilder');

console.log('process.env.BOT_ENV', process.env.BOT_ENV);

var myTextBot = new builder.TextBot();
var myConnectorBot = new builder.BotConnectorBot();

var mainDialog = [
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
];

switch (process.env.BOT_ENV){
    case 'dev':
        myTextBot.add('/', mainDialog);
        myTextBot.listenStdin();
        break;
    default:
        var server = restify.createServer();
        console.log(process.env.APP_ID);
        console.log(process.env.APP_SECRET);

        myConnectorBot.add('/', mainDialog);
        server.use(myConnectorBot.verifyBotFramework({
            appId: process.env.APP_ID,
            appSecret: process.env.APP_SECRET })
        );
        server.post('/v1/messages', myConnectorBot.listen());
        server.listen(8080, function () {
            console.log('%s listening to %s', server.name, server.url);
        });
        break;
}
