if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Router.map(function(){
    this.route('hello', {path: '/'});
    this.route('team');
  });

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    },
    
    is_admin: function(current_user_name){
      return current_user_name == "admin-echaupal"
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);
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
}
