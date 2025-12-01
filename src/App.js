import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Save, 
  Building2, 
  BrainCircuit, 
  Database, 
  Target, 
  ShieldCheck, 
  Lightbulb,
  Sparkles,
  AlertCircle,
  TrendingUp,
  Zap,
  Loader2
} from 'lucide-react';

// --- CONFIGURATION ---
// ⚠️ IMPORTANT: Replace the URL below with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVyJW17RBqUq4kD68XTIcfjFR7-Jdst-XFDzYJj9spzR7nbUcSmmoEWrYHn2lCVwML/exec"; 

// --- Visual Components (Standard CSS) ---

const Card = ({ children, className = "" }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

const Button = ({ onClick, variant = 'primary', disabled = false, children, className = "" }) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    className={`btn btn-${variant} ${className}`}
  >
    {children}
  </button>
);

const ErrorMsg = ({ message }) => (
  message ? (
    <div className="error-msg">
      <AlertCircle size={14} /> {message}
    </div>
  ) : null
);

const InputText = ({ label, value, onChange, placeholder, required = false, error }) => (
  <div className="input-group">
    <label className="input-label">
      {label} {required && <span className="required">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`text-input ${error ? 'error-border' : ''}`}
    />
    <ErrorMsg message={error} />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, optional = false, error }) => (
  <div className="input-group">
    <label className="input-label">
      {label} {optional ? <span className="text-slate-400 font-normal italic ml-1">- Optional</span> : <span className="required">*</span>}
    </label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className={`textarea-input ${error ? 'error-border' : ''}`}
    />
    <ErrorMsg message={error} />
  </div>
);

const Select = ({ label, options, value, onChange, error }) => (
  <div className="input-group">
    <label className="input-label">
      {label} <span className="required">*</span>
    </label>
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`select-input ${error ? 'error-border' : ''}`}
      >
        <option value="" disabled>Select an option...</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>{opt}</option>
        ))}
      </select>
      <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
        <ArrowRight size={18} style={{ transform: 'rotate(90deg)' }} />
      </div>
    </div>
    <ErrorMsg message={error} />
  </div>
);

const RadioGroup = ({ label, options, value, onChange, error }) => (
  <div className="input-group">
    <label className="input-label">
      {label} <span className="required">*</span>
    </label>
    <div className="option-grid grid-1">
      {options.map((opt, idx) => (
        <div 
          key={idx} 
          className={`option-card ${value === opt ? 'selected' : ''} ${error ? 'error-border' : ''}`}
          onClick={() => onChange(opt)}
        >
          <div className="radio-visual">
            <div className="radio-dot"></div>
          </div>
          <span className="option-text">{opt}</span>
        </div>
      ))}
    </div>
    <ErrorMsg message={error} />
  </div>
);

