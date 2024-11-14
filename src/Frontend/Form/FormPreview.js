import React from 'react';

const TextInput = ({ label, onLabelChange }) => (
  <div>
    <input type="text" placeholder="Text Input" />
    <div>
      <label>
        Label:
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Enter label"
          style={{ marginTop: '5px', padding: '5px' }}
        />
      </label>
    </div>
  </div>
);

const RadioButtonGroup = ({ label, onLabelChange }) => (
  <div>
    <p>Choose an Option:</p>
    <label>
      <input type="radio" name="radio-group" /> Option 1
    </label>
    <label>
      <input type="radio" name="radio-group" /> Option 2
    </label>
    <label>
      <input type="radio" name="radio-group" /> Option 3
    </label>
    <div>
      <label>
        Label:
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Enter label"
          style={{ marginTop: '5px', padding: '5px' }}
        />
      </label>
    </div>
  </div>
);

const DatePicker = ({ label, onLabelChange }) => (
  <div>
    <input type="date" />
    <div>
      <label>
        Label:
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Enter label"
          style={{ marginTop: '5px', padding: '5px' }}
        />
      </label>
    </div>
  </div>
);

const Checkbox = ({ label, onLabelChange }) => (
  <div>
    <label>
      <input type="checkbox" /> Checkbox Option
    </label>
    <div>
      <label>
        Label:
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Enter label"
          style={{ marginTop: '5px', padding: '5px' }}
        />
      </label>
    </div>
  </div>
);

const TextArea = ({ label, onLabelChange }) => (
  <div>
    <textarea placeholder="Enter text here" rows="4" />
    <div>
      <label>
        Label:
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Enter label"
          style={{ marginTop: '5px', padding: '5px' }}
        />
      </label>
    </div>
  </div>
);

const FileUpload = ({ label, onLabelChange }) => (
  <div className="file-upload">
    <label>
      <input type="file" />
    </label>
    <div>
      <label>
        Label:
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Enter label"
          style={{ marginTop: '5px', padding: '5px' }}
        />
      </label>
    </div>
  </div>
);

const SelectDropdown = ({ label, onLabelChange }) => (
  <div className="select-dropdown">
    <select>
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </select>
    <div>
      <label>
        Label:
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Enter label"
          style={{ marginTop: '5px', padding: '5px' }}
        />
      </label>
    </div>
  </div>
);

const FormPreview = ({ formFields, setFormFields }) => {
  const handleLabelChange = (id, newLabel) => {
    const updatedFields = formFields.map((field) =>
      field.id === id ? { ...field, label: newLabel } : field
    );
    setFormFields(updatedFields);
  };

  return (
    <div>
      {formFields.map((field) => {
        const FieldComponent =
          field.id.split('-')[0] === 'text'
            ? TextInput
            : field.id.split('-')[0] === 'buttons'
            ? RadioButtonGroup
            : field.id.split('-')[0] === 'date'
            ? DatePicker
            : field.id.split('-')[0] === 'checkbox'
            ? Checkbox
            : field.id.split('-')[0] === 'textarea'
            ? TextArea
            : field.id.split('-')[0] === 'fileupload'
            ? FileUpload
            : SelectDropdown;

        return (
          <FieldComponent
            key={field.id}
            label={field.label}
            onLabelChange={(newLabel) => handleLabelChange(field.id, newLabel)}
          />
        );
      })}
    </div>
  );
};

export default FormPreview;
