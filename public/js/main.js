Backbone.View.prototype.close = function () {
    if (this.beforeClose) {
        this.beforeClose();
    }
    console.log("Get OUT");
    //this.remove();
    //this.unbind();
};

var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "streams"             : "list",
        "streams/page/:page"    : "list",
        "streams/add"         : "addStream",
        "streams/:id"         : "streamDetails",
        "about"             : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

    list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var streamList = new StreamCollection();
        streamList.fetch({success: function(){
            //$("#content").html(new StreamListView({model: streamList, page: p}).el);
            app.showView('#content', new StreamListView({model: streamList, page: p}));
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    streamDetails: function (id) {
        var stream = new Stream({_id: id});
        stream.fetch({success: function(){
            //$("#content").html(new StreamView({model: stream}).el);
            app.showView('#content', new StreamView({model: stream}));
/*function videoFun() {
    $(document).ready(function () {

        //First clear any players listed because if the ID didn't change it won't re-initialize the video element on callback
        vjs.players = {};
        //Then find the video element and determine if it can play MP4
        var v = $('#video-player');
        if (!(v && v.canPlayType && v.canPlayType('video/mp4').replace(/no/, ''))) {
            //If no mp4 support switch to flash
            vjs.options.techOrder = ['flash', 'html5'];
        }

        // Once the video is ready
        var test = videojs('video-player');

        test.ready(function () {
            console.log(stream.attributes.playlist);
            var url = stream.attributes.playlist;
            var myPlayer = this; // Store the video object
            myPlayer.src({
                type: "video/mp4",
                src: url
            });


            //myPlayer.on("pause", function () {
            //  myPlayer.load();
            //});

        });
    });
};
$('#vidScript').append(videoFun());*/

        }});
        this.headerView.selectMenuItem();
        
    },

    addStream: function() {
        var stream = new Stream();
        $('#content').html(new StreamView({model: stream}).el);
        this.headerView.selectMenuItem('add-menu');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    },

    showView: function(selector, view) {
        if (this.currentView)
            this.currentView.close();
        $(selector).html(view.render().el);
        this.currentView = view;
        return view;
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'StreamView', 'StreamListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});