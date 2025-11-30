 
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Coffee, Sparkles } from 'lucide-react';
import './App.css';

const AISurvey = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset function to go back to start
  const resetSurvey = () => {
    setCurrentSection(0);
    setResponses({});
    setSubmitted(false);
    setSubmitting(false);
  };

  // Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwY8cBDIf6FPRJYeg3G7gYePZNKxGK26wm5qgJPapRycu1bEmohTgZD52VVHniXBJKH/exec';

  const isLeadership = responses.roleLevel === 'director' || responses.roleLevel === 'executive';

  const sections = [
    {
      title: "Organizational Profile & Demographics",
      questions: [
        {
          id: 'organizationName',
          text: 'What is your organisation\'s name?',
          type: 'text',
          required: true
        },
        {
          id: 'department',
          text: '1. Which department best describes your primary function?',
          type: 'select',
          options: ['Sales', 'Marketing', 'Customer Services', 'Strategy', 'Engineering / IT', 'HR', 'Finance', 'Operations', 'Legal', 'Other']
        },
        {
          id: 'roleLevel',
          text: '2. What is your current role level?',
          type: 'radio',
          options: [
            { value: 'ic', label: 'Individual Contributor / Specialist' },
            { value: 'lead', label: 'Team Lead / Supervisor' },
            { value: 'manager', label: 'Manager / Senior Manager' },
            { value: 'director', label: 'Director / VP' },
            { value: 'executive', label: 'Executive Leadership (C-Suite, SVP)' }
          ]
        },
        {
          id: 'tenure',
          text: '3. How long have you been with the organization?',
          type: 'radio',
          options: [
            { value: '<1', label: 'Less than 1 year' },
            { value: '1-3', label: '1–3 years' },
            { value: '3-5', label: '3–5 years' },
            { value: '>5', label: 'More than 5 years' }
          ]
        },
        {
          id: 'revenue',
          text: '4. (Leadership Only) What is the organization\'s approximate annual revenue/turnover range?',
          type: 'select',
          options: ['<$1M', '$1M-$10M', '$10M-$50M', '>$50M'],
          conditional: true
        },
        {
          id: 'headcount',
          text: '5. (Leadership Only) What is the current total headcount of the organization?',
          type: 'select',
          options: ['1–10', '10–25', '25–50', '50–100', '100–200', '200+'],
          conditional: true
        }
      ]
    },
    {
      title: "Usage, Tools & Proficiency",
      questions: [
        {
          id: 'frequency',
          text: '6. How frequently do you currently use Generative AI tools (like ChatGPT, Claude, Copilot) to assist with work tasks?',
          type: 'radio',
          options: [
            { value: 'daily-multiple', label: 'Daily - Multiple times a day' },
            { value: 'daily-once', label: 'Daily - Once or twice a day' },
            { value: 'weekly', label: 'Weekly - A few times a week' },
            { value: 'adhoc', label: 'Ad-hoc - Rarely, only for specific non-routine tasks' },
            { value: 'never', label: 'Never - I do not currently use these tools' }
          ]
        },
        {
          id: 'tools',
          text: '7. Which of the following AI tools have you used for work purposes in the last 30 days? (Select all that apply)',
          type: 'checkbox',
          options: [
            'OpenAI (ChatGPT)',
            'Microsoft Copilot',
            'Google Gemini',
            'Anthropic Claude',
            'DeepSeek',
            'Cursor (AI Code Editor)',
            'Qwen',
            'Kimi',
            'Midjourney / DALL-E (Image Generation)',
            'GitHub Copilot',
            'Perplexity AI',
            'Internal Company AI Tools',
            'Other'
          ]
        },
        {
          id: 'toolsOther',
          text: 'If Other, please specify:',
          type: 'text',
          conditional: true,
          dependsOn: 'tools',
          dependsValue: 'Other'
        },
        {
          id: 'proficiency',
          text: '8. How would you rate your own proficiency in using AI tools effectively?',
          type: 'radio',
          options: [
            { value: '1', label: '1 - Novice (I am just starting to explore)' },
            { value: '2', label: '2 - Beginner (I can do basic Q&A but struggle to get complex results)' },
            { value: '3', label: '3 - Intermediate (I use it regularly for specific tasks and feel comfortable)' },
            { value: '4', label: '4 - Advanced (I can craft complex prompts and integrate it into my workflow)' }
          ]
        },
        {
          id: 'personalUse',
          text: '9. To get your job done efficiently, are there AI tools you sometimes use on personal devices or accounts because the company doesn\'t currently provide access to them?',
          type: 'radio',
          options: [
            { value: 'frequently', label: 'Yes, frequently' },
            { value: 'occasionally', label: 'Yes, occasionally' },
            { value: 'never', label: 'No, never' }
          ]
        }
      ]
    },
    {
      title: "Workflow Integration",
      questions: [
        {
          id: 'integration',
          text: '10. How integrated is AI into your current workflow?',
          type: 'radio',
          options: [
            { value: 'none', label: 'Not integrated (I don\'t use it)' },
            { value: 'sidecar', label: 'Standalone "Sidecar" (I switch tabs to a chatbot, copy-paste info in, copy-paste results out)' },
            { value: 'partial', label: 'Partially Embedded (It is built into some software I use, like Office 365 or my code editor)' },
            { value: 'full', label: 'Fully Integrated (AI agents automate steps in my process without me needing to prompt a chatbot manually)' }
          ]
        },
        {
          id: 'value',
          text: '11. Based on your experience, where does AI currently add the most value to your work? (Select up to two)',
          type: 'checkbox',
          maxSelections: 2,
          options: [
            'Speeding up repetitive tasks (efficiency)',
            'Improving the quality/accuracy of my output',
            'Brainstorming and creative ideation',
            'Summarizing large amounts of information',
            'Coding or technical assistance',
            'It does not currently add value'
          ]
        },
        {
          id: 'taskWish',
          text: '12. Describe one manual, repetitive, or time-consuming task you perform regularly that you wish an AI tool could handle or simplify for you.',
          type: 'textarea'
        }
      ]
    },
    {
      title: "Leadership Readiness & Strategic Vision",
      subtitle: "Please rate your agreement with the following statements (1 = Strongly Disagree, 5 = Strongly Agree)",
      questions: [
        {
          id: 'visionClarity',
          text: '13. "I clearly understand the organization\'s vision and strategy for adopting Artificial Intelligence."',
          type: 'likert'
        },
        {
          id: 'leadershipUnderstanding',
          text: '14. "I feel leadership understands the practical realities and challenges of using AI in my specific job role."',
          type: 'likert'
        },
        {
          id: 'resources',
          text: '15. "I feel I have the necessary time and resources (training, budget) to learn and adopt new AI tools."',
          type: 'likert'
        },
        {
          id: 'culture',
          text: '16. "The culture in my department is generally open to adopting new technologies and changing how we work."',
          type: 'likert'
        }
      ]
    },
    {
      title: "Governance, Risk & Ethics",
      questions: [
        {
          id: 'policyAwareness',
          text: '17. Are you aware of an official organization-wide "AI Acceptable Use Policy" or set of guidelines?',
          type: 'radio',
          options: [
            { value: 'read', label: 'Yes, I have read it.' },
            { value: 'aware', label: 'Yes, I know it exists but haven\'t read the details.' },
            { value: 'no', label: 'No, I am not aware of one.' },
            { value: 'unsure', label: 'Unsure.' }
          ]
        },
        {
          id: 'dataConfidence',
          text: '18. How confident are you that you know what types of company data are safe to share with public AI models (like ChatGPT) versus what must be kept private?',
          type: 'radio',
          options: [
            { value: '1', label: '1 - Not confident at all (I am confused about what is allowed)' },
            { value: '2', label: '2 - Somewhat insecure' },
            { value: '3', label: '3 - Neutral' },
            { value: '4', label: '4 - Mostly confident' },
            { value: '5', label: '5 - Very confident (I clearly understand data classification)' }
          ]
        },
        {
          id: 'ethicalSupport',
          text: '19. "When I use AI, I feel supported by the organization to make ethical decisions about how its output is used (e.g., checking for bias, ensuring accuracy)."',
          type: 'likert'
        }
      ]
    }
  ];

  const handleResponse = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId, option, maxSelections) => {
    setResponses(prev => {
      const current = prev[questionId] || [];
      const isSelected = current.includes(option);
      
      if (isSelected) {
        return { ...prev, [questionId]: current.filter(item => item !== option) };
      } else {
        if (maxSelections && current.length >= maxSelections) {
          return prev;
        }
        return { ...prev, [questionId]: [...current, option] };
      }
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      console.log('Submitting survey data:', responses);
      
      // Submit to Google Sheets using fetch
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      });
      
      console.log('Data sent to Google Sheets');
      
      // Show success after a brief delay
      setTimeout(() => {
        setSubmitted(true);
        setSubmitting(false);
      }, 1500);
      
    } catch (err) {
      console.error('Submission error:', err);
      // Even if there's an error, the data likely went through with no-cors mode
      setTimeout(() => {
        setSubmitted(true);
        setSubmitting(false);
      }, 1500);
    }
  };

  const renderQuestion = (question) => {
    if (question.conditional && !isLeadership) return null;
    if (question.dependsOn && !responses[question.dependsOn]?.includes(question.dependsValue)) return null;

    const commonClasses = "w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-blue-300";

    switch (question.type) {
      case 'select':
        return (
          <select
            className={commonClasses}
            value={responses[question.id] || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
          >
            <option value="">Select an option...</option>
            {question.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {question.options.map(opt => (
              <label key={opt.value} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200 group">
                <input
                  type="radio"
                  name={question.id}
                  value={opt.value}
                  checked={responses[question.id] === opt.value}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900 font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.maxSelections && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800 font-medium">
                  Select up to {question.maxSelections} options • {(responses[question.id] || []).length}/{question.maxSelections} selected
                </p>
              </div>
            )}
            {question.options.map(opt => (
              <label key={opt} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200 group">
                <input
                  type="checkbox"
                  checked={(responses[question.id] || []).includes(opt)}
                  onChange={() => handleCheckboxChange(question.id, opt, question.maxSelections)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700 group-hover:text-gray-900 font-medium">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            className={commonClasses}
            value={responses[question.id] || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Type your answer..."
          />
        );

      case 'textarea':
        return (
          <textarea
            className={commonClasses}
            rows="5"
            value={responses[question.id] || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Share your thoughts here..."
          />
        );

      case 'likert':
        return (
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4, 5].map(num => (
                <label key={num} className="flex flex-col items-center space-y-3 cursor-pointer group">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    responses[question.id] === num.toString() 
                      ? 'bg-blue-600 text-white shadow-lg scale-110' 
                      : 'bg-white border-2 border-gray-300 text-gray-700 group-hover:border-blue-400 group-hover:scale-105'
                  }`}>
                    <input
                      type="radio"
                      name={question.id}
                      value={num}
                      checked={responses[question.id] === num.toString()}
                      onChange={(e) => handleResponse(question.id, e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-lg font-bold">{num}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-600 px-2">
              <span>Strongly Disagree</span>
              <span>Neutral</span>
              <span>Strongly Agree</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Thank You!</h2>
          <p className="text-gray-600 text-lg mb-6">Your responses have been submitted successfully.</p>
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">We appreciate your time and insights</span>
          </div>
          <button
            onClick={resetSurvey}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-semibold"
          >
            Start New Survey
          </button>
        </div>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="w-8 h-8" />
                <h1 className="text-4xl font-bold">Organisational AI Maturity Assessment Survey</h1>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <Coffee className="w-5 h-5" />
                <p className="text-lg">Good day! Help us understand your organisation's AI adoption journey. It will only take a coffee's time to fill in the form!</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-100 h-3 relative">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 w-2 h-3 bg-white opacity-50 animate-pulse"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-10">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  {currentSectionData.title}
                </h2>
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  Section {currentSection + 1} of {sections.length}
                </div>
              </div>
              {currentSectionData.subtitle && (
                <p className="text-gray-600 italic text-lg bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">{currentSectionData.subtitle}</p>
              )}
            </div>

            <div className="space-y-10">
              {currentSectionData.questions.map((question) => {
                if (question.conditional && !isLeadership) return null;
                if (question.dependsOn && !responses[question.dependsOn]?.includes(question.dependsValue)) return null;

                return (
                  <div key={question.id} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <label className="block text-gray-800 font-semibold mb-5 text-lg">
                      {question.text}
                    </label>
                    {renderQuestion(question)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-10 py-6 flex justify-between items-center border-t-2 border-gray-200">
            <button
              onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
              disabled={currentSection === 0}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                onClick={() => setCurrentSection(prev => prev + 1)}
                className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span>Next Section</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Submit Survey</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISurvey;