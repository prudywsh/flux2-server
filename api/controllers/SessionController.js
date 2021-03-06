/**
 * SessionController
 *
 * @description :: Server-side logic for managing Sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * @api {post} /session/subscribe Subscribe to new items
     * @apiName subscribe
     * @apiGroup Session
     * @apiDescription Subscribe to all new items.
     */
    subscribe: function(req, res) {
        if (Team.can(req, 'session/read')) {
            Session.watch(req);
            Session.find().exec((error, items) => {
                if (error) return res.negotiate(error);
                Session.subscribe(req, _.pluck(items, 'id'));
                return res.ok();
            });
        }
        else {
            return res.ok();
        }
    },

    /**
     * @api {post} /session/unsubscribe Unsubscribe from new items
     * @apiName subscribe
     * @apiGroup Session
     * @apiDescription Unsubscribe from new items
     */
    unsubscribe: function(req, res) {
        Session.unwatch(req);
        Session.find().exec((error, items) => {
            if (error) return res.negotiate(error);
            Session.unsubscribe(req, _.pluck(items, 'id'));
            return res.ok();
        });
    },

    find: function(req, res) {
        // Check permissions
        if (!(Team.can(req, 'session/read') )) {
            return res.error(403, 'forbidden', "You are not allowed to read the sessions");
        }

        Session.find().exec((error, sessions) => {
            if (error) return res.negotiate(error);
            return res.ok(sessions);
        });
    },

    open: function(req, res) {

        // Debug sessions
        /*
        if(req.param('token', null)) {
            sails.log.debug('open : ' + req.user.name + ' (' + req.team.name + '): Android('+sails.sockets.getId(req)+', '+req.param('token', '').substr(0, 32)+', '+req.param('deviceId', '')+')')
        }
        else {
            sails.log.debug('open : ' + req.user.name + ' (' + req.team.name + '): Browser('+sails.sockets.getId(req) + ')')
        }
        */

        const newSession = {
            user: req.user,
            socketId: sails.sockets.getId(req),
        };

        // check if this device already exists in the database
        let filter = [{ socketId: sails.sockets.getId(req) }];
        if(req.param('deviceId')) filter.push({ deviceId: req.param('deviceId')});
        if(req.param('token')) filter.push({ firebaseToken: req.param('token') });

        Session.findOne(filter)
        .exec((error, session) => {
            if (error) return res.negotiate(error);

            // if a session already exists, update the session
            if (session) {
                session.user = req.user;
                session.lastAction = Date.now();
                session.socketId = sails.sockets.getId(req);
                session.firebaseToken = req.param('token', null);
                session.deviceId = req.param('deviceId', null),

                session.save(err => {
                    if (err) return res.negotiate(err);

                    return res.ok({message: "session updated"});
                });
            }
            else {
                let session = {};
                session.user = req.user;
                session.lastAction = Date.now();
                session.socketId = sails.sockets.getId(req);
                session.firebaseToken = req.param('token', null);
                session.deviceId = req.param('deviceId', null),

                Session.create(session).exec((error, session) => {
                    if (error) return res.negotiate(error);

                    return res.ok({message: "new session"});
                });
            }
        });
    },
};
