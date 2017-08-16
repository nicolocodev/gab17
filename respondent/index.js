module.exports = function (context, queueMsg) {
    
    function isFollowedBy(connection) {
        return connection === 'followed_by';
    }

    context.log('Webhook was triggered!');
    
    var data = {
        screenname : queueMsg
    }

    if('screenname' in data) {        
        var Twit = require('twit');

        var T = new Twit({
            consumer_key:         process.env.ConsumerKey,
            consumer_secret:      process.env.ConsumerSecret,
            access_token:         process.env.AccessToken,
            access_token_secret:  process.env.AccessTokenSecret
        });
        
        T.get('friendships/lookup', { screen_name: data.screenname }, 
            function (err, friendsData, friendsResponse) {
                if(err) {
                    context.log('Error recuperando las conexiones para este usuario');
                    context.res = {
                        status: friendsResponse.statusCode,
                        body: { error : 'Error recuperando las conexiones para este usuario'}
                    };
                }
                else {
                    var friendship = friendsData[0];

                    if(friendship.connections.some(isFollowedBy) === true) {

                        var msg = { text: 'Aviso de inicio de sesion', screen_name: data.screenname };

                        T.post('direct_messages/new', msg,

                            function(err, messageData, messageResponse) {

                                if(err) {
                                    context.log('hubo un error al enviar mensaje directo ' + err);
                                    context.res = {
                                        status: messageResponse.statusCode,
                                        body: { error: 'hubo un error al enviar mensaje directo'}
                                    };
                                }
                                else{
                                    context.log('Se ha enviado el mensaje directo al usuario ' + data.screenname);                                
                                    context.res = {
                                        status: 201,
                                        body: { info: 'Se envio el mensaje al usuario'}
                                    };
                                }
                        });                                                                
                    }
                    //No sigue nuestra cuenta de twitter
                    else{
                        context.log("La cuenta " + data.screenname + " no sigue nuestra cuenta de twitter");                                
                        context.res = {
                            status: 200,
                            body: { action: 'direct_reply'}
                        };
                    }
                }
        });
    }
    //No enviaron el screename :(
    else {
        context.res = {
            status: 400,
            body: { error: 'Please pass screename properties in the input object'}
        };
    }
    context.done();
}