News = new Mongo.Collection("news");
Categories = new Mongo.Collection("categories");
NewsFeedUrls = new Mongo.Collection("news_feed_urls");
NewsContents = new Mongo.Collection("news_contents");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);
  Session.setDefault("news_id", "");
  Session.setDefault("news_categories", "");
  Session.setDefault("news_image", "");
  Session.setDefault("news_headline", "");
  Session.setDefault("news_dateline", "");
  Session.setDefault("news_story", "");

  Router.map(function(){
    this.route('home', {
      path: '/',
      layoutTemplate: 'user_layout'
    });
        
    this.route('team', {
      layoutTemplate: 'user_layout'
    });
    
    this.route('newsshow', {
      layoutTemplate: 'user_layout'
    });
    
    this.route('newsdetails', {
      layoutTemplate: 'user_layout'
    });
    
    this.route('news', {
      layoutTemplate: 'admin_layout'
    });
    
    this.route('category', {
      layoutTemplate: 'admin_layout'
    });
    
    this.route('feed', {
      layoutTemplate: 'admin_layout'
    });
    
    this.route('contact_us', {
      layoutTemplate: 'user_layout'
    });
  });
  
  Template.contactUs.rendered = function() {
      var mapOptions = {
          center: new google.maps.LatLng(22.691802, 75.862110),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map-canvas"),
          mapOptions);

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(22.691802, 75.862110),
        title:'Grep Ruby Webtech Pvt Ltd, Tower 61, 1st floor, Opp. Mata Gujri Girls College, BRTS Road, Bhanwarkuaa, Indore, Madhya Pradesh 452014, India',
        icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
      marker.setMap(map);  
  }
  
  Template.user_layout.helpers({
    is_admin: function(current_user_name){
      return current_user_name == "admin-echaupal"
    },
    
    feed_urls: function(){
      return NewsFeedUrls.find({}, {sort: {createdAt: -1}});
    },
    
    get_category_name: function(id){
      return Categories.findOne({_id: id}).name;
    }
  });
  
  Template.user_layout.events({    
    'click .news_blog': function (event,template) {
      var id = event.target.getAttribute("data-id");
      Session.set("news_id", id);
    }
  });
  
  Template.admin_layout.helpers({
    is_admin: function(current_user_name){
      return current_user_name == "admin-echaupal"
    },
    
    feed_urls: function(){
      return NewsFeedUrls.find({}, {sort: {createdAt: -1}});
    },
    
    get_category_name: function(id){
      return Categories.findOne({_id: id}).name;
    }
  });
    
  Template.newsshow.helpers({
    get_news_id: function () {
      return Session.get("news_id");
    },
    
    news_records: function (id) {
      var contents = NewsContents.find({news_feed_url_id: id}, {sort: {news_item_id: -1}, limit: 10});
      return contents;
    },
    
    is_admin: function(current_user_name){
      return current_user_name == "admin-echaupal"
    },
    
    feed_urls: function(){
      return NewsFeedUrls.find({}, {sort: {createdAt: -1}});
    },
    
    get_category_name: function(id){
      return Categories.findOne({_id: id}).name;
    },
    
    get_news_display_name: function(id){
      var news_id = Categories.findOne({_id: id}).news_id;
      return News.findOne({_id: news_id}).name;
    },
    
    news_small_description: function(description){
      return description.substring(0,350);
    },
    
    get_news_small_headline: function(headline){
      return headline.substring(0,50);
    }
  });
  
  Template.newsshow.events({    
    'click .continue': function (event) {
      var news_image = event.target.getAttribute("data-image");
      var news_headline = event.target.getAttribute("data-headline");
      var news_dateline = event.target.getAttribute("data-dateline");
      var news_story = event.target.getAttribute("data-story");

      Session.set('news_image', news_image);
      Session.set('news_headline', news_headline);
      Session.set('news_dateline', news_dateline);
      Session.set('news_story', news_story);
    }
  });
  
  Template.newsdetails.helpers({
    get_news_image: function () {
      return Session.get("news_image");
    },
    
    get_news_headline: function () {
      return Session.get("news_headline");
    },
    
    get_news_dateline: function () {
      return Session.get("news_dateline");
    },
    
    get_news_story: function () {
      return Session.get("news_story");
    }
  });
  
  //~ Feed block start
  Template.feed.events({    
    'submit form' : function (event) {
      var category_id = event.target.category_id.value;
      var feed_url = event.target.feed_url.value;      
      
      NewsFeedUrls.insert({
        category_id: category_id,
        feed_url: feed_url,
        createdAt: new Date()
      });

      // Clear form
      event.target.category_id.value = "";
      event.target.feed_url.value = "";
      
      // Prevent default form submit
      return false;
    },
    
    "click .delete": function () {
      NewsFeedUrls.remove(this._id);
    },

     "change select": function(event,template){
        var news_id = event.target.value;
        categories = Categories.find({news_id: news_id});
        console.log(categories);
        Session.set(news_categories, categories);
     }
  });
  
  Template.feed.helpers({
    feed_urls: function(){
      return NewsFeedUrls.find({}, {sort: {createdAt: -1}});
    },
    news: function(){
      return News.find({}, {sort: {createdAt: -1}});
    },
    categories: function(){
      return Categories.find({}, {sort: {createdAt: -1}});
    },
    news_categories: function(){
      return Session.get(news_categories);
    },
    
    get_news_name: function(id){
      return News.findOne({_id: id}).name;
    },
    
    get_category_name: function(id){
      return Categories.findOne({_id: id}).name;
    },
    
    get_news_display_name: function(id){
      var news_id = Categories.findOne({_id: id}).news_id;
      return News.findOne({_id: news_id}).name;
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
  
  var requireLogin = function() {
    if (! Meteor.user()) {
      // If user is not logged in render landingpage
      this.render('home');
    } else {
      //if user is logged in render whatever route was requested
      this.next();
    }
  }
  
  Router.onBeforeAction(requireLogin, {except: ['home', 'team', 'newsshow', 'newsdetails', 'contact_us']});
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var syncronize = function () {
      console.log("Started Cron Job");
      news_feed_urls = NewsFeedUrls.find().fetch();

      for (var i = 0; i < news_feed_urls.length; i++) {
        feed_url = news_feed_urls[i]["feed_url"];
        id = news_feed_urls[i]["_id"];
        console.log("Fetching record for " + news_feed_urls[i]["feed_url"]);
        
        news_contents = Meteor.http.call("GET", feed_url).data.NewsItem;
        
        for (var j = 0; j < news_contents.length; j++) {
          news = NewsContents.findOne({news_item_id: news_contents[j]["NewsItemId"]});
          if(news == undefined){
            console.log("Inserting record in DB for " + news_feed_urls[i]["feed_url"]);
            var image = "";
            if(news_contents[j]["Image"] != undefined){
              image = news_contents[j]["Image"]["Photo"];
            }
            NewsContents.insert({
              news_feed_url_id: id,
              news_item_id: news_contents[j]["NewsItemId"],
              image: image,
              headline: news_contents[j]["HeadLine"],
              dateline: news_contents[j]["DateLine"],
              story: news_contents[j]["Story"],
              createdAt: new Date()
            });
          }
        }
      }
    }

    var cron = new Meteor.Cron( {
      events:{
        "* * * * *"  : syncronize,
      }
    });
  });
  
  Meteor.methods({
      getNewsByTopics: function (url) {
        this.unblock();
        return Meteor.http.call("GET", url);
      }
  });
}
