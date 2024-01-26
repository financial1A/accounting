CREATE DATABASE your_mysql_database;
USE your_mysql_database;

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_name VARCHAR(255) NOT NULL UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0.00
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  debit_account VARCHAR(255) NOT NULL,
  credit_account VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE credit_purchase (
	id INT PRIMARY KEY AUTO_INCREMENT ,
	credit_account VARCHAR(255),
	debit_account VARCHAR(255)
	);

  CREATE TABLE credit_sales (
	id INT PRIMARY KEY AUTO_INCREMENT ,
	credit_account VARCHAR(255),
	debit_account VARCHAR(255)
	);

  CREATE TABLE asset_purchase (
	id INT PRIMARY KEY AUTO_INCREMENT ,
	credit_account VARCHAR(255),
	debit_account VARCHAR(255)
	);

	CREATE TABLE cash_purchase (
	id INT PRIMARY KEY AUTO_INCREMENT ,
	credit_account VARCHAR(255),
	debit_account VARCHAR(255)
	);

	CREATE TABLE cash_receivable (
	id INT PRIMARY KEY AUTO_INCREMENT ,
	credit_account VARCHAR(255),
	debit_account VARCHAR(255)
	);

	CREATE TABLE cash_equity (
	id INT PRIMARY KEY AUTO_INCREMENT ,
	credit_account VARCHAR(255),
	debit_account VARCHAR(255)
	);


	CREATE TABLE cash_loan (
	id INT PRIMARY KEY AUTO_INCREMENT ,
	credit_account VARCHAR(255),
	debit_account VARCHAR(255)
	);

	CREATE TABLE cash_dividends (
	id INT PRIMARY KEY AUTO_INCREMENT ,
	credit_account VARCHAR(255),
	debit_account VARCHAR(255)
	);

	CREATE TABLE cash_rent (
	id INT PRIMARY KEY AUTO_INCREMENT ,
	credit_account VARCHAR(255),
	debit_account VARCHAR(255)
	);
