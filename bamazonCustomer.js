// Setting up the dependencies
var mysql = require("mysql");

var inquirer = require("inquirer");

//Including a new package to make a cool looking table
var Table = require("cli-table");

//Adding some colors! (Documentation advises string safe api)
var colors = require('colors/safe');

// Creating the connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",

    password: "password", // Leaving out my actual password for public 
    database: "bamazon_db"

});

var cart = [];

// Connecting to the mysql server + database
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayProducts(function() {
        userChoice();
    });
});

function displayProducts(cb) {
    var table = new Table({
        head: ["Product ID #", "Product", "Department", "Price", "Quantity Available"],
        style: {
            head: ['magenta', 'underline', 'bgWhite', 'bold'], //Makes text pink w/ white background - so cool! :P
            compact: false,
            colAligns: ['center'],
        }
    });

    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity]);
        }

        console.log(table.toString());
        cb();
    });
}

//function to allow user to select from products
function userChoice() {
    var items = [];

    connection.query('SELECT product_name FROM products', function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            items.push(res[i].product_name)
        }

        inquirer.prompt([{
            name: 'choices',
            type: 'checkbox',
            message: 'Please choose the items you would like to purchase.',
            choices: items
        }]).then(function(user) {

            if (user.choices.length === 0) {
                console.log('Oh No! You didn\'t select anything!');

                inquirer.prompt([{
                    name: 'choice',
                    type: 'list',
                    message: 'Your cart is empty. Would you like to keep shopping or leave?',
                    choices: ['Keep Shopping', 'Leave']
                }]).then(function(user) {

                    if (user.choice === 'Keep Shopping') {
                        displayProducts(function() {
                            userChoice();
                        });
                    } else {

                        console.log('Ok! Thanks for checking out Bamazon!');
                        connection.end();
                    }
                });
            } else {
                numberItems(user.choices)
            }
        });
    });
}

//function for how many of each item
function numberItems(itemNames) {

    var item = itemNames.shift();
    var itemStock;

    connection.query('SELECT stock_quantity, price FROM products WHERE ?', {
        product_name: item
    }, function(err, res) {
        if (err) throw err;

        itemStock = res[0].stock_quantity;
        itemCost = res[0].price;
    });

    inquirer.prompt([{
        name: 'amount',
        type: 'text',
        message: 'How many ' + item + ' do you want?',

        validate: function(str) {
            if (parseInt(str) <= itemStock) {
                return true
            } else {

                console.log('\nOh No! We only have ' + itemStock + ' in stock.'); //Alerts in case stock_quantity is not available
                return false;
            }
        }
    }]).then(function(user) {
        var amount = user.amount;

        cart.push({
            item: item,
            amount: amount,
            itemCost: itemCost,
            itemStock: itemStock,
            total: itemCost * amount
        });

        if (itemNames.length != 0) {
            numberItems(itemNames);
        } else {

            checkout();
        }
    });
}


function checkout() {

    if (cart.length != 0) {
        var finalTotal = 0;

        console.log('---------------------------------------------');
        console.log('Here is your cart. Are you ready to checkout?');
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i].item;
            var amount = cart[i].amount;
            var cost = cart[i].itemCost.toFixed(2);
            var total = cart[i].total.toFixed(2);
            var itemCost = cost * amount;
            finalTotal += itemCost;
            console.log(amount + ' ' + item + ' ' + '$' + total);
        }

        console.log('Total: $' + finalTotal.toFixed(2));

        inquirer.prompt([{
            name: 'checkout',
            type: 'list',
            message: 'Ready to checkout?',
            choices: ['Yes', 'No']
        }]).then(function(res) {

            if (res.checkout === 'Yes') {
                updateProducts(finalTotal);

            } else {

                console.log('Ok! Please Come Back Soon!');
                connection.end();
            }
        });

    }
}

//function to update bamazon_db
function updateProducts(finalTotal) {

    var item = cart.shift();
    var itemName = item.item;
    var itemCost = item.itemCost
    var itemPurchase = item.amount;


    connection.query('SELECT stock_quantity from products WHERE ?', {
        product_name: itemName
    }, function(err, res) {
        var currentStock = res[0].stock_quantity;

        //updates the stock_quantity in bamazon_db
        connection.query('UPDATE products SET ? WHERE ?', [{
            stock_quantity: currentStock -= itemPurchase
        }, {
            product_name: itemName
        }], function(err) {
            if (err) throw err;

            if (cart.length != 0) {
                updateProducts(finalTotal);
            } else {

                finalTotal = finalTotal.toFixed(2);
                console.log('Thank you for your purchase!');
                console.log('Your total is $' + finalTotal);
                connection.end();
            }
        });
    });
}
