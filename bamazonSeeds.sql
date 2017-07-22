DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  id INT(11) NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10, 2) NULL,
  stock_quantity INT(11) NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Leather Wallet", "Clothing & Accessories", 10.00, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Men's polo golf shirt", "Clothing & Accessories", 15.00, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Legend of Zelda", "Video Games & Entertainment", 65.00, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Juicy Fruit Strawberry Gum", "Food", 2.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blue Flip Flops", "Shoes", 10.95, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Purina Puppy Chow", "Pets", 8.99, 32);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Coffee Pot", "Household Goods", 89.99, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wireless Headphones", "Electronics", 49.99, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Almond Joy", "Food", 1.50, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bronze Owl Statue", "Household Goods", 500.00, 1);

select * from products;