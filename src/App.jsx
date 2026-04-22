import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import IntroBox from './components/IntroBox';
import SectionCard from './components/SectionCard';
import AuditTable from './components/AuditTable';
import SatisfactionTable from './components/SatisfactionTable';
import InstallPrompt from './components/InstallPrompt';
import { sections, partB, partC, partD, partE, partF, satItems, tnDistricts, districtTaluks, tnDepartments } from './constants/auditData';

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
          if (index !== null) {
            setCurrentSectionLabel(sections[index]);
          }
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
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

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
          <div id="success-msg" style={{ display: 'block' }}>
            <div className="check">✅</div>
            <h3>தணிக்கை படிவம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!</h3>
            <p>Audit form submitted successfully.<br />மாண்புமிகு மக்கள் இயக்கம் தங்கள் பங்களிப்பிற்கு நன்றி தெரிவிக்கிறது.</p>
          </div>
        </div>
        <div className="footer">
          <strong>மாண்புமிகு மக்கள் | MAANBUMIGA MAKKAL</strong><br />
          www.maanbumigumakkal.com &nbsp;|&nbsp; support@maanbumigumakkal.com<br />
          <span style={{ marginTop: '4px', display: 'block' }}>"ஊழல் இல்லா, மக்கள் ஆட்சி – நம் கனவு; சமூக தணிக்கை – நம் கருவி"</span>
        </div>
      </>
    );
  }

  return (
    <div className="App">
      <InstallPrompt />
      <Header />
      <IntroBox />
      <ProgressBar progress={progress} currentSection={currentSectionLabel} />

      <div className="container">
        <form id="audit-form" onSubmit={handleSubmit}>
          
          {/* Section A */}
          <div ref={el => sectionRefs.current[0] = el} data-index="0">
            <SectionCard 
              badge="பகுதி அ" 
              title="தன்னார்வலர் மற்றும் அலுவலக விவரங்கள்" 
              enTitle="Volunteer & Office Details" 
              delay={0.05}
            >
              <div className="field-group">
                <div className="field">
                  <label><span className="ta">தன்னார்வலர் பெயர்</span>Volunteer Name</label>
                  <input type="text" name="vol_name" placeholder="பெயர் உள்ளிடவும்" required onChange={handleChange} value={formData.vol_name || ''} />
                </div>
                <div className="field">
                  <label><span className="ta">அடையாள எண்</span>ID Number</label>
                  <input type="text" name="vol_id" placeholder="TN-20XX-XXXX" onChange={handleChange} value={formData.vol_id || ''} />
                </div>
              </div>
              <div className="field-group triple">
                <div className="field">
                  <label><span className="ta">தணிக்கை நாள்</span>Audit Date</label>
                  <input type="date" name="audit_date" required onChange={handleChange} value={formData.audit_date || ''} />
                </div>
                <div className="field">
                  <label><span className="ta">தணிக்கை நேரம்</span>Audit Time</label>
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
                  <label><span className="ta">துறை</span>Department</label>
                  <select name="dept" required onChange={handleChange} value={formData.dept || ''}>
                    <option value="">-- தேர்ந்தெடுக்கவும் Choose --</option>
                    {tnDepartments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.ta} / {dept.en}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="field-group">
                <div className="field">
                  <label><span className="ta">அலுவலக பெயர்</span>Office Name</label>
                  <input type="text" name="office_name" required onChange={handleChange} value={formData.office_name || ''} />
                </div>
                <div className="field">
                  <label><span className="ta">தொடர்பு எண்</span>Phone</label>
                  <input type="tel" name="head_phone" placeholder="+91 XXXXX XXXXX" onChange={handleChange} value={formData.head_phone || ''} />
                </div>
              </div>
              <div className="field-group single">
                <div className="field">
                  <label><span className="ta">அலுவலக முகவரி</span>Office Address</label>
                  <textarea name="office_address" placeholder="முழு முகவரி..." onChange={handleChange} value={formData.office_address || ''}></textarea>
                </div>
              </div>
              <div className="field-group">
                <div className="field">
                  <label><span className="ta">அலுவலக முதன்மை பணியாளர் பெயர்</span>Head Officer Name</label>
                  <input type="text" name="head_name" onChange={handleChange} value={formData.head_name || ''} />
                </div>
                <div className="field">
                  <label><span className="ta">மின்னஞ்சல் முகவரி</span>Email</label>
                  <input type="email" name="head_email" placeholder="office@tn.gov.in" onChange={handleChange} value={formData.head_email || ''} />
                </div>
              </div>
              <div className="field-group single">
                <div className="field">
                  <label><span className="ta">ஆய்வில் பங்கேற்ற இதர தன்னார்வலர்கள்</span>Other Volunteers Participated</label>
                  <input type="text" name="other_vols" placeholder="பெயர்கள்..." onChange={handleChange} value={formData.other_vols || ''} />
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Section B */}
          <div ref={el => sectionRefs.current[1] = el} data-index="1">
            <SectionCard badge="பகுதி ஆ" title="அடிப்படை உட்கட்டமைப்பு வசதிகள்" enTitle="Basic Infrastructure Facilities" delay={0.1}>
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
            <SectionCard badge="பகுதி ஈ" title="தொலைபேசி எண்கள், மின்னஞ்சல் கொள்கைகள் மற்றும் CCTV" enTitle="Phone Numbers, Email Policies & CCTV" delay={0.2}>
              <AuditTable items={partD} prefix="d" formData={formData} onChange={handleChange} />
            </SectionCard>
          </div>

          {/* Section E */}
          <div ref={el => sectionRefs.current[4] = el} data-index="4">
            <SectionCard badge="பகுதி உ" title="குடிமக்கள் சாசன இணக்கம்" enTitle="Citizen Charter Compliance" delay={0.25}>
              <AuditTable items={partE} prefix="e" formData={formData} onChange={handleChange} />
            </SectionCard>
          </div>

          {/* Section F */}
          <div ref={el => sectionRefs.current[5] = el} data-index="5">
            <SectionCard badge="பகுதி ஊ" title="ஊழியர் நடத்தை மற்றும் பொதுமக்கள் நடத்தப்படும் விதம்" enTitle="Staff Conduct & Public Treatment" delay={0.3}>
              <AuditTable items={partF} prefix="f" formData={formData} onChange={handleChange} />
            </SectionCard>
          </div>


          {/* Section G */}
          <div ref={el => sectionRefs.current[6] = el} data-index="6">
            <SectionCard badge="பகுதி எ" title="மாண்புமிகு குடியரசர்களின் பார்வையில் அலுவலக செயல்பாடு" enTitle="Public Satisfaction Assessment" delay={0.35}>
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
              <label style={{ marginBottom: '8px', display: 'block' }}><span className="ta">நல்ல நடைமுறைகள் (Good Practices – Commendable Points)</span></label>
              <div className="rec-list" style={{ marginBottom: '20px' }}>
                {[1, 2, 3].map(id => (
                  <div className="rec-item" key={id}>
                    <div className="rec-bullet green"></div>
                    <input type="text" name={`good${id}`} placeholder={`நல்ல நடைமுறை ${id}...`} onChange={handleChange} value={formData[`good${id}`] || ''} />
                  </div>
                ))}
              </div>

              <label style={{ marginBottom: '8px', display: 'block' }}><span className="ta">முன்னேற்றம் தேவைப்படும் துறைகள் (Areas Need Improvement)</span></label>
              <div className="rec-list" style={{ marginBottom: '20px' }}>
                {[1, 2, 3].map(id => (
                  <div className="rec-item" key={id}>
                    <div className="rec-bullet red"></div>
                    <input type="text" name={`improve${id}`} placeholder={`முன்னேற்றம் தேவை ${id}...`} onChange={handleChange} value={formData[`improve${id}`] || ''} />
                  </div>
                ))}
              </div>

              <label style={{ marginBottom: '8px', display: 'block' }}><span className="ta">தன்னார்வலர் பரிந்துரைகள் (Volunteer Recommendations)</span></label>
              <div className="rec-list" style={{ marginBottom: '24px' }}>
                {[1, 2, 3].map(id => (
                  <div className="rec-item" key={id}>
                    <div className="rec-bullet"></div>
                    <input type="text" name={`rec${id}`} placeholder={`பரிந்துரை ${id}...`} onChange={handleChange} value={formData[`rec${id}`] || ''} />
                  </div>
                ))}
              </div>
              
              <label style={{ marginBottom: '8px', display: 'block' }}><span className="ta">சமூக தணிக்கையில் தன்னார்வலரின் அனுபவம்</span>Experience of Volunteer</label>
              <div className="exp-group">
                <div className="exp-item">
                  <input type="radio" name="exp" id="exp1" value="good" onChange={handleChange} checked={formData.exp === 'good'} />
                  <label htmlFor="exp1">சிறப்பான ஒத்துழைப்பிற்கு நன்றி.</label>
                </div>
                <div className="exp-item">
                  <input type="radio" name="exp" id="exp2" value="poor" onChange={handleChange} checked={formData.exp === 'poor'} />
                  <label htmlFor="exp2">எதிர்பார்த்த ஒத்துழைப்பு இல்லாதது ஏமாற்றமளிக்கிறது.</label>
                </div>
                <div className="exp-item">
                  <input type="radio" name="exp" id="exp3" value="refused" onChange={handleChange} checked={formData.exp === 'refused'} />
                  <label htmlFor="exp3">மாண்புமிகு மக்களின் சமூக தணிக்கையை இவ்வலுவலகம் விரும்பவில்லை.</label>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Oath & Signature */}
          <div ref={el => sectionRefs.current[8] = el} data-index="8">
            <SectionCard badge="உறுதிமொழி" title="தன்னார்வலர் உறுதிமொழி & கையொப்பங்கள்" enTitle="Volunteer Declaration & Signatures" delay={0.45}>
              <div className="oath-box">
                <div className="oath-text">
                  மேற்குறிப்பிட்ட விவரங்கள் அனைத்தும் நேரில் கண்டறிந்த உண்மையான தகவல்கள் என்று உறுதியளிக்கிறேன். படிவம் பூர்த்தி செய்து செயலியில் பதிவேற்றம் செய்வதற்கு முன்பாக போதிய கால அவகாசத்துடன் அலுவலக முதன்மை பணியாளரிடம் இந்த ஆய்வறிக்கையின் படிவம் வழங்கப்பட்டது என்பதை உறுதிப்படுத்துகிறேன். இந்த நேர்வில் சேகரிக்கப்பட்ட தகவல்கள் அனைத்தும் அரசு எந்திரத்தில் நிலவும் குறைகளை சீர்திருத்தும் நோக்கில் மட்டுமே பயன்படுத்தப்படும் என்றும், தவறான வழியில் பயன்படுத்தப்படமாட்டாது என்றும் உறுதி அளிக்கிறேன்.
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
                    <label><span className="ta">PRO / அலுவலக பணியாளர் பெயர் & கையொப்பம்</span>PRO / Staff Name & Signature</label>
                    <input type="text" name="pro_name" placeholder="பெயர்..." style={{ marginBottom: '6px' }} onChange={handleChange} value={formData.pro_name || ''} />
                    <input className="sig-line" type="text" name="sig_pro" placeholder="" onChange={handleChange} value={formData.sig_pro || ''} />
                  </div>
                  <div className="sig-box">
                    <label><span className="ta">அலுவலக முத்திரை & மேற்பார்வையாளர்</span>Office Seal & Supervisor</label>
                    <input className="sig-line" type="text" name="sig_supervisor" placeholder="" onChange={handleChange} value={formData.sig_supervisor || ''} />
                    <p style={{ fontSize: '0.68rem', color: 'var(--red)', marginTop: '8px', fontFamily: "'Noto Sans Tamil', sans-serif" }}>ஒத்துழைப்பு கிடைக்கவில்லை எனில் அதுவும் ஆவணப்படுத்தப்படும்.</p>
                  </div>
                </div>
              </div>

              <div className="submit-wrap">
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  <span>{isSubmitting ? '⏳ சமர்ப்பிக்கப்படுகிறது...' : '📋 படிவம் சமர்ப்பிக்கவும் | Submit Audit Form'}</span>
                </button>
              </div>
            </SectionCard>
          </div>

        </form>
      </div>

      <div className="footer">
        <strong>மாண்புமிகு மக்கள் | MAANBUMIGA MAKKAL</strong><br />
        www.maanbumigumakkal.com &nbsp;|&nbsp; support@maanbumigumakkal.com<br />
        <span style={{ marginTop: '4px', display: 'block' }}>"ஊழல் இல்லா, மக்கள் ஆட்சி – நம் கனவு; சமூக தணிக்கை – நம் கருவி"</span>
      </div>
    </div>
  );
}

export default App;
