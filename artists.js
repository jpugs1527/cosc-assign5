var request = require('request');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');
require('dotenv').config();

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

var args = process.argv.slice(2);
if (args.length == 0) {
  console.log("No artists specified");
  process.exit(1);
} else {
    request('https://www.ranker.com/list/best-rap-songs-2019/ranker-music', function (error, response, html) {
      var $ = cheerio.load(html);
      var results = [];
      var titles = [];
      var artists = [];
      if (!error && response.statusCode == 200) {
        $('a.listItem__title').each(function(i, element) {
          titles.push($(this).text());
        });
        $('span.listItem__properties').each(function(i, element) {
          artists.push($(this).text());
        });

        for (var i = 0; i < args.length; i++) {
          for (var j = 0; j < artists.length; j++) {
            if (artists[j].match(args[i])) {
              results.push(artists[j] + ": " + titles[j]);
            }
          }
        }

        var mailOptions = {
          from: 'jpugs1527@gmail.com',
          to: 'jpugli1@students.towson.edu',
          subject: 'Your artists are: ' + args.toString(),
          text: results.join('\n')
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
  });
}