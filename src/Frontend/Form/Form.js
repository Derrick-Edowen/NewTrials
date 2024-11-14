import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormPreview from './FormPreview.js';
import axios from 'axios'; 

const initialFields = [
  { id: 'text', label: 'Text Input', type: 1 },
  { id: 'buttons', label: 'Radio Buttons', type: 2 },
  { id: 'date', label: 'Date Picker', type: 3 },
  { id: 'checkbox', label: 'Checkbox', type:4 },
  { id: 'textarea', label: 'Text Area', type:5 },
  { id: 'fileupload', label: 'File Upload', type:6 },
  { id: 'selectdropdown', label: 'Select Dropdown', type:7 },
];

const DraggableField = ({ field, setFormFields }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field',
    item: field,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '5px 0',
        backgroundColor: '#e0e0e0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      {field.label}
    </div>
  );
};

const DroppableArea = ({ formFields, setFormFields }) => {
  const [, drop] = useDrop(() => ({
    accept: 'field',
    drop: (item) => {
      setFormFields((prev) => [
        ...prev,
        { ...item, id: `${item.id}-${Date.now()}`, label: '' },
      ]);
    },
  }));

  return (
    <div
      ref={drop}
      style={{
        minHeight: '200px',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        border: '2px dashed #ccc',
      }}
    >
      <FormPreview formFields={formFields} setFormFields={setFormFields} />
    </div>
  );
};

const FormBuilder = () => {
  const [formFields, setFormFields] = useState([]); 
  const [formName, setFormName] = useState(''); 
  const [formId, setFormId] = useState('');
  const [allForms, setAllForms] = useState([]); 
  const [pulledForm, setPulledForm] = useState(null); 

  const handleSaveForm = async () => {
    if (!formName) {
      alert('Please enter a form name');
      return;
    }

    const formData = {
      name: formName,
      formFields,
    };

    try {
      const response = await axios.post('/api/forms/save', formData);
      alert('Form saved successfully!');
      console.log('Form saved:', response.data);
    } catch (error) {
      alert('Error saving form');
      console.error('Error:', error);
    }
  };

  const handlePullUpForm = async () => {
    if (!formId) {
      alert('Please enter a form ID');
      return;
    }
  
    try {
      const response = await axios.get(`/api/forms/${formId}`);
      const formData = response.data; // Assuming this contains the form object
      console.log(formData)
      setPulledForm(formData); // Store the full form data, not just the name
      alert('Form pulled successfully!');
    } catch (error) {
      alert('Error pulling form');
      console.error('Error:', error);
    }
  };
  
  
  

  const handlePullAllForms = async () => {
    try {
      const response = await axios.get('/api/forms');
      setAllForms(response.data);
      alert('All forms pulled successfully!');
    } catch (error) {
      alert('Error pulling all forms');
      console.error('Error:', error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="form-builder" style={{ display: 'flex' }}>
        <div
          className="sidebar"
          style={{ width: '200px', padding: '10px', backgroundColor: '#f9f9f9' }}
        >
          <h3>Form Elements</h3>
          {initialFields.map((field) => (
            <DraggableField key={field.id} field={field} setFormFields={setFormFields} />
          ))}
        </div>

        <div className="form-area" style={{ flex: 1, padding: '10px' }}>
          <h3>Form Area</h3>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="formId">Form ID (To Pull Up Forms):</label>
            <input
              type="text"
              id="formId"
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
              placeholder="Enter form ID"
              style={{ width: '100%', padding: '5px', margin: '5px 0' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="formName">Form Name:</label>
            <input
              type="text"
              id="formName"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Enter form name"
              style={{ width: '100%', padding: '5px', margin: '5px 0' }}
            />
          </div>

          <DroppableArea formFields={formFields} setFormFields={setFormFields} />

          <button
            onClick={handleSaveForm}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save Form
          </button>

          <button
            onClick={handlePullUpForm}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: 'Blue',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Pull Up Specific Form
          </button>

          <button
            onClick={handlePullAllForms}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#FFA500',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Pull All Forms
          </button>

          <div>
  <h4>Forms:</h4>
  <ul>
    {allForms.map((form) => (
      <li key={form.id}>{form.name}</li>
    ))}
  </ul>
</div>

{/* Render the pulled specific form */}
{pulledForm && (
  <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
    <h4>Specific Form Pulled:</h4>
    <p><strong>Form ID:</strong> {pulledForm.id}</p>
    <p><strong>Form Name:</strong> {pulledForm.name}</p>
    <p><strong>Form Created on:</strong> {pulledForm.created_at}</p>
    
    <h5>Form Fields:</h5>
    <form>
      {pulledForm.fields && Array.isArray(pulledForm.fields) ? (
        pulledForm.fields.map((field) => (
          <div key={field.id} style={{ marginBottom: '10px' }}>
            <label htmlFor={field.id}>
              <strong>{field.label}</strong>
            </label>
            {field.type === 'text' && (
              <input
                type="text"
                id={field.id}
                name={field.name}
                placeholder={field.placeholder || ''}
                defaultValue={field.value || ''}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
            {field.type === 'number' && (
              <input
                type="number"
                id={field.id}
                name={field.name}
                placeholder={field.placeholder || ''}
                defaultValue={field.value || ''}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
            {field.type === 'checkbox' && (
              <input
                type="checkbox"
                id={field.id}
                name={field.name}
                defaultChecked={field.value || false}
                style={{ marginTop: '5px' }}
              />
            )}
            {/* Add more field types as necessary */}
          </div>
        ))
      ) : (
        <p>No form fields available.</p>
      )}
      {/* You can also add a submit button if needed */}
      <button type="submit" style={{ marginTop: '20px', padding: '10px', background: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer' }}>Submit</button>
    </form>
  </div>
)}




        </div>
      </div>
    </DndProvider>
  );
};

export default FormBuilder;



