const express = require('express');
const app = express();
const cors = require('cors');
const port = 7000;
const mysql = require('mysql2');

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());
// Sample API endpoint for Wear OS and web app
app.get('/', (req, res) => {
  res.send('Welcome to the API for Web and Wear OS apps!');
});

// Function to create a MySQL connection
function createConnection() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'hospital_server'
  });
}

app.post('/alarm', (req, res) => {
  
  res.status(200).send("hi");
});

// API endpoint to handle actions from the app
app.post('/alarm', (req, res) => {
  console.log("alarm gettted")
  const details = req.body;
  const actionType = details.actionType;

  // Create a new connection for each request
  const connection = createConnection();

  if (actionType === 'start_alarm') {
    const { alarm_time, message, frequency, category, alarm_id, image_url, patid } = details;

    // Insert alarm record into MySQL
    const query = `INSERT INTO alarms (alarm_time, message, frequency, category, alarm_id, image_url, patientid) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [alarm_time, message, frequency, category, alarm_id, image_url, patid];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error starting the alarm.');
      } else {
        res.send('Alarm started and data stored in MySQL!');
      }
      connection.end();  // Close the connection after query execution
    });
    
  } else if (actionType === 'stop_alarm') {
    const alarm_id = details.alarm_id; // Ensure you get alarm_id from the request
    const query = `DELETE FROM alarms WHERE alarm_id = ?`;

    connection.query(query, [alarm_id], (err, result) => {
      if (err) {
        console.error('Error deleting alarm:', err);
        res.status(500).send('Error deleting the alarm.');
      } else {
        res.send('Alarm deleted successfully!');
      }
      connection.end();  // Close the connection after query execution
    });

  } else if (actionType === 'get_alarm') {
    console.log("getting alarm");
    const patient_id = details.patient_id; // Ensure you get patient_id from the request
    const selectQuery = `SELECT * FROM alarms WHERE patientid = ? ORDER BY created_at DESC;`;

    connection.query(selectQuery, [patient_id], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send the results as JSON
      res.json(results);
      connection.end();  // Close the connection after query execution
    });

  } else {
    res.status(400).send('Sorry, an error occurred');
    connection.end();  // Ensure the connection is closed in case of error
  }
});
// hearate input

app.post('/heart-rate', (req, res) => {
console.log("HearCard");
const details = req.body;

  // Create a new connection for each request
const connection = createConnection();
const { heart_rate, patient_id, health_condition } = details;

// Insert heart rate record into MySQL
const query = `INSERT INTO heart_rate (heart_rate, patient_id, recorded_at, health_condition) VALUES (?, ?, NOW(), ?)`; 
// Using NOW() for the current timestamp for 'recorded_at'
const values = [heart_rate, patient_id, health_condition];

connection.query(query, values, (err, result) => {
  if (err) {
    console.error('Error inserting data:', err);
    res.status(500).send('Error storing heart rate data.');
  } else {
    res.send('Heart rate data stored in MySQL!');
  }
  connection.end();  // Close the connection after query execution
});


});

//code to get alerts for the patients
app.post('/alerts', (req, res) => {
  console.log("alerts bisited");
  const details = req.body;
  const actionType = details.actionType;

  // Create a new connection for each request
  const connection = createConnection();

  if (actionType === 'start_alert') {
    const { alert_date, alert_time, alert_message, alert_type, patient_id } = details;

    // Insert alert record into MySQL
    const query = `INSERT INTO alerts (alert_date, alert_time, alert_message, alert_type, patient_id) VALUES (?, ?, ?, ?, ?)`;
    const values = [alert_date, alert_time, alert_message, alert_type, patient_id];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error starting the alert.');
      } else {
        res.send('Alert started and data stored in MySQL!');
      }
      connection.end();  // Close the connection after query execution
    });
  } else if (actionType === 'get_alerts') {
    console.log("getting alert");
    const patient_id = details.patient_id; // Ensure you get patient_id from the request
    const selectQuery = `SELECT * FROM alerts WHERE patient_id = ? ORDER BY created_at DESC;`;

    connection.query(selectQuery, [patient_id], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send the results as JSON
      res.json(results);
      connection.end();  // Close the connection after query execution
    });

  } else {
    res.status(400).send('Sorry, an error occurred');
    connection.end();  // Ensure the connection is closed in case of error
  }
});





app.post('/event', (req, res) => {
  const details = req.body;
  const actionType = details.actionType;

  // Create a new connection for each request
  const connection = createConnection();

  if (actionType === 'start_event') {
    console.log("eventcalled");
    const { eventname, timefrom, timeto, patientid } = details; // Updated to match new table structure
  
    // Insert event record into MySQL
    const query = `INSERT INTO event (eventname, timefrom, timeto, patientid) VALUES (?, ?, ?, ?)`;
    const values = [eventname, timefrom, timeto, patientid]; // Updated values array
  
    connection.query(query, values, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).send('Error starting the event.'); // Updated error message
      } else {
        res.send('Event started and data stored in MySQL!'); // Updated success message
      }
      connection.end();  // Close the connection after query execution
    });
  }
  else if (actionType === 'get_event') {
    console.log("getting event");
    const patient_id = details.patient_id; // Ensure you get patient_id from the request
    const selectQuery = `SELECT * FROM event WHERE patientid = ?;`;

    connection.query(selectQuery, [patient_id], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Database query error' });
      }

      // Send the results as JSON
      res.json(results);
      connection.end();  // Close the connection after query execution
    });

  }
});

// Endpoint to handle heart rate data
app.post('/heartrate', (req, res) => {
  const details = req.body;
  const connection = createConnection();

  const { heart_rate, patient_id, recorded_at, health_condition } = details;
  const query = `INSERT INTO heart_rate (heart_rate, patient_id, recorded_at, health_condition) VALUES (?, ?, ?, ?)`;
  const values = [heart_rate, patient_id, recorded_at, health_condition];

  connection.query(query, values, (err, result) => {
    if (err) {
      res.status(400).send("Some error: " + err);
    } else {
      res.send("Heart rate stored");
    }
    connection.end();  // Close the connection after query execution
  });
});

// Fetch heart rate data
app.get('/hearrate', (req, res) => {
  const patient_id = req.query.patient_id; // Assuming you pass patient_id as a query parameter
  const connection = createConnection();
  const query = `SELECT * FROM heart_rate WHERE patient_id = ?`;

  connection.query(query, [patient_id], (err, result) => {
    if (err) {
      res.status(400).send("Some error: " + err);
    } else {
      res.json(result);  // Send fetched heart rate data
    }
    connection.end();  // Close the connection after query execution
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
