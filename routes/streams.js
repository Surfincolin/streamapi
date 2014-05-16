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
    //res.setHeader('Access-Control-Allow-Origin','*');
    var id = req.params.id;
    console.log('Retrieving stream: ' + id);
    db.collection('streams', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    //res.setHeader('Access-Control-Allow-Origin','*');
    db.collection('streams', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send({"streams": items});
            //res.send(items);
        });
    });
};

exports.addStream = function(req, res) {
    //res.setHeader('Access-Control-Allow-Origin','*');
    var stream = req.body;
    console.log('Adding stream: ' + JSON.stringify(stream));
    db.collection('streams', function(err, collection) {
        collection.insert(stream.stream, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send({"stream": result[0]});
            }
        });
    });
}

exports.rawAddStream = function(req, res) {
    //res.setHeader('Access-Control-Allow-Origin','*');
    var streamName = req.body.streamName;
    var stream = {
        name: "FIL stream: " + req.body.streamName,
        rtmp: "rtmp://live.soundcdn.com/live",
        iframe: "<iframe width='652' height='375' style='border:0px' border='0' scrolling='no' src='http://global.soundcdn.com/fil/" + streamName + "' overflow='hidden'></iframe>",
        embed: "<div>COMING SOON</div>",
        streamName: streamName,
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
    //res.setHeader('Access-Control-Allow-Origin','*');
    var id = req.params.id;
    var stream = req.body;

    console.log(JSON.stringify(stream));
    db.collection('streams', function(err, collection) {
        collection.update({_id:new BSON.ObjectID(id)}, stream.stream, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating stream: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                stream.stream._id = id;
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

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var streams = [
    { 
        name: "GKIC Day with Dan",
        rtmp: "rtmp://live.soundcdn.com/live",
        iframe: "<iframe width='652' height='375' style='border:0px' border='0' scrolling='no' src='http://global.soundcdn.com/gkic-day-with-dan' overflow='hidden'></iframe>",
        embed: "<div>COMING SOON</div>",
        streamName: "gkicddlive",
        description: "A day with Dan Kennedy and Friends",
        picture: "default-stream.jpg"
    },
    {
        name: "Sonia Stringer Believe",
        rtmp: "rtmp://live.soundcdn.com/live",
        iframe: "<iframe width='652' height='375' style='border:0px' border='0' scrolling='no' src='http://global.soundcdn.com/sonia-stringer-believe' overflow='hidden'></iframe>",
        embed: "<div>COMING SOON</div>",
        streamName: "sonialive",
        description: "Savy Network Marketing Believe Confrence",
        picture: "default-stream.jpg"
    },
    {
        name: "Boss-A-thon 2",
        rtmp: "rtmp://live.soundcdn.com/live",
        iframe: "<iframe width='652' height='375' style='border:0px' border='0' scrolling='no' src='http://global.soundcdn.com/boss-a-thon-2' overflow='hidden'></iframe>",
        embed: "<div>COMING SOON</div>",
        streamName: "bossathon2live",
        description: "Video Boss 2 Launch",
        picture: "default-stream.jpg"
    },
    {
        name: "Six Minutes to Success",
        rtmp: "rtmp://live.soundcdn.com/live",
        iframe: "<iframe width='652' height='375' style='border:0px' border='0' scrolling='no' src='http://global.soundcdn.com/sixminutestosuccess' overflow='hidden'></iframe>",
        embed: "<div>COMING SOON</div>",
        streamName: "smtslive",
        description: "Bob Proctors Six Minutes to Success",
        picture: "default-stream.jpg"
    }];

    db.collection('streams', function(err, collection) {
        collection.insert(streams, {safe:true}, function(err, result) {});
    });

};