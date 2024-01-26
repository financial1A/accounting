// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL database connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: '3308',
  user: 'root',
  password: '123456',
  database: 'test',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
  // First query to retrieve all accounts
  connection.query('SELECT * FROM accounts', (err, results) => {
    if (err) {
      console.error('Error querying database: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const accounts = results.map(row => ({
      id: row.id,
      account_name: row.account_name,
      balance: row.balance,
      code: row.code
    }));

    // Second query to retrieve the sum of balances where type is 2
    connection.query('SELECT SUM(balance) as type2Sum FROM accounts WHERE type = "2"', (err, resultsType2) => {
      if (err) {
        console.error('Error querying database: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      const type2Sum = resultsType2[0].type2Sum;

      // Third query to retrieve the sum of balances where type is 1
      connection.query('SELECT SUM(balance) as type1Sum FROM accounts WHERE type = "1"', (err, resultsType1) => {
        if (err) {
          console.error('Error querying database: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        const type1Sum = resultsType1[0].type1Sum;

        // Render the view with the data
        res.render('index', { accounts, type2Sum, type1Sum, req });
      });
    });
  });
});


app.get('/new', (req, res) => {
  connection.query('UPDATE accounts SET balance = 0 WHERE id >= 0', (err, results) => {
    if (err) {
      console.error('Error querying database: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.redirect('/'); // Include 'req' in the render options
  });
});

app.post('/add-transaction', (req, res) => {
  const { debitAccount, creditAccount, amount } = req.body;

  if (!debitAccount || !creditAccount || !amount) {
    res.redirect('/?error=Invalid input');
    return;
  }

  // Begin a MySQL transaction
  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction: ', beginTransactionErr);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Insert the transaction into the database
    const insertTransactionSQL = 'INSERT INTO transactions (debit_account, credit_account, amount) VALUES (?, ?, ?)';
    connection.query(insertTransactionSQL, [debitAccount, creditAccount, amount], (insertErr) => {
      if (insertErr) {
        console.error('Error inserting transaction: ', insertErr);
        // Rollback the transaction in case of an error
        connection.rollback(() => {
          res.status(500).send('Internal Server Error');
        });
        return;
      }

      // Update account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE code IN (?, ?)';
      connection.query(updateAccountsSQL, [amount, debitAccount, creditAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }

        // Commit the transaction if everything is successful
        connection.commit((commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction: ', commitErr);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.redirect('/');
        });
      });
    });
  });
});


app.post('/add-transaction1', (req, res) => {
  const { debitAccount, creditAccount} = req.body;

  if (!debitAccount || !creditAccount) {
    res.redirect('/?error=Invalid input');
    return;
  }

  // Begin a MySQL transaction
  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction: ', beginTransactionErr);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Insert the transaction into the database
    const insertTransactionSQL = 'INSERT INTO credit_purchase (debit_account, credit_account) VALUES (?,?)';
    connection.query(insertTransactionSQL, [debitAccount, creditAccount], (insertErr) => {
      if (insertErr) {
        console.error('Error inserting transaction: ', insertErr);
        // Rollback the transaction in case of an error
        connection.rollback(() => {
          res.status(500).send('Internal Server Error');
        });
        return;
      }

      // Update account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("inventory", "payable")';
      connection.query(updateAccountsSQL, [ debitAccount, creditAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }

        // Commit the transaction if everything is successful
        connection.commit((commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction: ', commitErr);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.redirect('/');
        });
      });
    });
  });
});

