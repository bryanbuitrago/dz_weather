const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const request = require('request');
const KEY = process.env.WUNDERGROUND_API_KEY;

/* BCrypt stuff here */
const bcrypt = require('bcrypt');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
secret: 'theTruthIsOutThere51',
resave: false,
saveUninitialized: true,
cookie: { secure: false }
}))

var db = pgp('postgres://bryan@localhost:5432/dz_users_db');

app.get("/", function(req, res){
  var logged_in;
  var email;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }

  var data = {
    "logged_in": logged_in,
    "email": email
  }

  res.render('index', data);
});


app.post('/search', function(req, res){
  var data = req.body.zone;

  console.log(data);
  // http://api.wunderground.com/api/ca217a988368c562/conditions/q/PA/East_Stroudsburg.json
  var api = 'http://api.wunderground.com/api/ca217a988368c562/conditions/q/' + data + '.json';
    request(api, function(err, resp, body){
      console.log(body) // Logs JSON object from the external API of the specific states I searched
      body = JSON.parse(body);
      res.send(body) // sends json object back to front end
    });
  });



// app.get('/search/:dropzone', function(req, res){
//   // var state = 'pa';
//   // var city = 'east_stroudsburg';
//   var dropzone = req.params.dropzone
//   console.log(dropzone);
//   // http://api.wunderground.com/api/ca217a988368c562/conditions/q/PA/East_Stroudsburg.json
//   var api = 'http://api.wunderground.com/api/ca217a988368c562/conditions/q/' + dropzone + '.json';
//     request(api, function(err, resp, body){
//       console.log(body) // Logs JSON object from the external API of the specific states I searched
//       body = JSON.parse(body);
//       res.send(body) // sends json object back to front end
//     });
//   });

app.get('/logout', function(req,res){
  req.session.user = null;
  console.log("logging out!");
  res.redirect('/');
});

app.get("/signup", function(req, res){
res.render('signup/index');
});

app.post('/signup', function(req, res){
var data = req.body;

bcrypt.hash(data.password, 10, function(err, hash){
  db.none(
    "INSERT INTO users (email, password_digest) VALUES ($1, $2)",
    [data.email, hash]
  ).then(function(){
    res.send('User created!');
  })
});
})

app.post('/login', function(req, res){
var data = req.body;

db.one(
  "SELECT * FROM users WHERE email = $1",
  [data.email]
).catch(function(){
  res.send('Email/Password not found.');
}).then(function(user){
  bcrypt.compare(data.password, user.password_digest, function(err, cmp){
    if(cmp){
      req.session.user = user;
      res.redirect('/');
    } else {
      res.send('Email/Password not found.')
    }
  });
});
});

app.listen(3000, function () {
console.log('listening on port 3000!');
});



// ================= nick's version ===================
// const express = require('express');
// const app = express();
// const pgp = require('pg-promise')();
// const mustacheExpress = require('mustache-express');
// const bodyParser = require("body-parser");
// const session = require('express-session');

// /* BCrypt stuff here */
// const bcrypt = require('bcrypt');

// app.engine('html', mustacheExpress());
// app.set('view engine', 'html');
// app.set('views', __dirname + '/views');
// app.use("/", express.static(__dirname + '/public'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// app.use(session({
// secret: 'theTruthIsOutThere51',
// resave: false,
// saveUninitialized: true,
// cookie: { secure: false }
// }))

// var db = pgp('postgres://bryan@localhost:5432/users');

// app.get("/", function(req, res){
//   var logged_in;
//   var email;

//   if(req.session.user){
//     logged_in = true;
//     email = req.session.user.email;
//   }

//   var data = {
//     "logged_in": logged_in,
//     "email": email
//   }

//   res.render('index', data);
// });

// app.get('/dropzones')
// //here, display a list of states which you have dropzones for

// app.get('/dropzones/:state')
// //renders the appropriate page for the state they clicked on. That page is where you should list the drop zones
// //You can get the state they clicked by using req.params (don't remember where, console.log req.params to figure it out)
// //In your javascript file, write a listener that applies to each drop zone. The listener should fire an ajax call to your weather app to get the weather
// //Also include a save button for each DZ

// app.post('/save')
// //Save a drop zone to the database
// //Set up a second table for drop zones, with a foreign key that references user id

// app.get('/profile')
// //make a database call using the user's id to find all their saved dropzones
// //pass the saved dropzones forward as an object so mustache can render it

// app.get('/logout', function(req,res){
//   req.session.user = null;
//   console.log("logging out!");
//   res.redirect('/');
// });

// app.get("/signup", function(req, res){
// res.render('signup/index')
// });

// app.post('/signup', function(req, res){
// var data = req.body;

// bcrypt.hash(data.password, 10, function(err, hash){
//   db.none(
//     "INSERT INTO users (email, password_digest) VALUES ($1, $2)",
//     [data.email, hash]
//   ).then(function(){
//     res.send('User created!');
//   })
// });
// })

// app.post('/login', function(req, res){
// var data = req.body;

// db.one(
//   "SELECT * FROM users WHERE email = $1",
//   [data.email]
// ).catch(function(){
//   res.send('Email/Password not found.');
// }).then(function(user){
//   bcrypt.compare(data.password, user.password_digest, function(err, cmp){
//     if(cmp){
//       req.session.user = user;
//       res.redirect('/');
//     } else {
//       res.send('Email/Password not found.')
//     }
//   });
// });
// });

// app.listen(3000, function () {
// console.log('listening on port 3000!');
// });
