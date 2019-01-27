# Bamazon

Bamazon is a command line application that will allow you to shop for items within a mysql database. It will give the user the price of all of the items they select and subtract what they purchase from the physical inventory of the database.

In order to use this application, clone the program and populate your own .env file with passwords to your mySql database. Then install and require mySql, dotenv, and inquirer. Then you are ready to use the program!

Open the application in your bash/terminal
You must type node bamazonCustomer.js
From here, the program will walk you through its inventory and question you on what you would like to purchase. If you select an item quantity that the store does not have, it will let you know the item is not in stock.