app.post('/add-transaction2', (req, res) => {
  const { debitAccount, creditAccount} = req.body;

  if (!debitAccount || !creditAccount) {
    res.redirect('/?error=Invalid input');
    return;
  }

  // Begin a MySQL transaction
  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction: ', beginTransactionErr);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Insert the transaction into the database
    const insertTransactionSQL = 'INSERT INTO credit_sales (debit_account, credit_account) VALUES (?,?)';
    connection.query(insertTransactionSQL, [debitAccount, creditAccount], (insertErr) => {
      if (insertErr) {
        console.error('Error inserting transaction: ', insertErr);
        // Rollback the transaction in case of an error
        connection.rollback(() => {
          res.status(500).send('Internal Server Error');
        });
        return;
      }

      // Update account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("sales", "receivable")';
      connection.query(updateAccountsSQL, [ debitAccount, creditAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }

        // Commit the transaction if everything is successful
        connection.commit((commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction: ', commitErr);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.redirect('/');
        });
      });
    });
  });
});
app.post('/add-transaction3', (req, res) => {
  const { debitAccount, creditAccount} = req.body;

  if (!debitAccount || !creditAccount) {
    res.redirect('/?error=Invalid input');
    return;
  }

  // Begin a MySQL transaction
  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction: ', beginTransactionErr);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Insert the transaction into the database
    const insertTransactionSQL = 'INSERT INTO asset_purchase (debit_account, credit_account) VALUES (?,?)';
    connection.query(insertTransactionSQL, [debitAccount, creditAccount], (insertErr) => {
      if (insertErr) {
        console.error('Error inserting transaction: ', insertErr);
        // Rollback the transaction in case of an error
        connection.rollback(() => {
          res.status(500).send('Internal Server Error');
        });
        return;
      }

      // Update account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("purchase", "assets")';
      connection.query(updateAccountsSQL, [ debitAccount, creditAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }

        // Commit the transaction if everything is successful
        connection.commit((commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction: ', commitErr);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.redirect('/');
        });
      });
    });
  });
});
app.post('/add-transaction4', (req, res) => {
  const { debitAccount, creditAccount} = req.body;

  if (!debitAccount || !creditAccount) {
    res.redirect('/?error=Invalid input');
    return;
  }

  // Begin a MySQL transaction
  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction: ', beginTransactionErr);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Insert the transaction into the database
    const insertTransactionSQL = 'INSERT INTO cash_purchase (debit_account, credit_account) VALUES (?,?)';
    connection.query(insertTransactionSQL, [debitAccount, creditAccount], (insertErr) => {
      if (insertErr) {
        console.error('Error inserting transaction: ', insertErr);
        // Rollback the transaction in case of an error
        connection.rollback(() => {
          res.status(500).send('Internal Server Error');
        });
        return;
      }

      // Update account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("cash", "payable")';
      connection.query(updateAccountsSQL, [ debitAccount, creditAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }

        // Commit the transaction if everything is successful
        connection.commit((commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction: ', commitErr);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.redirect('/');
        });
      });
    });
  });
});
app.post('/add-transaction5', (req, res) => {
    const { debitAccount, creditAccount} = req.body;

    if (!debitAccount || !creditAccount) {
      res.redirect('/?error=Invalid input');
      return;
    }

    // Begin a MySQL transaction
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction: ', beginTransactionErr);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Insert the transaction into the database
      const insertTransactionSQL = 'INSERT INTO cash_receivable (debit_account, credit_account) VALUES (?,?)';
      connection.query(insertTransactionSQL, [debitAccount, creditAccount], (insertErr) => {
        if (insertErr) {
          console.error('Error inserting transaction: ', insertErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }

        // Update cash account balances
        const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("cash")';
        connection.query(updateAccountsSQL, [ debitAccount], (updateErr) => {
          if (updateErr) {
            console.error('Error updating account balances: ', updateErr);
            // Rollback the transaction in case of an error
            connection.rollback(() => {
              res.status(500).send('Internal Server Error');
            });
            return;
          }
          
        // Update receivable account balances
        const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("receivable")';
        connection.query(updateAccountsSQL, [creditAccount], (updateErr) => {
          if (updateErr) {
            console.error('Error updating account balances: ', updateErr);
            // Rollback the transaction in case of an error
            connection.rollback(() => {
              res.status(500).send('Internal Server Error');
            });
            return;
          }

          // Commit the transaction if everything is successful
          connection.commit((commitErr) => {
            if (commitErr) {
              console.error('Error committing transaction: ', commitErr);
              res.status(500).send('Internal Server Error');
              return;
            }

            res.redirect('/');
          });
        });
      });
    });
  });
});
app.post('/add-transaction6', (req, res) => {
    const { debitAccount, creditAccount} = req.body;

    if (!debitAccount || !creditAccount) {
      res.redirect('/?error=Invalid input');
      return;
    }

    // Begin a MySQL transaction
    connection.beginTransaction((beginTransactionErr) => {
      if (beginTransactionErr) {
        console.error('Error beginning transaction: ', beginTransactionErr);
        res.status(500).send('Internal Server Error');
        return;
      }

      // Insert the transaction into the database
      const insertTransactionSQL = 'INSERT INTO cash_equity (debit_account, credit_account) VALUES (?,?)';
      connection.query(insertTransactionSQL, [debitAccount, creditAccount], (insertErr) => {
        if (insertErr) {
          console.error('Error inserting transaction: ', insertErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }

        // Update cash account balances
        const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("cash")';
        connection.query(updateAccountsSQL, [ debitAccount], (updateErr) => {
          if (updateErr) {
            console.error('Error updating account balances: ', updateErr);
            // Rollback the transaction in case of an error
            connection.rollback(() => {
              res.status(500).send('Internal Server Error');
            });
            return;
          }
          
        // Update receivable account balances
        const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("equity")';
        connection.query(updateAccountsSQL, [creditAccount], (updateErr) => {
          if (updateErr) {
            console.error('Error updating account balances: ', updateErr);
            // Rollback the transaction in case of an error
            connection.rollback(() => {
              res.status(500).send('Internal Server Error');
            });
            return;
          }

          // Commit the transaction if everything is successful
          connection.commit((commitErr) => {
            if (commitErr) {
              console.error('Error committing transaction: ', commitErr);
              res.status(500).send('Internal Server Error');
              return;
            }

            res.redirect('/');
          });
        });
      });
    });
  });
});
app.post('/add-transaction7', (req, res) => {
  const { debitAccount, creditAccount} = req.body;

  if (!debitAccount || !creditAccount) {
    res.redirect('/?error=Invalid input');
    return;
  }

  // Begin a MySQL transaction
  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction: ', beginTransactionErr);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Insert the transaction into the database
    const insertTransactionSQL = 'INSERT INTO cash_loan (debit_account, credit_account) VALUES (?,?)';
    connection.query(insertTransactionSQL, [debitAccount, creditAccount], (insertErr) => {
      if (insertErr) {
        console.error('Error inserting transaction: ', insertErr);
        // Rollback the transaction in case of an error
        connection.rollback(() => {
          res.status(500).send('Internal Server Error');
        });
        return;
      }

      // Update cash account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("cash")';
      connection.query(updateAccountsSQL, [ debitAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }
        
      // Update receivable account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("loan_payable")';
      connection.query(updateAccountsSQL, [creditAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }

        // Commit the transaction if everything is successful
        connection.commit((commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction: ', commitErr);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.redirect('/');
        });
      });
    });
  });
});
});
app.post('/add-transaction8', (req, res) => {
  const { debitAccount, creditAccount} = req.body;

  if (!debitAccount || !creditAccount) {
    res.redirect('/?error=Invalid input');
    return;
  }

  // Begin a MySQL transaction
  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction: ', beginTransactionErr);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Insert the transaction into the database
    const insertTransactionSQL = 'INSERT INTO cash_dividends (debit_account, credit_account) VALUES (?,?)';
    connection.query(insertTransactionSQL, [debitAccount, creditAccount], (insertErr) => {
      if (insertErr) {
        console.error('Error inserting transaction: ', insertErr);
        // Rollback the transaction in case of an error
        connection.rollback(() => {
          res.status(500).send('Internal Server Error');
        });
        return;
      }

      // Update cash account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("cash")';
      connection.query(updateAccountsSQL, [ debitAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }
        
      // Update receivable account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("dividends")';
      connection.query(updateAccountsSQL, [creditAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }

        // Commit the transaction if everything is successful
        connection.commit((commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction: ', commitErr);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.redirect('/');
        });
      });
    });
  });
});
});
app.post('/add-transaction9', (req, res) => {
  const { debitAccount, creditAccount} = req.body;

  if (!debitAccount || !creditAccount) {
    res.redirect('/?error=Invalid input');
    return;
  }

  // Begin a MySQL transaction
  connection.beginTransaction((beginTransactionErr) => {
    if (beginTransactionErr) {
      console.error('Error beginning transaction: ', beginTransactionErr);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Insert the transaction into the database
    const insertTransactionSQL = 'INSERT INTO cash_rent (debit_account, credit_account) VALUES (?,?)';
    connection.query(insertTransactionSQL, [debitAccount, creditAccount], (insertErr) => {
      if (insertErr) {
        console.error('Error inserting transaction: ', insertErr);
        // Rollback the transaction in case of an error
        connection.rollback(() => {
          res.status(500).send('Internal Server Error');
        });
        return;
      }

      // Update cash account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("cash")';
      connection.query(updateAccountsSQL, [ debitAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }
        
      // Update receivable account balances
      const updateAccountsSQL = 'UPDATE accounts SET balance = balance + ? WHERE account_name IN ("rent_expense")';
      connection.query(updateAccountsSQL, [creditAccount], (updateErr) => {
        if (updateErr) {
          console.error('Error updating account balances: ', updateErr);
          // Rollback the transaction in case of an error
          connection.rollback(() => {
            res.status(500).send('Internal Server Error');
          });
          return;
        }

        // Commit the transaction if everything is successful
        connection.commit((commitErr) => {
          if (commitErr) {
            console.error('Error committing transaction: ', commitErr);
            res.status(500).send('Internal Server Error');
            return;
          }

          res.redirect('/');
        });
      });
    });
  });
});
});

