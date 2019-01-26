//============================================ GLOBAL VARIABLES ============================================
const mysql = require('mysql');
const dotenv = require('dotenv').config();
const keys = require('./keys');
const inquirer = require('inquirer');
const connection = mysql.createConnection({
    host: keys.mysql.host,
    port: keys.mysql.port,
    user: keys.mysql.user,
    password: keys.mysql.password,
    database: keys.mysql.database
});
let currentSaleItems = [];
let itemsBought = [];
let quantityBought = [];
let priceArray = [];
let productNameArr = [];

//============================================ FUNCTIONS ============================================

// This function welcomes the user and prompts them to shop or leave
function welcome() {
    console.clear();
    console.log(`
Welcome to the Bamazon online shop!`);
    inquirer.prompt({
        message: 'Would you like to shop our available items?',
        name: 'welcome',
        type: 'list',
        choices: ['Yes', 'Maybe Later']
    }).then((res) => {
        if (res.welcome === 'Yes') {
            displayItems();
        } else {
            console.log('Okay, see ya next time!');
            endConnection();
        };
    })
};

// This function displays the products available for sale 
function displayItems() {
    const query = 'SELECT product_id, product_name, department_name, price FROM products';
    connection.query(query, (err, res) => {
        console.log('The items available for sale are:');
        for (let i = 0; i < res.length; i++) {
            currentSaleItems.push(res[i]);
            console.log(`
Product ID#: ${res[i].product_id}
Product Name: ${res[i].product_name}
Department Name: ${res[i].department_name}
Price: $${res[i].price}
---------------------------------------------------`);
        };
        promptUser();
    })
};

// End the connection to the database
function endConnection() {
    connection.end(function (err) {
        if (err) throw err;
    })
};

// This function will prompt the user to pick an item to purchase from the displayed list
function promptUser() {
    inquirer.prompt({
        name: 'buy',
        type: 'input',
        message: 'Please select an item to buy and enter the Product ID'
    }).then((res) => {
        if (isNaN(parseFloat(res.buy))) {
            console.log('Please enter a valid ID# only');
            promptUser();
        } else {
            displayItemPicked(res.buy);
        };
    })
};

// This function displays the information for the item that the user picks to purchase
function displayItemPicked(item) {
    const query = `SELECT product_name, department_name, price FROM products WHERE product_id = ${item}`
    connection.query(query, function (err, res) {
        if (isNaN(parseFloat(item))) {
            console.log('Please enter a valid ID number');
            promptUser();
        } else {
            console.clear();
            console.log(`
You selected Item#: ${item}
${res[0].product_name}
${res[0].department_name}
$${res[0].price}`);
            confirmCart(item);
        };
    })
};

// this will prompt the user to confirm their selection or return to the products display page
function confirmCart(item) {
    inquirer.prompt({
        name: 'confirm',
        type: 'list',
        choices: ['Yes', 'No'],
        message: 'Add this item to your cart?'
    }).then((res) => {
        if (res.confirm == 'Yes') {
            itemsBought.push(item);
            addQuantity();
        } else {
            displayItems();
        };
    })
};

// this function handles the quantity of the item the user wishes to buy, checking the stock level, and updating the inventory level
function addQuantity() {
    inquirer.prompt({
        name: 'quantity',
        type: 'input',
        message: 'Please enter a quantity to add to your cart'
    }).then((res) => {
        if (isNaN(parseFloat(res.quantity))) {
            console.log('Please enter a number only for quantity desired to purchase');
            addQuantity();
        } else {
            for (let i = 0; i < itemsBought.length; i++) {
                const query = `SELECT stock_quantity FROM products WHERE product_ID = ${itemsBought[i]}`
                const updateQuery = `UPDATE products SET stock_quantity = stock_quantity - ${res.quantity} WHERE product_ID = ${itemsBought[i]};`;
                connection.query(query, (err, result) => {
                    let quantity = result[0].stock_quantity;
                    if (quantity - res.quantity >= 0) {
                        console.log(`Items are in stock! ${res.quantity} added to cart!`);
                        quantityBought.push(res.quantity);
                        connection.query(updateQuery, (err, response) => {
                        })
                        shopOrPay();
                    } else {
                        console.log(`Sorry, the store only has ${quantity} left in stock. Please enter a different quantity`);
                        addQuantity();
                    };
                })
            };
        };
    })
};

// This function will prompt about continuing to shop or checkout and add the product they select to their cart
function shopOrPay() {
    inquirer.prompt({
        name: 'confirm',
        type: 'list',
        choices: ['Continue Shopping', 'Checkout'],
        message: 'Would you like to shop more or checkout?'
    }).then((res) => {
        if (res.confirm === 'Continue Shopping') {
            displayItems();
        } else {
            for (let i = 0; i < itemsBought.length; i++) {
                const query = `SELECT price, product_name FROM products where product_ID = ${itemsBought[i]}`;
                connection.query(query, (err, res) => {
                    productNameArr.push(res[0].product_name);
                    priceArray.push(res[0].price);
                    checkout(priceArray, productNameArr);
                })
            };
            endConnection();
        };
    })
};

// This function will calculate the price based on item selected and quantity selected and give the user their total
function checkout(priceArray, productNameArr) {
    let finalPrice = 0;
    console.clear();
    for (let i = 0; i < priceArray.length; i++) {
        let price = priceArray[i] * quantityBought[i];
        console.log(`
${quantityBought[i]} ${productNameArr[i]} * $${priceArray[i]} = $${price}`);
        finalPrice += price;
    };
    console.log(`
    Your total is: $${finalPrice}
    Thanks for shopping at Bamazon!`);
};

//============================================ MAIN PROCESS ============================================
//call the first function
welcome();