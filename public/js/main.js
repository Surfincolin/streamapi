var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "streams"	          : "list",
        "streams/page/:page"	: "list",
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
            $("#content").html(new StreamListView({model: streamList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    streamDetails: function (id) {
        var stream = new Stream({_id: id});
        stream.fetch({success: function(){
            $("#content").html(new StreamView({model: stream}).el);
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
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'StreamView', 'StreamListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});