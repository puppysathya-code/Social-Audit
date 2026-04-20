import React from 'react';

const SatisfactionTable = ({ items, formData, onChange }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="sat-table">
        <thead>
          <tr>
            <th>மதிப்பீட்டு அளவுகோல் / Criterion</th>
            <th>மிகவும் திருப்தி ★★★★</th>
            <th>திருப்தி ★★★</th>
            <th>சுமார் ★★</th>
            <th>திருப்தியில்லை ★</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>
                <div className="item-text">
                  {item.ta}
                  <span className="en">{item.en}</span>
                </div>
              </td>
              {[4, 3, 2, 1].map((v) => (
                <td key={v} style={{ textAlign: 'center' }}>
                  <div className="radio-group" style={{ justifyContent: 'center' }}>
                    <input 
                      type="radio" 
                      name={`sat_${i}`} 
                      id={`sat_${i}_${v}`} 
                      value={v}
                      checked={formData[`sat_${i}`] === String(v)}
                      onChange={onChange}
                    />
                    <label 
                      htmlFor={`sat_${i}_${v}`} 
                      style={{ 
                        fontSize: '1.5rem', 
                        border: 'none', 
                        background: 'none', 
                        padding: '2px', 
                        color: formData[`sat_${i}`] >= v ? 'var(--gold)' : 'var(--gray-200)', 
                        letterSpacing: 0, 
                        textTransform: 'none', 
                        fontWeight: 400 
                      }}
                    >
                      ★
                    </label>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SatisfactionTable;
