import React from 'react';

const AuditTable = ({ items, prefix, formData, onChange }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="audit-table">
        <thead>
          <tr>
            <th>#</th>
            <th>விவரம் / Description</th>
            <th>ஆம் Yes</th>
            <th>இல்லை No</th>
            <th>கல் N/A</th>
            <th>குறிப்புகள் Notes</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const n = typeof item.n === 'number' && item.n % 1 !== 0 ? item.n.toFixed(1) : item.n;
            const fieldName = `${prefix}_${i}`;
            const notesName = `${prefix}_${i}_notes`;
            
            return (
              <tr key={i}>
                <td>{n}</td>
                <td>
                  <div className="item-text">
                    {item.ta}
                    <span className="en">{item.en}</span>
                    {item.inputType && (
                      <div className="custom-input-wrap" style={{ marginTop: '8px' }}>
                        <input 
                          type={item.inputType} 
                          name={`${prefix}_${i}_data`}
                          className="custom-data-input"
                          style={{ 
                            padding: '6px 10px', 
                            borderRadius: '4px', 
                            border: '1px solid var(--gray-300)',
                            fontSize: '0.85rem',
                            width: '100%',
                            maxWidth: '200px'
                          }}
                          onChange={onChange}
                          value={formData[`${prefix}_${i}_data`] || ''}
                          placeholder={item.inputType === 'number' ? 'Enter number...' : 'Select date...'}
                        />
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="radio-group">
                    <input 
                      type="radio" 
                      name={fieldName} 
                      id={`${fieldName}_yes`} 
                      value="yes"
                      checked={formData[fieldName] === 'yes'}
                      onChange={onChange}
                    />
                    <label htmlFor={`${fieldName}_yes`}>ஆம்</label>
                  </div>
                </td>
                <td>
                  <div className="radio-group">
                    <input 
                      type="radio" 
                      name={fieldName} 
                      id={`${fieldName}_no`} 
                      value="no"
                      checked={formData[fieldName] === 'no'}
                      onChange={onChange}
                    />
                    <label htmlFor={`${fieldName}_no`}>இல்லை</label>
                  </div>
                </td>
                <td>
                  <div className="radio-group">
                    <input 
                      type="radio" 
                      name={fieldName} 
                      id={`${fieldName}_na`} 
                      value="na"
                      checked={formData[fieldName] === 'na'}
                      onChange={onChange}
                    />
                    <label htmlFor={`${fieldName}_na`}>கல்</label>
                  </div>
                </td>
                <td>
                  <input 
                    type="text" 
                    className="notes-input" 
                    name={notesName} 
                    placeholder="குறிப்பு..."
                    value={formData[notesName] || ''}
                    onChange={onChange}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable;
