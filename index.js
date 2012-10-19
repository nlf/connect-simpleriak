var simpleriak = require('simpleriak');

module.exports = function (connect) {
    var Store = connect.session.Store;

    function SimpleRiakStore(options) {
        options = options || {};
        Store.call(this, options);
        if (!options.host) options.host = 'localhost';
        if (!options.port) options.port = 8098;
        if (!options.bucket) options.bucket = '_sessions';
        this.client = simpleriak.createClient({ host: options.host, port: options.port, bucket: options.bucket });
    }

    SimpleRiakStore.prototype.__proto__ = Store.prototype;

    SimpleRiakStore.prototype.get = function (sid, callback) {
        var encodedSid = encodeURIComponent(sid);
        this.client.get({ key: encodedSid }, function (err, reply) {
            if (reply.statusCode === 404) return callback();
            if (err) return callback(err);
            callback(null, reply.data);
        });
    };

    SimpleRiakStore.prototype.set = function (sid, session, callback) {
        var encodedSid = encodeURIComponent(sid);
        this.client.set({ key: encodedSid, data: session }, callback);
    };

    SimpleRiakStore.prototype.destroy = function (sid, callback) {
        var encodedSid = encodeURIComponent(sid);
        this.client.del({ key: encodedSid }, callback);
    };

    return SimpleRiakStore;
};
