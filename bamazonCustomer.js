// Then create a Node application called bamazonCustomer.js. 
// Running this application will first display all of the items available for sale. 
// Include the ids, names, and prices of products for sale.
// The app should then prompt users with two messages.

// Setting up the dependencies
var mysql = require("mysql");

var inquirer = require("inquirer");

// Creating the connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",
// Leaving out my actual password for public 
	password: "password",
	database: "bamazon_db"

});

// Connecting to the mysql server + database
connection.connect(function(err) { 
if(err) throw err;

// Will begin the prompts for the customer
start();
});

function start() {
	inquirer.prompt({
		name: "browseItems"
		type: "rawlist",
		message: "Would you like to see what's for sale?"
		choices: ["Yes", "No"]
	})
	.then(function(answer) { 
		if (answer.browseItems === "Yes") {
			seeList();
		}
		else {
			console.log("Thank you, Come Again!");
		}
	})
}

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.



// Once the customer has placed the order, your application should 
// check if your store has enough of the product to meet the customer's request.



// If not, the app should log a phrase like Insufficient quantity!, 
// and then prevent the order from going through.



// However, if your store does have enough of the product, 
// you should fulfill the customer's order.


// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.