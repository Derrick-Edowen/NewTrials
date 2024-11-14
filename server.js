const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const path = require('path');

const PORT = 3002;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'derrick123',
  database: 'newtrials'
});

app.use(bodyParser.json());

const validFieldTypes = ['text', 'email', 'textarea', 'radio', 'checkbox', 'date', 'file'];

function validateFormFields(fields) {
  for (let field of fields) {
    if (!field.id || !field.label || !field.type) {
      return { isValid: false, message: 'Each field must have an id, label, and type.' };
    }

    if (!validFieldTypes.includes(field.type)) {
      return { isValid: false, message: `Field type "${field.type}" is invalid.` };
    }

    if (field.required !== undefined && typeof field.required !== 'boolean') {
      return { isValid: false, message: 'The "required" property must be a boolean.' };
    }
  }

  // Check for unique field IDs
  const ids = fields.map(field => field.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    return { isValid: false, message: 'Field IDs must be unique.' };
  }

  return { isValid: true };
}

app.get('/api/forms', (req, res) => {
  const query = 'SELECT * FROM forms';
  connection.execute(query, (err, results) => {  // Use connection.execute instead of db.execute
    if (err) {
      return res.status(500).json({ message: 'Error retrieving forms from the database.' });
    }
    res.json(results);
  });
});

app.get('/api/forms/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM forms WHERE id = ?';

  connection.execute(query, [id], (err, formResults) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving form from the database.' });
    }

    if (formResults.length === 0) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const form = formResults[0];

    const fieldQuery = 'SELECT * FROM fields WHERE form_id = ?';
    connection.execute(fieldQuery, [id], (fieldErr, fieldResults) => {
      if (fieldErr) {
        return res.status(500).json({ message: 'Error retrieving fields for form.' });
      }

      form.fields = fieldResults;  
      res.json(form);  
    });
  });
});

app.post('/api/forms/save', (req, res) => {
  const { name, formFields } = req.body;

  if (!name || !Array.isArray(formFields) || formFields.length === 0) {
    return res.status(400).json({ message: 'Form name and form fields are required' });
  }

  const formQuery = 'INSERT INTO forms (name) VALUES (?)';
  
  // Step 1: Insert form name into the forms table
  connection.execute(formQuery, [name], (err, formResults) => {  // Use connection.execute
    if (err) {
      return res.status(500).json({ message: 'Error saving form to the database.' });
    }

    const formId = formResults.insertId;  // Get the generated form ID

    // Step 2: Prepare field data for insertion
    const fieldInserts = formFields.map((field, index) => [
      formId, 
      field.label || null, 
      field.type || null, 
      JSON.stringify(field.options || null), 
      index,  // Position in the form
      field.required || false
    ]);

    const fieldQuery = `
      INSERT INTO fields (form_id, label, type, options, position, required) 
      VALUES ?
    `;

    // Step 3: Insert each field individually or in bulk (as preferred)
    connection.query(fieldQuery, [fieldInserts], (fieldErr) => {  // Use connection.query instead of db.batch
      if (fieldErr) {
        return res.status(500).json({ message: 'Error saving fields to the database.' });
      }

      res.status(201).json({ id: formId, name, formFields });
    });
  });
});


app.use(express.static(path.join(__dirname, 'build')));

// Catch-all handler for any request that doesn't match any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
  
  app.listen(3002, () => {
    console.log('Server is running on port 3002');
  });
