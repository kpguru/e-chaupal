News = new Mongo.Collection("news");
Categories = new Mongo.Collection("categories");
NewsFeedUrls = new Mongo.Collection("news_feed_urls");
NewsContents = new Mongo.Collection("news_contents");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);
  Session.setDefault("toi_by_topics", "");

  Router.map(function(){
    this.route('home', {path: '/'});
    this.route('team');
    this.route('newsshow')
    this.route('news')
    this.route('category')
    this.route('feed')
  });

  Template.body.helpers({
    is_admin: function(current_user_name){
      return current_user_name == "admin-echaupal"
    }
  });

  Template.home.helpers({
    is_admin: function(current_user_name){
      return current_user_name == "admin-echaupal"
    },
    
    toi_feeds: function () {
      return NewsFeedUrls.find({}, {sort: {createdAt: -1}});
    }
  });
  
  Template.home.events({    
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
  
  Template.category.events({    
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
  
  Template.category.helpers({
    feed_urls: function(){
      return NewsFeedUrls.find({}, {sort: {createdAt: -1}});
    }
  });
  
  // At the bottom of the client code
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
  
  Meteor.methods({
      getNewsByTopics: function (url) {
        this.unblock();
        return Meteor.http.call("GET", url);
      }
  });
}
