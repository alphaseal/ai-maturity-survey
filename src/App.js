import React, { useState } from 'react';
import { ChevronRight, CheckCircle, Coffee, Sparkles, TrendingUp, Users, Target } from 'lucide-react';

const AISurvey = () => {
  const [started, setStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const resetSurvey = () => {
    setStarted(false);
    setCurrentSection(0);
    setResponses({});
    setSubmitted(false);
    setSubmitting(false);
    setValidationError('');
  };

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
    setValidationError(''); // Clear error when user starts answering
  };

  const handleCheckboxChange = (questionId, option, maxSelections) => {
    setValidationError(''); // Clear error when user starts answering
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

  const validateSection = () => {
    const currentQuestions = sections[currentSection].questions;
    const unansweredQuestions = currentQuestions.filter(question => {
      // Skip conditional questions that shouldn't be shown
      if (question.conditional && !isLeadership) return false;
      if (question.dependsOn && !responses[question.dependsOn]?.includes(question.dependsValue)) return false;
      
      // Check if question is answered
      const answer = responses[question.id];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        return true; // Question is unanswered
      }
      return false;
    });

    if (unansweredQuestions.length > 0) {
      setValidationError('Please answer all questions before proceeding to the next section.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateSection()) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentSection(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStart = () => {
    setStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    // Validate last section before submitting
    if (!validateSection()) {
      return;
    }

    setSubmitting(true);
    
    try {
      console.log('Submitting survey data:', responses);
      
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      });
      
      console.log('Data sent to Google Sheets');
      
      // Reduced delay from 1500ms to 500ms for faster feel
      setTimeout(() => {
        setSubmitted(true);
        setSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
      
    } catch (err) {
      console.error('Submission error:', err);
      // Reduced delay from 1500ms to 500ms
      setTimeout(() => {
        setSubmitted(true);
        setSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    }
  };

  const renderQuestion = (question) => {
    if (question.conditional && !isLeadership) return null;
    if (question.dependsOn && !responses[question.dependsOn]?.includes(question.dependsValue)) return null;

    // UPDATED: Added outline-none and verified border classes to ensure consistent "bracket" look
    const commonClasses = "w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:border-blue-400 outline-none";

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
              <label key={opt.value} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200 group bg-white shadow-sm">
                <input
                  type="radio"
                  name={question.id}
                  value={opt.value}
                  checked={responses[question.id] === opt.value}
                  onChange={(e) => handleResponse(question.id, e.target.value)}
                  className="w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-900 font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.maxSelections && (
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg mb-4 shadow-sm">
                <p className="text-sm text-gray-900 font-semibold">
                  Select up to {question.maxSelections} options • {(responses[question.id] || []).length}/{question.maxSelections} selected
                </p>
              </div>
            )}
            {question.options.map(opt => (
              <label key={opt} className="flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all duration-200 group bg-white shadow-sm">
                <input
                  type="checkbox"
                  checked={(responses[question.id] || []).includes(opt)}
                  onChange={() => handleCheckboxChange(question.id, opt, question.maxSelections)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-900 font-medium">{opt}</span>
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
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border-2 border-gray-300 shadow-md">
            <div className="flex justify-between items-center mb-6">
              {[1, 2, 3, 4, 5].map(num => (
                <label key={num} className="flex flex-col items-center space-y-3 cursor-pointer group">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                    responses[question.id] === num.toString() 
                      ? 'bg-blue-600 text-white shadow-xl scale-125 ring-4 ring-blue-200' 
                      : 'bg-white border-3 border-gray-400 text-gray-900 group-hover:border-blue-500 group-hover:scale-110 group-hover:shadow-lg'
                  }`}>
                    <input
                      type="radio"
                      name={question.id}
                      value={num}
                      checked={responses[question.id] === num.toString()}
                      onChange={(e) => handleResponse(question.id, e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-xl font-bold">{num}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-900 px-4">
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

  // Welcome Page
  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -ml-32 -mb-32"></div>
              <div className="relative z-10">
                <Sparkles className="w-16 h-16 mx-auto mb-6" />
                <h1 className="text-5xl font-bold mb-4">
                  Organisational AI Maturity Assessment Survey
                </h1>
                <div className="flex items-center justify-center space-x-2 text-xl">
                  <Coffee className="w-6 h-6" />
                  <p>It will only take a coffee's time to complete</p>
                </div>
              </div>
            </div>

            {/* Introduction Content */}
            <div className="p-12">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome!</h2>
                <p className="text-lg text-gray-900 leading-relaxed mb-6">
                  Thank you for participating in our AI Maturity Assessment. This survey is designed to help us understand your organisation's current AI adoption journey, identify opportunities for growth, and develop strategies to maximize AI's potential within your team.
                </p>
                <p className="text-lg text-gray-900 leading-relaxed">
                  Your honest feedback will help shape our AI transformation roadmap and ensure we're providing the right tools, training, and support for everyone.
                </p>
              </div>

              {/* Key Points */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 shadow-sm">
                  <TrendingUp className="w-10 h-10 text-blue-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">5 Sections</h3>
                  <p className="text-sm text-gray-800">Covering profile, tools, workflow, leadership, and governance</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-xl border-2 border-indigo-200 shadow-sm">
                  <Users className="w-10 h-10 text-indigo-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">19 Questions</h3>
                  <p className="text-sm text-gray-800">Quick and easy to complete, approximately 5-7 minutes</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200 shadow-sm">
                  <Target className="w-10 h-10 text-purple-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Confidential</h3>
                  <p className="text-sm text-gray-800">Your responses help us improve our AI strategy</p>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStart}
                className="w-full flex items-center justify-center space-x-3 px-10 py-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span>Start Survey</span>
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-lg text-gray-900 mb-8">Your responses have been submitted successfully.</p>
          <div className="flex items-center justify-center space-x-2 text-blue-600 mb-8">
            <Sparkles className="w-6 h-6" />
            <span className="font-semibold text-lg">We appreciate your time and insights</span>
          </div>
          <button
            onClick={resetSurvey}
            className="px-8 py-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
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
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Organisational AI Maturity Assessment Survey</h1>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-200 h-4 relative">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 transition-all duration-500 ease-out relative shadow-lg"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-0 w-2 h-4 bg-white opacity-50 animate-pulse"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-12">
            {/* Validation Error Message */}
            {validationError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-6 rounded-xl shadow-lg animate-pulse">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-lg font-bold text-red-900">{validationError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl font-bold text-gray-900">
                  {currentSectionData.title}
                </h2>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                  Section {currentSection + 1} of {sections.length}
                </div>
              </div>
              {currentSectionData.subtitle && (
                <p className="text-gray-900 italic text-xl bg-blue-50 p-6 rounded-xl border-l-4 border-blue-600 shadow-sm font-medium">{currentSectionData.subtitle}</p>
              )}
            </div>

            <div className="space-y-8">
              {currentSectionData.questions.map((question) => {
                if (question.conditional && !isLeadership) return null;
                if (question.dependsOn && !responses[question.dependsOn]?.includes(question.dependsValue)) return null;

                return (
                  <div key={question.id} className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border-2 border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <label className="block text-gray-900 font-bold mb-6 text-xl">
                      {question.text}
                    </label>
                    {renderQuestion(question)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-12 py-8 flex justify-between items-center border-t-2 border-gray-300">
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="flex items-center space-x-2 px-8 py-4 rounded-xl bg-white border-2 border-gray-400 text-gray-900 hover:bg-gray-50 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold shadow-md hover:shadow-lg"
            >
              <span>← Previous</span>
            </button>

            {currentSection < sections.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <span>Next Section</span>
                <ChevronRight className="w-6 h-6" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center space-x-2 px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
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