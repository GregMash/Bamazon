const mysql = require('mysql');
const dotenv = require('dotenv').config();
const keys = require('./keys');




const connection = mysql.createConnection({
    host: keys.mysql.host,
    port: keys.mysql.port,
    user: keys.mysql.user,
    password: keys.mysql.password,
    database: keys.mysql.database
});

connection.connect(function (err) {
    if(err) throw err;
    console.log('Connected as ID' + connection.threadId);
    displayItems();
    endConnection();
});


function displayItems() {
    const query = 'SELECT product_id, product_name, department_name, price FROM products WHERE ?';
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res);
        endConnection();
    })
};

function endConnection() {
    connection.end(function(err) {
        if (err) throw err;
    })
};