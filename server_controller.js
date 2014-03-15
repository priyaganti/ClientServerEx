var application_root = __dirname,
express = require("express"),
path = require("path"),
ejs = require("ejs");
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");
var usercache = {};
var cachesize = 100;

var title = 'EJS template with Node.JS';
var data = 'Data from node';

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


//Inside Login page when click SignIn go to Home page, when click sign up take to SignUp form 

app.get('/loginPage', function (req, res) {
	ejs.renderFile('loginPage.ejs',
			{title : title, data : data},
			function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
});


app.post('/validate', function (req, res) {
	console.log('in /Home page after clicking Sign in from login');
	/*if (user in userCache) {
		//check and validate password {'username': 'password'}
		if (pw == userCache[user]) {
			//fetchuser call.
		}
	} */ 
	mysql.validateUser(function(err,results){
		if(err){
			console.log("error wrong password");
			ejs.renderFile('InvalidUser.ejs',
					{title : title, data : data},
					function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
		}
		else{
			//put the user in cache
			//if the cache is already at it's capacity(100), then evict existing users in the cache.
			//eviction policy -- that's what defines your caching algorithm.
			//userCache[user] = pw
			mysql.fetchProducts(function(err,results){
				if(err){
					console.log('No products found');
				}else{
					ejs.renderFile('home.ejs',
							{R: results, P_name : results[0].P_name, P_description : results[0].P_description, P_price : results[0].P_price},
							function(err, result) {
								// render on success
								if (!err) {
									res.end(result);
								}
								// render or error
								else {
									res.end('An error occurred');
									console.log(err);
								}
							});
				}
			});
		}
	},req.param('userName'),req.param('Password'));
	//},req.param('prodName'),req.param('prodDescription'),req.param('prodPrice'));

});


//Display the signup page
app.get('/signUp', function (req, res) {
	ejs.renderFile('signUp.ejs',
			{title : title, data : data},
			function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
});

//Display Home page after signup
app.post('/home', function (req, res) {
	console.log('just Signed up and now Logged in Home page');
	mysql.insertNewUser(function(err,results){
		if(err){
			throw err;
		}else{
			mysql.fetchProducts(function(err,results){
				if(err){
					console.log('No products found');
				}else{

					ejs.renderFile('home.ejs',
							{R: results, P_name : results[0].P_name, P_description : results[0].P_description, P_price : results[0].P_price},
							function(err, result) {
								// render on success
								if (!err) {
									res.end(result);
								}
								// render or error
								else {
									res.end('An error occurred');
									console.log(err);
								}
							});
				}	
			});
		}

	},req.param('firstName'),req.param('lastName'),req.param('userName'),req.param('emailId'),req.param('password'));

});


//SHOPPING CART
app.post('/addToCart', function (req, res) {
	console.log('Clicked on Add to cart going to Shopping Cart');
	mysql.fetchShoppingCart(function(err,results){
		if(err){
			throw err;
		}else{
			ejs.renderFile('displayShoppingCart.ejs',
					{R: results, P_name : results[0].P_name, S_uname : results[0].S_uname, S_quantity : results[0].S_quantity, S_price : results[0].S_price},
					function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
		}
	});

});

app.listen(4242);





