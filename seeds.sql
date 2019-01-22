DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
product_id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(50) NOT NULL,
department_name VARCHAR(30) NOT NULL,
price DECIMAL (10,2) NOT NULL,
stock_quantity INT NOT NULL,
primary key (product_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
('`Sony 75 Inch SMART LED  HDTV`', 'Electronics', 2999.99, 9),
('`6X6 Patio Table with 4 matching chairs`', 'Furniture', 1099.00, 5),
('`Dove Soap 16 bar pack`', '`Beauty & Personal Care`', 17.00, 60),
('`Cricut printer`', 'Housewares', 400.95, 7),
('`Nintendo Switch Grey Joycon`', 'Electronics', 299.96, 19),
('`Apple Iphone Xs`', 'Electronics', 999.00, 35),
('`Frigidaire Refrigerator Black`', 'Appliances', 3500.00, 9),
('`Big Agnes 2 person Backpacking Tent`', 'Sports & Outdoors', 499.00, 15),
('`Stiga Regulation Fold up Ping Pong Table`', 'Sports & Outdoors', 299.99, 12),
('`Nutri Bullet Blender`', 'Housewares', 78.00, 10),
('`Neutrogena Oil Free Face Wash`', '`Beauty & Personal Care`', 12.00, 43);

SELECT * FROM products;