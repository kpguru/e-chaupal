if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);
  Session.setDefault("toi_feeds", "");

  Router.map(function(){
    this.route('home', {path: '/'});
    this.route('team');
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
    }
  });
  
  Template.home.events({
    'click #toi_news': function () {
      Meteor.call("getTOIFeeds", function(error, results) {
        console.log(results.data.Item)
        Session.set("toi_feeds", results.data.Item);
      });
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
      }
  });
}
