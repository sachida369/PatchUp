require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

app.post('/create-card', async (req, res) => {
  const { sender, recipient, message } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO cards(sender, recipient, message, status) VALUES($1, $2, $3, 'pending') RETURNING id",
      [sender, recipient, message]
    );
    res.json({ success: true, cardId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating card');
  }
});

app.post('/missed-call', async (req, res) => {
  const caller = req.body.From;
  try {
    const result = await pool.query(
      "SELECT * FROM cards WHERE recipient=$1 AND status='pending'",
      [caller]
    );
    if (result.rows.length > 0) {
      const card = result.rows[0];
      await pool.query("UPDATE cards SET status='unlocked' WHERE id=$1", [card.id]);

      res.send('Card unlocked');
    } else {
      res.send('No pending card for this number');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing missed call');
  }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
