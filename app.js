
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mysql = require('mysql');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var connection = mysql.createConnection({
	host: '127.0.0.1',
	port: '3306',
	user: 'root',
	password: 'western_u',
	database: 'greenButtonDB',
	debug: false
});

connection.connect();

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var currentUser = null;

app.get('/login', function(req, res) {
	res.render('login');
});

app.post('/login', function(req, res) {
	// hannahtorres0@gmail.com
	// BRTBLFWZEQ
	
	var email = req.body.email;
	var password = req.body.password;
	
	var query = 'SELECT * FROM accounts WHERE email=' + connection.escape(email);
	
	connection.query(query, function(err, rows) {
		if (err) throw err;
		
		if (rows.length > 0) {
			console.log(rows[0]);
			currentUser = rows[0];
			res.redirect('/dashboard');
		} else {
			res.redirect('/login');
		}
	});
});

app.get('/dashboard', function(req, res) {
	res.render('dashboard');
});

app.get('/logout', function(req, res) {
	currentUser = null;
	res.redirect('login')
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
