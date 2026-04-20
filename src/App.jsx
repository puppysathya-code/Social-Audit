import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import SectionCard from './components/SectionCard';
import AuditTable from './components/AuditTable';
import SatisfactionTable from './components/SatisfactionTable';
import InstallPrompt from './components/InstallPrompt';
import { sections, partB, partC, partD, partE, partF, satItems, tnDistricts, districtTaluks } from './constants/auditData';

function App() {
  const [formData, setFormData] = useState({});
  const [availableTaluks, setAvailableTaluks] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentSectionLabel, setCurrentSectionLabel] = useState(sections[0]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sectionRefs = useRef([]);

  // Handle dependent dropdown logic
  useEffect(() => {
    if (formData.district) {
      const taluks = districtTaluks[formData.district] || [];
      setAvailableTaluks(taluks);
    } else {
      setAvailableTaluks([]);
    }
  }, [formData.district]);

  // Add scroll-spy logic
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0% -60% 0%',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = entry.target.getAttribute('data-index');
          setCurrentSectionLabel(sections[index]);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Progress logic
  useEffect(() => {
    const inputs = document.querySelectorAll('input, textarea, select');
    const total = inputs.length || 1;
    
    // Count filled fields from formData
    const filledCount = Object.keys(formData).filter(key => {
      const val = formData[key];
      return val && String(val).trim() !== '';
    }).length;

    const pct = Math.min(100, Math.round((filledCount / (total * 0.8)) * 100));
    setProgress(pct);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // Reset block if district changes
      if (name === 'district') {
        newData.block = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // REPLACE THIS URL with your deployed Google Apps Script URL
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0Q0G0boiiuMZI7ryu5iwFFqYq0tFwsLhdTgzW1O4QOYl21H1oBFtrnnZg_F_WAk2PTQ/exec";

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script requires no-cors for simple POST
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Since we use no-cors, we can't check response.ok, so we assume success if no error is thrown
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (error) {
      console.error('Submission error:', error);
      alert('Error submitting form. Please check your internet connection or script URL.');
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <ProgressBar progress={100} currentSection="படிவம் சமர்ப்பிக்கப்பட்டது ✓" />
        <div className="container">
          <div id="success-msg">
            <div className="check">✅</div>
            <h3>தணிக்கை படிவம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!</h3>
            <p>Audit form submitted successfully.<br />மாண்புமிகு மக்கள் இயக்கம் தங்கள் பங்களிப்பிற்கு நன்றி தெரிவிக்கிறது.</p>
          </div>
        </div>
        <div className="footer">
          <strong>மாண்புமிகு மக்கள் | MAANBUMIGA MAKKAL</strong><br />
          "ஊழல் இல்லா, மக்கள் ஆட்சி – நம் கனவு; சமூக தணிக்கை – நம் கருவி"
        </div>
      </>
    );
  }

  return (
    <div className="App">
      <InstallPrompt />
      <Header />
      <ProgressBar progress={progress} currentSection={currentSectionLabel} />

      <div className="container">
        <form id="audit-form" onSubmit={handleSubmit}>
          
          {/* Section A */}
          <SectionCard 
            badge="பகுதி அ" 
            title="தன்னார்வலர் மற்றும் அலுவலக விவரங்கள்" 
            enTitle="Volunteer & Office Details" 
            delay={0.05}
            id="section-0"
            data-index="0"
            ref={el => sectionRefs.current[0] = el}
          >
            <div className="field-group">
              <div className="field">
                <label><span className="ta">தன்னார்வலர் பெயர்</span>Volunteer Name</label>
                <input type="text" name="vol_name" placeholder="பெயர் உள்ளிடவும்" required onChange={handleChange} value={formData.vol_name || ''} />
              </div>
              <div className="field">
                <label><span className="ta">அடையாள எண்</span>ID Number</label>
                <input type="text" name="vol_id" placeholder="MMK-XXXX" onChange={handleChange} value={formData.vol_id || ''} />
              </div>
            </div>
            <div className="field-group triple">
              <div className="field">
                <label><span className="ta">தணிக்கை நாள்</span>Audit Date</label>
                <input type="date" name="audit_date" required onChange={handleChange} value={formData.audit_date || ''} />
              </div>
              <div className="field">
                <label><span className="ta">நேரம்</span>Time</label>
                <input type="time" name="audit_time" onChange={handleChange} value={formData.audit_time || ''} />
              </div>
              <div className="field">
                <label><span className="ta">மாவட்டம்</span>District</label>
                <select name="district" required onChange={handleChange} value={formData.district || ''}>
                  <option value="">-- தேர்ந்தெடுக்கவும் Choose --</option>
                  {tnDistricts.map(d => (
                    <option key={d.id} value={d.id}>{d.ta} / {d.en}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field-group">
              <div className="field">
                <label><span className="ta">வட்டம் / தாலுக்கா</span>Block / Taluk</label>
                <select 
                  name="block" 
                  required 
                  onChange={handleChange} 
                  value={formData.block || ''}
                  disabled={!formData.district}
                >
                  <option value="">{formData.district ? '-- தேர்ந்தெடுக்கவும் Choose --' : 'முதலில் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்'}</option>
                  {availableTaluks.map((t, idx) => (
                    <option key={idx} value={t.id || t.en}>{t.ta} / {t.en}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label><span className="ta">அலுவலக பெயர்</span>Office Name</label>
                <input type="text" name="office_name" required onChange={handleChange} value={formData.office_name || ''} />
              </div>
            </div>
            <div className="field-group single">
              <div className="field">
                <label><span className="ta">அலுவலக முகவரி</span>Office Address</label>
                <textarea name="office_address" placeholder="முழு முகவரி..." onChange={handleChange} value={formData.office_address || ''}></textarea>
              </div>
            </div>
          </SectionCard>

          {/* Section B */}
          <div ref={el => sectionRefs.current[1] = el} data-index="1">
            <SectionCard badge="பகுதி ஆ" title="அடிப்படை கட்டமைப்பு வசதிகள்" enTitle="Basic Infrastructure Facilities" delay={0.1}>
              <AuditTable items={partB} prefix="b" formData={formData} onChange={handleChange} />
            </SectionCard>
          </div>

          {/* Section C */}
          <div ref={el => sectionRefs.current[2] = el} data-index="2">
            <SectionCard badge="பகுதி இ" title="கட்டாய அறிவிப்பு பலகைகள்" enTitle="Mandatory Notice Boards" delay={0.15}>
              <AuditTable items={partC} prefix="c" formData={formData} onChange={handleChange} />
            </SectionCard>
          </div>

          {/* Section D */}
          <div ref={el => sectionRefs.current[3] = el} data-index="3">
            <SectionCard badge="பகுதி ஈ" title="தொலைபேசி எண்கள் மற்றும் CCTV" enTitle="Phone Numbers & CCTV" delay={0.2}>
              <AuditTable items={partD} prefix="d" formData={formData} onChange={handleChange} />
              <div style={{ padding: '16px 20px', background: 'var(--gray-100)', borderTop: '1px solid var(--gray-200)' }}>
                <div className="field-group">
                  <div className="field">
                    <label><span className="ta">CCTV பதிவு நாட்கள்</span>Recording Retention (Days)</label>
                    <input type="text" name="cctv_retention" placeholder="நாட்கள் / Not Known" onChange={handleChange} value={formData.cctv_retention || ''} />
                  </div>
                  <div className="field">
                    <label><span className="ta">CCTV கேமரா எண்ணிக்கை</span>Total CCTV Count</label>
                    <input type="text" name="cctv_count" placeholder="எண்ணிக்கை" onChange={handleChange} value={formData.cctv_count || ''} />
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Section E */}
          <div ref={el => sectionRefs.current[4] = el} data-index="4">
            <SectionCard badge="பகுதி உ" title="குடிமக்கள் சாசன இணக்கம்" enTitle="Citizen Charter Compliance" delay={0.25}>
              <AuditTable items={partE} prefix="e" formData={formData} onChange={handleChange} />
              <div style={{ padding: '16px 20px', background: 'var(--gray-100)', borderTop: '1px solid var(--gray-200)' }}>
                <div className="field">
                  <label><span className="ta">குடிமக்கள் சாசனம் கடைசியாக புதுப்பிக்கப்பட்ட நாள்</span>Citizen Charter Last Updated Date</label>
                  <input type="date" name="charter_updated" style={{ maxWidth: '240px' }} onChange={handleChange} value={formData.charter_updated || ''} />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Section F */}
          <div ref={el => sectionRefs.current[5] = el} data-index="5">
            <SectionCard badge="பகுதி ஊ" title="ஊழியர் நடத்தை மற்றும் மக்கள் நடத்தப்படும் விதம்" enTitle="Staff Conduct & Public Treatment" delay={0.3}>
              <AuditTable items={partF} prefix="f" formData={formData} onChange={handleChange} />
            </SectionCard>
          </div>

          {/* Section G */}
          <div ref={el => sectionRefs.current[6] = el} data-index="6">
            <SectionCard badge="பகுதி எ" title="பொதுமக்கள் திருப்தி மதிப்பீடு" enTitle="Public Satisfaction Assessment" delay={0.35}>
              <SatisfactionTable items={satItems} formData={formData} onChange={handleChange} />
              <div style={{ padding: '20px' }}>
                <label style={{ marginBottom: '10px', display: 'block' }}>
                  <span className="ta">நேரில் வந்த குடிமக்களின் கருத்துக்கள் / புகார்கள்</span>Field Observations from Citizens
                </label>
                <div className="obs-group">
                  {[1, 2, 3].map(id => (
                    <div className="obs-item" key={id}>
                      <div className="obs-num">{id}</div>
                      <textarea 
                        name={`citizen${id}`} 
                        placeholder={`குடிமகன் ${id} கருத்து...`} 
                        onChange={handleChange}
                        value={formData[`citizen${id}`] || ''}
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Section H */}
          <div ref={el => sectionRefs.current[7] = el} data-index="7">
            <SectionCard badge="பகுதி ஏ" title="கூடுதல் கண்டறிதல்கள் மற்றும் பரிந்துரைகள்" enTitle="Additional Findings & Recommendations" delay={0.4}>
              <label style={{ marginBottom: '8px', display: 'block' }}><span className="ta">நல்ல நடைமுறைகள் (Good Practices)</span>Commendable Points</label>
              <div className="rec-list" style={{ marginBottom: '20px' }}>
                {[1, 2].map(id => (
                  <div className="rec-item" key={id}>
                    <div className="rec-bullet green"></div>
                    <input type="text" name={`good${id}`} placeholder={`நல்ல நடைமுறை ${id}...`} onChange={handleChange} value={formData[`good${id}`] || ''} />
                  </div>
                ))}
              </div>

              <label style={{ marginBottom: '8px', display: 'block' }}><span className="ta">முன்னேற்றம் தேவைப்படும் துறைகள் (Areas Needing Improvement)</span></label>
              <div className="rec-list" style={{ marginBottom: '20px' }}>
                {[1, 2, 3].map(id => (
                  <div className="rec-item" key={id}>
                    <div className="rec-bullet red"></div>
                    <input type="text" name={`improve${id}`} placeholder={`முன்னேற்றம் தேவை ${id}...`} onChange={handleChange} value={formData[`improve${id}`] || ''} />
                  </div>
                ))}
              </div>

              <label style={{ marginBottom: '8px', display: 'block' }}><span className="ta">தன்னார்வலர் பரிந்துரைகள் (Volunteer Recommendations)</span></label>
              <div className="rec-list">
                {[1, 2].map(id => (
                  <div className="rec-item" key={id}>
                    <div className="rec-bullet"></div>
                    <input type="text" name={`rec${id}`} placeholder={`பரிந்துரை ${id}...`} onChange={handleChange} value={formData[`rec${id}`] || ''} />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Oath & Signature */}
          <SectionCard badge="உறுதிமொழி" title="தன்னார்வலர் உறுதிமொழி & கையொப்பங்கள்" enTitle="Volunteer Declaration & Signatures" delay={0.45}>
            <div className="oath-box">
              <div className="oath-text">
                மேற்குறிப்பிட்ட விவரங்கள் அனைத்தும் நேரில் கண்டறிந்த உண்மையான தகவல்கள் என்று உறுதியளிக்கிறேன். படிவம் பூர்த்தி செய்யும் முன்னர் அலுவலக PRO / அலுவலக தலைமை அலுவலரிடம் முன்னுரை கடிதம் வழங்கப்பட்டுள்ளது.
              </div>
              <div className="sig-grid">
                <div className="sig-box">
                  <label><span className="ta">தன்னார்வலர் கையொப்பம்</span>Volunteer Signature</label>
                  <input className="sig-line" type="text" name="sig_volunteer" placeholder="" onChange={handleChange} value={formData.sig_volunteer || ''} />
                  <div className="field-group" style={{ marginTop: '8px', gap: '8px' }}>
                    <div className="field">
                      <label>தேதி Date</label>
                      <input type="date" name="sig_date" onChange={handleChange} value={formData.sig_date || ''} />
                    </div>
                    <div className="field">
                      <label>நேரம் Time</label>
                      <input type="time" name="sig_time" onChange={handleChange} value={formData.sig_time || ''} />
                    </div>
                  </div>
                </div>
                <div className="sig-box">
                  <label><span className="ta">PRO / அலுவலகத் தலைவர் கையொப்பம்</span>PRO / Head Signature</label>
                  <input className="sig-line" type="text" name="sig_pro" placeholder="" onChange={handleChange} value={formData.sig_pro || ''} />
                </div>
                <div className="sig-box">
                  <label><span className="ta">முத்திரை / அலுவலக மேற்பார்வையாளர்</span>Seal / Supervisor</label>
                  <input className="sig-line" type="text" name="sig_supervisor" placeholder="" onChange={handleChange} value={formData.sig_supervisor || ''} />
                </div>
              </div>
            </div>

            <div className="submit-wrap">
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                <span>{isSubmitting ? '⏳ சமர்ப்பிக்கப்படுகிறது...' : '📋 படிவம் சமர்ப்பிக்கவும் | Submit Audit Form'}</span>
              </button>
            </div>
          </SectionCard>

        </form>
      </div>

      <div className="footer">
        <strong>மாண்புமிகு மக்கள் | MAANBUMIGA MAKKAL</strong><br />
        "ஊழல் இல்லா, மக்கள் ஆட்சி – நம் கனவு; சமூக தணிக்கை – நம் கருவி"
      </div>
    </div>
  );
}

export default App;
