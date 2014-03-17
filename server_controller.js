var application_root = __dirname,
express = require("express"),
path = require("path"),
ejs = require("ejs"),
async = require("async");
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");
var usercache = {};
var cachesize = 100;

var title = 'EJS template with Node.JS';
var data = 'Data from node';


app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

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

app.get('/showProduct/:id', function (req, res) {
	mysql.fetchSpecificProduct(req.param('id'), function(err, results){

		ejs.renderFile('productDetailsPage.ejs',
				{R : results},
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
});



app.post('/validate', function (req, res) {
	console.log('in /Home page after clicking Sign in from login');
	/*if (user in userCache) {
		//check and validate password {'username': 'password'}
		if (pw == userCache[user]) {
			//fetchuser call.
		}
	} */ 

	mysql.validateUser(function(err,userResults){
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
			console.log(userResults[0].timeStamp);
			req.session.userName = userResults[0].uname;
			//put the user in cache
			//if the cache is already at it's capacity(100), then evict existing users in the cache.
			//eviction policy -- that's what defines your caching algorithm.
			//userCache[user] = pw
			res.redirect('/home');
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
app.post('/createUser', function (req, res) {

	console.log('just Signed up and now Logged in Home page');
	mysql.insertNewUser(function(err,results){
		if(err){
			throw err;
		}else{
			mysql.validateUser(function(err,userResults){
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
				}else{
					console.log(userResults[0].timeStamp);
					req.session.userName = userResults[0].uname;
					//put the user in cache
					//if the cache is already at it's capacity(100), then evict existing users in the cache.
					//eviction policy -- that's what defines your caching algorithm.
					//userCache[user] = pw
					res.redirect('/home');
				}

			},req.param('userName'),req.param('password'));
		}

	},req.param('firstName'),req.param('lastName'),req.param('userName'),req.param('emailId'),req.param('password'));

});

app.get('/home', function(req,res){

	mysql.fetchProducts(function(err,results){
		if(err){
			console.log('No products found');
		}else{
			ejs.renderFile('home.ejs',
					{R: results, P_Id : results[0].P_Id, P_name : results[0].P_name, userName: req.session.userName},
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


//Sujeet's help code SHOPPING CART
app.post('/addToCart', function (req, res) {
	console.log('in addToCart');
	console.log(req.param('P_quantity'));
	mysql.insertInCart(req.param('P_Id'),req.param('P_quantity'),req.param('P_price'),req.param('P_name'),function(err,results){
		if(err){
			console.log(err);
			res.end(results);
		}else{
			res.redirect('/showShoppingCart');
		}
	});
});


//from shoppingcart page checkout button to payment options page
app.post('/checkout', function (req, res) {
	console.log('in checkout post method');
	ejs.renderFile('paymentOption.ejs',
			{title:title, data:data},
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

app.post('/payment', function (req, res) {
	console.log('in payment post method');
	ejs.renderFile('shoppinSucessful.ejs',
			{title:title, data:data},
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

app.post('/removeProduct/:P_name', function (req, res) {
	
	mysql.removeFromCart(req.param('P_name'), function(err, results){
		
		res.redirect('/showShoppingCart')
	});
});

app.get('/showShoppingCart', function(req,res){
	
mysql.fetchShoppingCart(function(err,results){
	ejs.renderFile('displayShoppingCart.ejs',
			{R: results},
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
});


app.listen(4242);





