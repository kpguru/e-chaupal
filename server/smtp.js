Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://your_username:your_password@smtp.sendgrid.net:587';
});
