var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('streamdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'streamdb' database");
        db.collection('streams', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'streams' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving stream: ' + id);
    db.collection('streams', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('streams', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addStream = function(req, res) {
    var streamName = req.body.streamName;
    var stream = {
        name: "FIL stream: " + streamName.value,
        rtmp: "rtmp://live.soundcdn.com/live",
        iframe: "<iframe width='652' height='375' style='border:0px' border='0' scrolling='no' src='http://global.soundcdn.com/fil/" + streamName.value + "' overflow='hidden'></iframe>",
        embed: "<div>COMING SOON</div>",
        streamName: streamName.value,
        picture: "default-stream.jpg"
    };
    console.log('Adding stream: ' + JSON.stringify(stream));
    db.collection('streams', function(err, collection) {
        collection.insert(stream, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateStream = function(req, res) {
    var id = req.params.id;
    var stream = req.body;
    delete stream._id;
    console.log('Updating stream: ' + id);
    console.log(JSON.stringify(stream));
    db.collection('streams', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, stream, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating stream: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(stream);
            }
        });
    });
}

exports.deleteStream = function(req, res) {
    var id = req.params.id;
    console.log('Deleting stream: ' + id);
    db.collection('streams', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}