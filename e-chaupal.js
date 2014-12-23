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
    }
  });
  
  Template.newsshow.helpers({
    toi_by_topics: function () {
      return Session.get("toi_by_topics");
    }
  });
  
  //~ Feed block start
  Template.feed.events({    
    'submit form' : function (event) {
      var news_id = event.target.news_id.value;
      var category_id = event.target.category_id.value;
      var feed_url = event.target.feed_url.value;      
      
      NewsFeedUrls.insert({
        news_id: news_id,
        category_id: category_id,
        feed_url: feed_url,
        createdAt: new Date()
      });

      // Clear form
      event.target.news_id.value = "";
      event.target.category_id.value = "";
      event.target.feed_url.value = "";
      
      // Prevent default form submit
      return false;
    },
    
    "click .delete": function () {
      NewsFeedUrls.remove(this._id);
    }
  });
  
  Template.feed.helpers({
    feed_urls: function(){
      return NewsFeedUrls.find({}, {sort: {createdAt: -1}});
    },
    news: function(){
      return News.find({}, {sort: {createdAt: -1}});
    },
    news_categories: function(){
      return Categories.find({}, {sort: {createdAt: -1}});
    },
    
    get_news_name: function(id){
      return News.findOne({_id: id}).name;
    },
    
    get_category_name: function(id){
      return Categories.findOne({_id: id}).name;
    }
  });
  
  //~ Feed block end
  
  //~ Category block start
  Template.category.events({    
    'submit form' : function (event) {
      var news_id = event.target.news_id.value;
      var name = event.target.name.value;
      
      Categories.insert({
        news_id: news_id,
        name: name,
        createdAt: new Date()
      });

      // Clear form
      event.target.news_id.value = "";
      event.target.name.value = "";
      
      // Prevent default form submit
      return false;
    },
    
    "click .delete": function () {
      Categories.remove(this._id);
    }
  });
  
  Template.category.helpers({
    categories: function(){
      return Categories.find({}, {sort: {createdAt: -1}});
    },
    
    news: function(){
      return News.find({}, {sort: {createdAt: -1}});
    },
    
    get_news_name: function(id){
      return News.findOne({_id: id}).name;
    }
  });
  
  //~ Feed block end
    
  //~ News block start
  Template.news.events({    
    'submit form' : function (event) {
      var name = event.target.name.value;
      
      News.insert({
        name: name,
        createdAt: new Date()
      });

      // Clear form
      event.target.name.value = "";
      
      // Prevent default form submit
      return false;
    },
    
    "click .delete": function () {
      News.remove(this._id);
    }
  });
  
  Template.news.helpers({
    news: function(){
      return News.find({}, {sort: {createdAt: -1}});
    }
  });
  
  //~ News block end
  
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
