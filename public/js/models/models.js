window.Stream = Backbone.Model.extend({

    urlRoot: "/streams",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.rtmp = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a rtmp location"};
        };

        this.validators.iframe = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter an iFrame"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: "",
        rtmp: "",
        playlist: "http://fil-asset-cdn.s3.amazonaws.com/fil-player/sample2.mp4",
        iframe: "<iframe></iframe>",
        embed: "<div>COMING SOON</div>",
        streamName: "",
        description: "",
        picture: "default-stream.jpg"
    }
});

window.StreamCollection = Backbone.Collection.extend({

    model: Stream,

    url: "/streams"

});