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


connection.connect(() => {
});

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


function displayItems() {
    const query = 'SELECT product_id, product_name, department_name, price FROM products';
    connection.query(query, (err, res) => {
        console.log('The items available for sale are:');
        for (let i = 0; i < res.length; i++) {
            currentSaleItems.push(res[i]);
            prettyLog(res[i]);
        };
        promptUser();
    })
};


function endConnection() {
    connection.end(function (err) {
        if (err) throw err;
    })
};

function prettyLog(data) {
    console.log(`
Product ID#: ${data.product_id}
Product Name: ${data.product_name}
Department Name: ${data.department_name}
Price: $${data.price}
---------------------------------------------------`)
};

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
        }
    }
    )
};

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
            console.log(`${res.quantity} added to cart!`);
            quantityBought.push(res.quantity);
            shopOrPay();
        }
    })
};

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


welcome();