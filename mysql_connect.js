/**
 * New node file
 */
function connect() {
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'education9',
		port: '3306',
		database: 'test'
	});

	connection.connect();

	var sql = 'CREATE TABLE USER(fname varchar(20) NOT NULL,lname varchar(20) NOT NUll,uname varchar(10) NOT NULL UNIQUE,email varchar(20) NOT NULL UNIQUE,pass varchar(10) NOT NULL)';
	connection.query(sql, function(err, res) {
		if(err){
			console.log("ERROR: " + err.message);
		}else{
			console.log("SQL DB CONNECTED AND TABLE CREATED");
		}


	});
}


function insertNewUser(callback,firstName,lastName,userName,emailId,password)
{
	var mysql = require('mysql');
	console.log("Firstname: " + firstName + "LastName: " + lastName + "Password: " + password +  "EmailId: " + emailId +"userName: " + userName);
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'education9',
		port: '3306',
		database: 'test'
	});
	connection.connect();
	var sql = "INSERT INTO USER VALUES('"+firstName+"','"+lastName+"','"+userName+"','"+emailId+"','"+password+"')";
	console.log(sql);
	connection.query(sql, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
		callback(err,results);
	});
}



function validateUser(callback,userName,Password)
{
	var mysql = require('mysql');
	console.log("Password: " + Password +"UserName: " + userName);
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'education9',
		port: '3306',
		database: 'test'
	});
	connection.connect();
	var sql = "SELECT * FROM USER WHERE uname ='"+userName+"' and pass = '"+Password+"'";
	console.log(sql);
	connection.query(sql, function(err, rows) { 
		if (err) {
			console.log("ERROR: " + err.message);
		}
		if(rows.length === 0 || userName === '' || Password ==='')
			{ 
			 err = "Not a valid user";
			}
		callback(err,rows);
			
	});
}

function fetchProducts(callback){
	var mysql      = require('mysql');
	console.log("Inside fetchProducts method");
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'education9',
		port: '3306',
		database: 'test'
	});

	connection.connect();
	var sql = 'SELECT P_Id, P_name FROM Product order by P_Id asc';
	connection.query(sql, function(err, rows, fields){
		if(rows.length!==0){
			console.log("DATA : "+JSON.stringify(rows));
			callback(err, rows);
		}
	});
}


function fetchSpecificProduct(id,callback){
	var mysql      = require('mysql');
	console.log("Inside fetchspecificProduct method");
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'education9',
		port: '3306',
		database: 'test'
	});

	connection.connect();
	var sql = 'SELECT * FROM Product where P_id = ' + id ;
	connection.query(sql, function(err, rows, fields){
		if(rows.length!==0){
			console.log("DATA : "+JSON.stringify(rows));
			callback(err, rows);
		}
	});
}





function insertInCart(P_Id, P_quantity,P_price,P_name, callback){
	var mysql      = require('mysql');
	console.log("Inside addto cart");
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'education9',
		port: '3306',
		database: 'test'
	});

	connection.connect();
	var totalPrice = P_quantity * P_price;
	var sql = "Insert into ShoppingCart (S_quantity,S_price,P_name) values("+P_quantity + ","+ totalPrice + ",'"+ P_name +"' )";
	console.log(sql);
	connection.query(sql,function(err, results){ 
		callback(err, results);	
	});
	connection.end();
	
}


function fetchShoppingCart(callback){
	var mysql      = require('mysql');
	console.log("In fetch shopping cart");
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'education9',
		port: '3306',
		database: 'test'
	});

	connection.connect();
	var sql = 'SELECT P_name, S_quantity, S_price FROM ShoppingCart';
	connection.query(sql, function(err, rows, fields){
		if(rows.length!==0){
			console.log("DATA : "+JSON.stringify(rows));
			callback(err, rows);
		}
	});
}


function getProductNames(callback){
	var mysql      = require('mysql');
	console.log("In product names");
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'education9',
		port: '3306',
		database: 'test'
	});

	connection.connect();
	var sql = 'SELECT P_name FROM Product';
	connection.query(sql, function(err, rows, fields){
		if(rows.length!==0){
			console.log("DATA : "+JSON.stringify(rows));
			callback(err, rows);
		}
	});
}


exports.insertInCart = insertInCart;
exports.fetchSpecificProduct = fetchSpecificProduct;
exports.getProductNames = getProductNames;
exports.connect = connect;
exports.insertNewUser = insertNewUser;
exports.validateUser = validateUser;
exports.fetchProducts = fetchProducts;
exports.fetchShoppingCart = fetchShoppingCart;