const CheckboxGroup = ({ label, options, values = [], onChange, error }) => {
  const handleToggle = (option) => {
    if (values.includes(option)) {
      onChange(values.filter(v => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <div className="input-group">
      <label className="input-label">
        {label} <span className="required">*</span>
      </label>
      <div className="option-grid grid-2">
        {options.map((opt, idx) => (
          <div 
            key={idx} 
            className={`option-card ${values.includes(opt) ? 'selected' : ''} ${error ? 'error-border' : ''}`}
            onClick={() => handleToggle(opt)}
          >
            <div className="checkbox-visual">
              {values.includes(opt) && <CheckCircle size={14} color="white" />}
            </div>
            <span className="option-text">{opt}</span>
          </div>
        ))}
      </div>
      <ErrorMsg message={error} />
    </div>
  );
};

const LikertScale = ({ label, value, onChange, error }) => {
  const levels = [1, 2, 3, 4, 5];
  const labels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

  return (
    <div className={`likert-container ${error ? 'error-border' : ''}`}>
      <label className="input-label" style={{ textAlign: 'center', marginBottom: '20px' }}>"{label}" <span className="required">*</span></label>
      <div className="likert-options">
        {levels.map((level, idx) => (
          <div key={level} className={`likert-item ${value === level ? 'active' : ''}`} onClick={() => onChange(level)}>
            <div className="likert-btn">
              {level}
            </div>
            <span className="likert-label">
              {labels[idx]}
            </span>
          </div>
        ))}
      </div>
      <ErrorMsg message={error} />
    </div>
  );
};

const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  return (
    <div className="progress-container">
      <div 
        className="progress-fill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

// --- Helper Functions ---

const fieldLabels = {
  about: {
    companyName: "Company Name",
    department: "Department",
    role: "Role Level",
    revenue: "Revenue Range",
    headcount: "Total Headcount"
  },
  journey: {
    frequency: "Usage Frequency",
    timeSaved: "Time Saved",
    blocker: "Primary Blocker",
    tools: "Tools Used",
    proficiency: "Proficiency Level",
    shadowIT: "Personal Account Usage"
  },
  data: {
    workflow: "Workflow Integration",
    accessibility: "Data Accessibility",
    quality: "Data Quality",
    improvement: "Improvement Opportunity"
  },
  vision: {
    clarity: "Vision Clarity",
    leadership: "Leadership Understanding",
    resources: "Resources & Capability",
    learningPref: "Learning Preference",
    culture: "Cultural Readiness"
  },
  ethics: {
    policy: "Policy Awareness",
    confidence: "Data Safety Confidence",
    checking: "Human-in-the-loop Comfort",
    transparency: "Transparency Awareness"
  },
  future: {
    depts: "Priority Departments",
    deptsOther: "Other Department",
    deptExample: "Specific Task Example",
    functionalValue: "High-Value Activities",
    functionalOther: "Other Activity",
    magicWand: "Magic Wand Wish"
  }
};

const sectionTitles = {
  about: 'About You',
  journey: 'AI Journey',
  data: 'Data Foundation',
  vision: 'Vision & Support',
  ethics: 'Governance & Ethics',
  future: 'Possibilities'
};

const flattenData = (data) => {
  const flat = {};
  const keys = [
    "about.companyName", "about.department", "about.role", "about.revenue", "about.headcount",
    "journey.frequency", "journey.timeSaved", "journey.blocker", "journey.tools", "journey.proficiency", "journey.shadowIT",
    "data.workflow", "data.accessibility", "data.quality", "data.improvement",
    "vision.clarity", "vision.leadership", "vision.resources", "vision.learningPref", "vision.culture",
    "ethics.policy", "ethics.confidence", "ethics.checking", "ethics.transparency",
    "future.depts", "future.deptsOther", "future.deptExample", "future.functionalValue", "future.functionalOther", "future.magicWand"
  ];

  keys.forEach(key => {
    const [section, field] = key.split('.');
    let value = data[section]?.[field];
    if (Array.isArray(value)) value = value.join(", ");
    if (value === undefined || value === null) value = "";
    flat[key] = value;
  });

  return flat;
};

const formatValue = (val) => {
  if (Array.isArray(val)) return val.join(", ");
  if (val === undefined || val === null) return "";
  return val.toString();
};

// --- Main App Component ---

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);
  
  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  const isLeadership = formData.about?.role === "Director / VP" || formData.about?.role === "Executive Leadership (C-Suite, SVP)";

  const validateStep = (stepIdx) => {
    const newErrors = {};
    const data = formData;
    const hasVal = (sec, field) => {
      const val = data[sec]?.[field];
      return val !== undefined && val !== "" && (Array.isArray(val) ? val.length > 0 : true);
    };

    switch (stepIdx) {
      case 1:
        if (!hasVal("about", "companyName")) newErrors["about.companyName"] = "Required";
        if (!hasVal("about", "department")) newErrors["about.department"] = "Required";
        if (!hasVal("about", "role")) newErrors["about.role"] = "Required";
        if (isLeadership) {
          if (!hasVal("about", "revenue")) newErrors["about.revenue"] = "Required";
          if (!hasVal("about", "headcount")) newErrors["about.headcount"] = "Required";
        }
        break;
      case 2:
        if (!hasVal("journey", "frequency")) newErrors["journey.frequency"] = "Required";
        if (!hasVal("journey", "timeSaved")) newErrors["journey.timeSaved"] = "Required";
        if (!hasVal("journey", "blocker")) newErrors["journey.blocker"] = "Required";
        if (!hasVal("journey", "tools")) newErrors["journey.tools"] = "Required";
        if (!hasVal("journey", "proficiency")) newErrors["journey.proficiency"] = "Required";
        if (!hasVal("journey", "shadowIT")) newErrors["journey.shadowIT"] = "Required";
        break;
      case 3:
        if (!hasVal("data", "workflow")) newErrors["data.workflow"] = "Required";
        if (!hasVal("data", "accessibility")) newErrors["data.accessibility"] = "Required";
        if (!hasVal("data", "quality")) newErrors["data.quality"] = "Required";
        if (!hasVal("data", "improvement")) newErrors["data.improvement"] = "Required";
        break;
      case 4:
        if (!hasVal("vision", "clarity")) newErrors["vision.clarity"] = "Required";
        if (!hasVal("vision", "leadership")) newErrors["vision.leadership"] = "Required";
        if (!hasVal("vision", "resources")) newErrors["vision.resources"] = "Required";
        if (!hasVal("vision", "learningPref")) newErrors["vision.learningPref"] = "Required";
        if (!hasVal("vision", "culture")) newErrors["vision.culture"] = "Required";
        break;
      case 5:
        if (!hasVal("ethics", "policy")) newErrors["ethics.policy"] = "Required";
        if (!hasVal("ethics", "confidence")) newErrors["ethics.confidence"] = "Required";
        if (!hasVal("ethics", "checking")) newErrors["ethics.checking"] = "Required";
        if (!hasVal("ethics", "transparency")) newErrors["ethics.transparency"] = "Required";
        break;
      case 6:
        if (!hasVal("future", "depts")) newErrors["future.depts"] = "Required";
        if (data.future?.depts?.includes("Other") && !hasVal("future", "deptsOther")) newErrors["future.deptsOther"] = "Required";
        if (!hasVal("future", "functionalValue")) newErrors["future.functionalValue"] = "Required";
        if (data.future?.functionalValue?.includes("Other") && !hasVal("future", "functionalOther")) newErrors["future.functionalOther"] = "Required";
        break;
      default: break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitToGoogleSheets = async (data) => {
    setIsSubmitting(true);
    try {
      const flatData = flattenData(data);
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flatData),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting:", error);
      alert("There was an error submitting your survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < sections.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        submitToGoogleSheets(formData);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const sections = [
    {
      id: "intro",
      icon: <Sparkles size={24} />,
      title: "Welcome",
      content: (
        <div className="welcome-hero">
          <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 30px' }}>
            <div style={{ position: 'absolute', inset: 0, background: '#6366f1', borderRadius: '50%', filter: 'blur(20px)', opacity: 0.5 }}></div>
            <div style={{ position: 'relative', width: '100%', height: '100%', background: 'linear-gradient(to top right, #7c3aed, #4f46e5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)' }}>
              <TrendingUp size={48} color="white" />
            </div>
          </div>
          
          <h2 className="hero-title">
            Accelerating our Future with AI
          </h2>
          
          <p className="hero-desc">
            We are launching this survey to <span className="highlight">understand the AI adoption journey of Australian businesses</span> and identify <span className="highlight">high-impact opportunities for improvement and growth</span>.
          </p>
          
          <div style={{ background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)', padding: '30px', borderRadius: '24px', border: '1px solid #e0e7ff', display: 'inline-block', textAlign: 'left', maxWidth: '500px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#312e81', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} color="#4f46e5" /> What to expect:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px', color: '#334155' }}>
              {[
                "It takes about 5 minutes.",
                "Your answers shape our strategy.",
                "We want your honest thoughts!"
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "about",
      title: "About You",
      icon: <Building2 size={24} />,
      content: (
        <div>
          <InputText label="1. First things first—what is your company name?" value={formData.about?.companyName || ""} onChange={(val) => updateField("about", "companyName", val)} required error={errors["about.companyName"]} />
          <Select label="2. Which department do you call home?" options={["Sales", "Marketing", "Customer Services", "Strategy", "Engineering / IT", "HR", "Finance", "Operations", "Legal", "CEO / COO / CFO", "Other"]} value={formData.about?.department || ""} onChange={(val) => updateField("about", "department", val)} error={errors["about.department"]} />
          <Select label="3. What is your role level?" options={["Individual Contributor / Specialist", "Team Lead / Supervisor", "Manager / Senior Manager", "Director / VP", "Executive Leadership (C-Suite, SVP)"]} value={formData.about?.role || ""} onChange={(val) => updateField("about", "role", val)} error={errors["about.role"]} />
          {isLeadership && (
            <div style={{ background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)', padding: '30px', borderRadius: '24px', border: '1px solid #fef3c7', marginTop: '30px' }}>
              <h4 style={{ color: '#78350f', fontWeight: '800', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}><Target size={20} color="#d97706"/> Leadership Questions</h4>
              <RadioGroup label="4. What is our approximate annual revenue range?" options={["Less than $1M", "$1M – $10M", "$10M – $50M", "$50M – $100M", "$100M+"]} value={formData.about?.revenue || ""} onChange={(val) => updateField("about", "revenue", val)} error={errors["about.revenue"]} />
              <RadioGroup label="5. What is our total headcount?" options={["1–10", "10–25", "25–50", "50–100", "100–200", "200+"]} value={formData.about?.headcount || ""} onChange={(val) => updateField("about", "headcount", val)} error={errors["about.headcount"]} />
            </div>
          )}
        </div>
      )
    },
    {
      id: "journey",
      title: "Your AI Journey",
      icon: <BrainCircuit size={24} />,
      content: (
        <div>
          <RadioGroup label="6. How often do you get to use Generative AI tools?" options={["Daily - Multiple times a day!", "Daily - Once or twice", "Weekly - A few times a week", "Ad-hoc - Rarely", "Never - I haven't used them yet"]} value={formData.journey?.frequency || ""} onChange={(val) => updateField("journey", "frequency", val)} error={errors["journey.frequency"]} />
          <RadioGroup label="7. Roughly how much time do you think AI tools save you per week?" options={["I don't use them yet", "Less than 1 hour", "1–4 hours (About half a day)", "5–8 hours (A full day saved!)", "8+ hours (Game changer)"]} value={formData.journey?.timeSaved || ""} onChange={(val) => updateField("journey", "timeSaved", val)} error={errors["journey.timeSaved"]} />
          <RadioGroup label="8. What is the biggest thing stopping you from using AI more?" options={["Lack of Training", "Access / Blocked", "Uncertainty / Safety", "Relevance to my job", "No Time to learn", "Nothing - I use it to the max!"]} value={formData.journey?.blocker || ""} onChange={(val) => updateField("journey", "blocker", val)} error={errors["journey.blocker"]} />
          <CheckboxGroup label="9. Which of these tools have you tried?" options={["OpenAI (ChatGPT)", "Microsoft Copilot", "Google Gemini", "Anthropic Claude", "DeepSeek", "Cursor", "Perplexity", "Midjourney", "Internal Tools", "Other"]} values={formData.journey?.tools || []} onChange={(val) => updateField("journey", "tools", val)} error={errors["journey.tools"]} />
          <RadioGroup label="10. How comfortable do you feel using these tools?" options={["1 - Novice", "2 - Beginner", "3 - Intermediate", "4 - Advanced"]} value={formData.journey?.proficiency || ""} onChange={(val) => updateField("journey", "proficiency", val)} error={errors["journey.proficiency"]} />
          <RadioGroup label="11. Do you sometimes use personal AI accounts?" options={["Yes, frequently (Secret Weapon)", "Occasionally", "No, never"]} value={formData.journey?.shadowIT || ""} onChange={(val) => updateField("journey", "shadowIT", val)} error={errors["journey.shadowIT"]} />
        </div>
      )
    },
    {
      id: "data",
      title: "Data Foundation",
      icon: <Database size={24} />,
      content: (
        <div>
          <RadioGroup label="12. When you use AI, how does it fit into your day?" options={["Standalone (Chatbot in a tab)", "Embedded (Built into software)", "Not Applicable"]} value={formData.data?.workflow || ""} onChange={(val) => updateField("data", "workflow", val)} error={errors["data.workflow"]} />
          <RadioGroup label="13. How easy is it for you to find and access the data you need?" options={["Very Difficult", "Somewhat Difficult", "Neutral", "Easy", "Seamless"]} value={formData.data?.accessibility || ""} onChange={(val) => updateField("data", "accessibility", val)} error={errors["data.accessibility"]} />
          <RadioGroup label="14. How often do you run into errors, duplicates, or 'messy' data?" options={["All the time", "Frequently", "Sometimes", "Rarely", "Never"]} value={formData.data?.quality || ""} onChange={(val) => updateField("data", "quality", val)} error={errors["data.quality"]} />
          <TextArea label="15. Where is the biggest opportunity to improve our data?" placeholder="e.g., 'The customer database is always out of date...'" value={formData.data?.improvement || ""} onChange={(val) => updateField("data", "improvement", val)} error={errors["data.improvement"]} />
        </div>
      )
    },
    {
      id: "vision",
      title: "Vision & Support",
      icon: <Target size={24} />,
      content: (
        <div>
          <LikertScale label="16. I feel excited and clear about the company's vision for using AI." value={formData.vision?.clarity || 0} onChange={(val) => updateField("vision", "clarity", val)} error={errors["vision.clarity"]} />
          <LikertScale label="17. Leadership understands the practical reality of using AI in my job." value={formData.vision?.leadership || 0} onChange={(val) => updateField("vision", "leadership", val)} error={errors["vision.leadership"]} />
          <LikertScale label="18. I have the necessary time, budget, and capability to learn these tools." value={formData.vision?.resources || 0} onChange={(val) => updateField("vision", "resources", val)} error={errors["vision.resources"]} />
          <RadioGroup label="19. If we offered more AI training, how would you prefer to learn?" options={["Live Workshops", "Self-Paced Video Courses", "'Recipes' (Copy-paste prompts)", "Peer Learning (Lunch & Learns)"]} value={formData.vision?.learningPref || ""} onChange={(val) => updateField("vision", "learningPref", val)} error={errors["vision.learningPref"]} />
          <LikertScale label="20. My department is open-minded and ready to change for new tech." value={formData.vision?.culture || 0} onChange={(val) => updateField("vision", "culture", val)} error={errors["vision.culture"]} />
        </div>
      )
    },
    {
      id: "ethics",
      title: "Governance & Ethics",
      icon: <ShieldCheck size={24} />,
      content: (
        <div>
          <RadioGroup label="21. Have you seen our 'AI Acceptable Use' guidelines?" options={["Yes, read them", "Know they exist, haven't read", "No, didn't know we had any"]} value={formData.ethics?.policy || ""} onChange={(val) => updateField("ethics", "policy", val)} error={errors["ethics.policy"]} />
          <RadioGroup label="22. How confident are you about what is safe to share with AI vs. secret?" options={["Not confident at all", "Somewhat cautious", "Very confident"]} value={formData.ethics?.confidence || ""} onChange={(val) => updateField("ethics", "confidence", val)} error={errors["ethics.confidence"]} />
          <LikertScale label="23. I feel comfortable checking AI work for mistakes/bias before sending." value={formData.ethics?.checking || 0} onChange={(val) => updateField("ethics", "checking", val)} error={errors["ethics.checking"]} />
          <LikertScale label="24. I know when I should be transparent that AI helped me write something." value={formData.ethics?.transparency || 0} onChange={(val) => updateField("ethics", "transparency", val)} error={errors["ethics.transparency"]} />
        </div>
      )
    },
    {
      id: "future",
      title: "Possibilities",
      icon: <Lightbulb size={24} />,
      content: (
        <div>
          <CheckboxGroup label="25. Which specific Departments need AI the most right now?" options={["Sales", "Marketing", "HR", "Finance", "Engineering", "Ops", "Legal", "Customer Service", "Other"]} values={formData.future?.depts || []} onChange={(val) => updateField("future", "depts", val)} error={errors["future.depts"]} />
          {formData.future?.depts?.includes("Other") && <InputText label="Please specify the 'Other' department:" placeholder="e.g. Research & Development" value={formData.future?.deptsOther || ""} onChange={(val) => updateField("future", "deptsOther", val)} required error={errors["future.deptsOther"]} />}
          <TextArea label="26. Can you give a specific example of a task in those departments that needs fixing?" placeholder="e.g. 'Finance needs AI to scan invoices automatically...'" value={formData.future?.deptExample || ""} onChange={(val) => updateField("future", "deptExample", val)} optional error={errors["future.deptExample"]} />
          <CheckboxGroup label="27. Which day-to-day activities offer the biggest 'gold mine' for value? (Max 3)" options={["Writing & Editing", "Data & Insights", "Client Support", "Coding & Tech", "Meeting & Doc Prep", "Knowledge Search", "Visual Creation", "Project Management", "Risk Analysis", "Process Automation", "Translation & Localization", "Research & Competitive Intelligence", "Other"]} values={formData.future?.functionalValue || []} onChange={(val) => { if (val.length <= 3) updateField("future", "functionalValue", val); }} error={errors["future.functionalValue"]} />
          {formData.future?.functionalValue?.includes("Other") && <InputText label="Please specify the 'Other' activity:" placeholder="e.g. Supply Chain Optimization" value={formData.future?.functionalOther || ""} onChange={(val) => updateField("future", "functionalOther", val)} required error={errors["future.functionalOther"]} />}
          <TextArea label="28. The 'Magic Wand': If you could solve one boring part of your job instantly, what would it be?" placeholder="I would automate..." value={formData.future?.magicWand || ""} onChange={(val) => updateField("future", "magicWand", val)} optional error={errors["future.magicWand"]} />
        </div>
      )
    }
  ];

  // --- Render Submitted View (Standard CSS) ---
  if (isSubmitted) {
    return (
      <div className="container">
        <div className="wrapper">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'linear-gradient(to top right, #34d399, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 10px 20px rgba(5, 150, 105, 0.2)' }}>
              <CheckCircle size={40} color="white" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '10px' }}>Survey Completed!</h2>
            <p style={{ color: '#475569', marginBottom: '30px' }}>Thank you for your valuable feedback.</p>
            
            <div style={{ textAlign: 'left', maxHeight: '50vh', overflowY: 'auto', background: 'rgba(255,255,255,0.5)', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
              {Object.keys(formData).length > 0 ? Object.entries(formData).map(([sectionKey, sectionData]) => (
                <div key={sectionKey} style={{ marginBottom: '20px' }}>
                  <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', color: '#4f46e5', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #cbd5e1', paddingBottom: '5px' }}>{sectionTitles[sectionKey] || sectionKey}</h3>
                  {Object.entries(sectionData).map(([fieldKey, value]) => {
                    const label = fieldLabels[sectionKey]?.[fieldKey] || fieldKey;
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;
                    return (
                      <div key={fieldKey} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', fontSize: '0.9rem', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: '#334155' }}>{label}</span>
                        <span style={{ color: '#475569' }}>{formatValue(value)}</span>
                      </div>
                    );
                  })}
                </div>
              )) : <p>No data.</p>}
            </div>
            
            <Button onClick={() => window.location.reload()} style={{ margin: '0 auto' }}>Start New Survey</Button>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Wizard View ---
  const CurrentIcon = sections[currentStep].icon;

  return (
    <div className="container">
      <div className="wrapper">
        <div className="header">
          <div className="header-left">
            <div className="icon-box">
              {CurrentIcon}
            </div>
            <div className="title-group">
              <h1>{sections[currentStep].title}</h1>
              <p>Section {currentStep + 1} of {sections.length}</p>
            </div>
          </div>
          <div className="badge">Confidential</div>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={sections.length} />

        <Card>
          {sections[currentStep].content}
        </Card>

        <div className="footer-nav">
          <Button 
            variant="ghost" 
            onClick={handlePrev} 
            disabled={currentStep === 0 || isSubmitting} 
            className={currentStep === 0 ? "invisible" : ""}
          >
            <ArrowLeft size={20} /> Previous
          </Button>

          <Button onClick={handleNext} disabled={isSubmitting}>
            {isSubmitting ? (
              <> <Loader2 size={20} className="animate-spin" /> Submitting... </>
            ) : currentStep === sections.length - 1 ? (
              <> Submit Survey <Save size={20} /> </>
            ) : (
              <> Next Section <ArrowRight size={20} /> </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;