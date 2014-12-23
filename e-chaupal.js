NewsFeedUrls = new Mongo.Collection("news_feed_urls");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);
  Session.setDefault("toi_feeds", "");
  Session.setDefault("toi_by_topics", "");

  Router.map(function(){
    this.route('home', {path: '/'});
    this.route('team');
    this.route('newsshow')
  });

  Template.body.helpers({
    counter: function () {
      return Session.get("counter");
    },
    
    is_admin: function(current_user_name){
      return current_user_name == "admin-echaupal"
    }
  });

  Template.body.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
    }
  });
  
  Template.home.helpers({
    toi_feeds: function () {
      return Session.get("toi_feeds");
    },
    
    is_admin: function(current_user_name){
      return current_user_name == "admin-echaupal"
    },
    
    feed_urls: function(){
      return NewsFeedUrls.find({}, {sort: {createdAt: -1}});
    }
  });
  
  Template.home.events({
    'click #toi_news': function () {
      Meteor.call("getTOIFeeds", function(error, results) {
        Session.set("toi_feeds", results.data.Item);
      });
    },
    
    'click .news_blog': function (event,template) {
      var url = event.target.getAttribute("data-url");
      Meteor.call("getNewsByTopics", url, function(error, results) {
        Session.set("toi_by_topics", results.data.NewsItem);
      });
    },
    
    'submit form' : function (event) {
      var news_name = event.target.news_name.value;
      var news_category = event.target.news_category.value;
      var feed_url = event.target.feed_url.value;      
      
      NewsFeedUrls.insert({
        news_name: news_name,
        news_category: news_category,
        feed_url: feed_url,
        createdAt: new Date()
      });

      // Clear form
      event.target.news_name.value = "";
      event.target.news_category.value = "";
      event.target.feed_url.value = "";
      
      // Prevent default form submit
      return false;
    },
    
    "click .delete": function () {
      NewsFeedUrls.remove(this._id);
    }
  });
  
  Template.newsshow.helpers({
    toi_by_topics: function () {
      return Session.get("toi_by_topics");
    }
  });
  
  // At the bottom of the client code
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  
  Meteor.methods({
      getTOIFeeds: function () {
        this.unblock();
        return Meteor.http.call("GET", "https://devru-times-of-india.p.mashape.com/feeds/feedurllist.cms?catagory=city", {headers:{"X-Mashape-Key": "H0Mfd6GJwCmshjmpPgV0VvI4vpMBp1YDD7njsniawxQif3hVOS"}});
      },
      
      getNewsByTopics: function (url) {
        this.unblock();
        return Meteor.http.call("GET", url);
      }
  });
}