app.get('/pandl', (req, res) => {
  connection.query('SELECT balance as sales FROM accounts WHERE account_name="sales"', (err, results) => {
    if (err) {
      console.error('Error querying database: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const sales =results[0].sales;

    // Second query to retrieve the sum of balances where type is 2
    connection.query('SELECT SUM(balance) as type2Sum FROM accounts WHERE type = "2"', (err, resultsType2) => {
      if (err) {
        console.error('Error querying database: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      const type2Sum = resultsType2[0].type2Sum;

      // Third query to retrieve the sum of balances where type is 1
      connection.query('SELECT SUM(balance) as type1Sum FROM accounts WHERE type = "1"', (err, resultsType1) => {
        if (err) {
          console.error('Error querying database: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        const type1Sum = resultsType1[0].type1Sum;

        // Render the view with the data
        res.render('pandl', { sales, type2Sum, type1Sum, req });
      });
    });
  });
});

app.get('/balsheet', (req, res) => {
  // First query to retrieve all accounts
  connection.query('SELECT balance as equity FROM accounts WHERE account_name="equity"', (err, results) => {
    if (err) {
      console.error('Error querying database: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const equity =results[0].equity;

    // Second query to retrieve the sum of balances where type is 2
    connection.query('SELECT SUM(balance) as type2Sum FROM accounts WHERE type = "2"', (err, resultsType2) => {
      if (err) {
        console.error('Error querying database: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      const type2Sum = resultsType2[0].type2Sum;

      // Third query to retrieve the sum of balances where type is 1
      connection.query('SELECT SUM(balance) as type1Sum FROM accounts WHERE type = "1"', (err, resultsType1) => {
        if (err) {
          console.error('Error querying database: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        const type1Sum = resultsType1[0].type1Sum;

        // Render the view with the data
        res.render('balsheet', { equity, type2Sum, type1Sum, req });
      });
    });
  });
});

app.get('/cashf', (req, res) => {
  // First query to retrieve all accounts
  connection.query('SELECT balance as equity FROM accounts WHERE account_name="equity"', (err, results) => {
    if (err) {
      console.error('Error querying database: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const equity =results[0].equity;

    // Second query to retrieve the sum of balances where type is 2
    connection.query('SELECT SUM(balance) as type2Sum FROM accounts WHERE type = "2"', (err, resultsType2) => {
      if (err) {
        console.error('Error querying database: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      const type2Sum = resultsType2[0].type2Sum;

      // Third query to retrieve the sum of balances where type is 1
      connection.query('SELECT SUM(balance) as type1Sum FROM accounts WHERE type = "1"', (err, resultsType1) => {
        if (err) {
          console.error('Error querying database: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }

        const type1Sum = resultsType1[0].type1Sum;

        // Render the view with the data
        res.render('cashf', { equity, type2Sum, type1Sum, req });
      });
    });
  });
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
