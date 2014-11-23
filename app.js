
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
	res.redirect('login');
});

app.get('/pay_bills', function(req, res) {
	res.render('pay_bills', {
		user: currentUser
	});
});

app.get('/unpaid_bills', function(req, res) {
	var query = 'SELECT billArchive.billID, ' +
		               'billArchive.status, ' +
		               'DATE_FORMAT(billArchive.startPeriod, "%W, %e %M %Y") AS startPeriod, ' +
		               'DATE_FORMAT(billArchive.endPeriod, "%W, %e %M %Y") AS endPeriod, ' +
		               'billArchive.amountDue, ' + 
		               'DATE_FORMAT(billArchive.dueDate, "%W, %e %M %Y") AS dueDate ' +
				'FROM billArchive INNER JOIN accounts ON billArchive.accountID = accounts.accountID ' +
				'WHERE accounts.accountID = ' + currentUser.accountID + ' AND billArchive.status = "Unpaid" ' +
				'ORDER BY billArchive.dueDate';
	
	connection.query(query, function(err, rows) {
		if (err) throw err;
		
		res.json(rows);
	});
});

app.post('/pay_bills', function(req, res) {
	console.log(req.body.row);
	var query = 'UPDATE billArchive SET status="Paid" ' +
				'WHERE billID = ' + req.body.row.billID;
	
	connection.query(query, function(err, rows) {
		if (err) throw err;
		
		res.send({ redirect: '/pay_bills' });
	});
});

app.get('/view_data', function(req, res) {
	res.render('view_data', {
		user: currentUser
	});
});

app.post('/get_readings', function(req, res) {
	var query;
	
	if (req.body.monthly == 'false') {
		query = "SELECT DATE_FORMAT(meterReadings.startPeriod, '%W, %e %M %Y') AS 'day', " + 
		               "meterReadings.meterReading AS 'reading' " +
		        "FROM (meterReadings INNER JOIN meters ON meterReadings.meterID = meters.meterID) " +
		                            "INNER JOIN accounts ON meters.meterID = accounts.meterID " +
		        "WHERE accounts.accountID = " + currentUser.accountID + " " +
		        "ORDER BY meterReadings.startPeriod";
	} else {
		query = "SELECT MONTHNAME(meterReadings.startPeriod) AS 'month', " + 
        			   "YEAR(meterReadings.startPeriod) AS 'year', " + 
    			       "AVG(meterReadings.meterReading) AS 'reading'" +
    			"FROM (meterReadings INNER JOIN meters ON meterReadings.meterID = meters.meterID) " +
                                    "INNER JOIN accounts ON meters.meterID = accounts.meterID " +
                "WHERE accounts.accountID = " + currentUser.accountID + " " +
    			"GROUP BY MONTHNAME(meterReadings.startPeriod), YEAR(meterReadings.startPeriod) " +
    			"ORDER BY MONTHNAME(startPeriod), YEAR(meterReadings.startPeriod)";
	}
	
	connection.query(query, function(err, rows) {
		if (err) throw err;
		
		res.send(rows);
	});
});

app.get('/info', function(req, res) {
	res.render('info', {
		user: currentUser
	});
});

app.post('/info', function(req, res) {
	var selectQuery = "SELECT * " +
	                  "FROM accounts " +
	                  "WHERE name=" + connection.escape(req.body.email);
	
	console.log(selectQuery);
	
	connection.query(selectQuery, function(err, rows) {
		if (req.body.email != currentUser.email || rows.length == 0) {
			var updateQuery = "UPDATE accounts SET " +
			                  	  "name=" + connection.escape(req.body.name) + ", " +
			                  	  "phone=" + req.body.phone + ", " +
			                  	  "email=" + connection.escape(req.body.email) + ", " +
			                  	  "password=" + connection.escape(req.body.password) + " " +
			                  "WHERE accountID=" + currentUser.accountID;
			
			connection.query(updateQuery, function(err, rows) {
				if (err) throw err;
				
				var getUpdatedUser = "SELECT * FROM accounts WHERE accountID=" + currentUser.accountID;
				
				connection.query(getUpdatedUser, function(err, rows) {
					if (err) throw err;
					
					console.log(rows[0]);
					
					currentUser = rows[0];
					
					res.render('dashboard', {
						user: currentUser
					});
				});
			});
		} else {
			res.render('info', {
				user: currentUser
			});
		}
	});
});


app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
