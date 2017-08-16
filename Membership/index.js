var jwt = require('jwt-simple');

var secret = 'SuperSecret';

var users = [
    {
        user: 'hugo',
        pass: 'pass'
    },
    {
        user: 'paco',
        pass: 'pass'
    },
    {
        user: 'luis',
        pass: 'pass'
    }
];

module.exports = function (context, req) {

    //context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);



    if (req.body && req.body.user && req.body.pass) {

        var user = users.filter(function (u) {
            return u.user === req.body.user && u.pass === req.body.pass;
        })[0];

        if (user) {
            //TODO: Cargar los Claims
            var payload = { ciudad: "Bogota DC" };
            var token = jwt.encode(payload, secret);
            context.res = {
                body: JSON.stringify({
                    user: user.user,
                    token: token
                })
            };
        }
        else {
            context.res = {
                status: 400,
                body: "Usuario o contraseña incorrectos"
            };
        }
    }
    else {
        context.res = {
            status: 400,
            body: "Bad Request"
        };
    }
    context.done();
};
