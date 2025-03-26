import React, { useEffect, useState } from 'react';
import { Auth } from './components/Auth';
import { FileUpload } from './components/FileUpload';
import { AnalysisResult, VulnerabilityResult } from './components/AnalysisResult';
import { HistoryView } from './components/HistoryView';
import { SeverityFilter } from './components/SeverityFilter';
import { CodeEnhancement } from './components/CodeEnhancement';
import { analyzeCode } from './lib/analyzer';
import { supabase, getSupabaseClient } from './lib/supabase';
import { LogOut, AlertTriangle, History, Upload, Bug, Cpu } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { generateTestFile } from './lib/testData';

interface HistoryEntry {
  id: string;
  file_name: string;
  results: VulnerabilityResult[];
  created_at: string;
}

// TestMode component for development and debugging
// This component provides buttons for testing different code types (JavaScript, Python, Java)
function TestMode({ onTest }: { onTest: (type: string) => void }) {
  return (
    // Container with margin and styling for visual distinction
    <div className="mt-4 p-3 border border-orange-300 bg-orange-50 rounded-md">
      {/* Header with a bug icon and title "Test Mode" */}
      <h3 className="text-sm font-medium text-orange-800 flex items-center">
        <Bug className="h-4 w-4 mr-1" /> {/* Icon representing "Bug" for debugging context */}
        Test Mode
      </h3>
      {/* Description paragraph explaining the purpose of the buttons */}
      <p className="text-xs text-orange-700 mb-2">
        Use these buttons to quickly test different code types:
      </p>
      {/* Container for the buttons with spacing between them */}
      <div className="flex space-x-2">
        {/* Button to test JavaScript code */}
        <button
          onClick={() => onTest('js')} // Calls the onTest function with 'js' argument when clicked
          className="px-2 py-1 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Test JavaScript
        </button>
        {/* Button to test Python code */}
        <button
          onClick={() => onTest('py')} // Calls the onTest function with 'py' argument when clicked
          className="px-2 py-1 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Test Python
        </button>
        {/* Button to test Java code */}
        <button
          onClick={() => onTest('java')} // Calls the onTest function with 'java' argument when clicked
          className="px-2 py-1 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Test Java
        </button>
      </div>
    </div>
  );
}

// Model selector component for choosing between different AI models
function ModelSelector({ selectedModel, onChange }: { 
  selectedModel: string; 
  onChange: (model: string) => void 
}) {
  return (
    <div className="mt-4 p-3 border border-indigo-300 bg-indigo-50 rounded-md">
      <h3 className="text-sm font-medium text-indigo-800 flex items-center">
        <Cpu className="h-4 w-4 mr-1" />
        AI Model Selection
      </h3>
      <p className="text-xs text-indigo-700 mb-2">
        Choose which AI model to use for code analysis:
      </p>
      <select
        value={selectedModel}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full mt-1 px-3 py-2 text-sm border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="mistralai/mistral-7b-instruct-v0.2:free">Mistral 7B V0.2 (Free)</option>
        <option value="google/gemini-pro-1.5">Google Gemini Pro 1.5 (Free)</option>
      </select>
    </div>
  );
}

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState<string | null>(null);
  const [results, setResults] = useState<VulnerabilityResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [isDevMode, setIsDevMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('mistralai/mistral-7b-instruct-v0.2:free');

  useEffect(() => {
    const { data: { subscription } } = supabase ? supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed', event, session);
      setSession(session);
    }) : { data: { subscription: null } };

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        if (!supabase) throw new Error("Supabase client not initialized");
        
        const { data } = await supabase.auth.getSession();
        console.log('Initial session:', data.session);
        setSession(data.session);
      } catch (error) {
        console.error("Failed to get initial session:", error);
        setError(error instanceof Error ? error.message : "Failed to initialize authentication");
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadHistory();
    }
  }, [session]);

  const loadHistory = async () => {
    if (!session?.user) return;
    
    try {
      const client = getSupabaseClient();
      const { data, error } = await client
        .from('analysis_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Error loading history:', err);
      setError("Failed to load analysis history. Please check your connection and try again.");
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setAnalyzing(true);
      setError(null);
      setCurrentFile(file.name);
      
      // Read the file content once
      const content = await file.text();
      setCurrentCode(content);
      
      // Create a new file object to pass to analyzer (not ideal but works)
      const fileBlob = new Blob([content], { type: file.type });
      const fileObject = new File([fileBlob], file.name, { type: file.type });
      
      // Pass the selected model to the analyzeCode function
      const analysisResults = await analyzeCode(fileObject, selectedModel);
      setResults(analysisResults);

      if (session?.user) {
        try {
          const client = getSupabaseClient();
          const { error: dbError } = await client
            .from('analysis_history')
            .insert([
              {
                user_id: session.user.id,
                file_name: file.name,
                results: analysisResults,
                created_at: new Date().toISOString(),
              },
            ]);

          if (dbError) throw dbError;
          await loadHistory();
        } catch (dbErr) {
          console.error("Failed to save analysis history:", dbErr);
          // Continue with the analysis even if saving to history fails
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const client = getSupabaseClient();
      await client.auth.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
      setError("Sign out failed. Please try again.");
    }
  };

  const handleSeverityChange = (severity: string) => {
    setSelectedSeverities(prev =>
      prev.includes(severity)
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  const filteredResults = selectedSeverities.length > 0
    ? results.filter(result => selectedSeverities.includes(result.severity))
    : results;

  // Skip auth in dev mode using shortcut keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Alt+D to toggle dev mode
      if (e.ctrlKey && e.altKey && e.key === 'd') {
        setIsDevMode(prev => !prev);
        console.log('Dev mode toggled:', !isDevMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDevMode]);

  const handleTestFile = async (fileType: string) => {
    const testFile = generateTestFile(fileType);
    await handleFileUpload(testFile);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!session && !isDevMode) {
    return (
      <>
        <Auth />
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-2 right-2 text-xs text-gray-500">
            Press Ctrl+Alt+D to enter dev mode
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">Code Analyzer</h1>
              {isDevMode && (
                <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                  Dev Mode
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
              >
                {showHistory ? (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Analyze Code
                  </>
                ) : (
                  <>
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </>
                )}
              </button>
              {!isDevMode && (
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              )}
              {isDevMode && (
                <button
                  onClick={() => setIsDevMode(false)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200"
                >
                  Exit Dev Mode
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {showHistory ? (
            <HistoryView
              history={history}
              onSelectEntry={(entry) => {
                setCurrentFile(entry.file_name);
                setResults(entry.results);
                setShowHistory(false);
              }}
            />
          ) : (
            <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Upload Code for Analysis
              </h2>
              
              {/* Add the model selector component */}
              <ModelSelector 
                selectedModel={selectedModel} 
                onChange={setSelectedModel} 
              />
              
              {/* Direct file upload component */}
              <div className="mt-4">
                <FileUpload onFileUpload={handleFileUpload} />
              </div>

              {isDevMode && (
                <TestMode onTest={handleTestFile} />
              )}

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}

              {analyzing && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  <span className="ml-2 text-gray-600">Analyzing code with {!import.meta.env.VITE_OPENROUTER_API_KEY ? 'local analyzer' : 'AI model'}...</span>
                </div>
              )}

              {currentFile && results.length > 0 && (
                <>
                  <div className="mt-6">
                    <SeverityFilter
                      selectedSeverities={selectedSeverities}
                      onSeverityChange={handleSeverityChange}
                    />
                  </div>
                  <AnalysisResult results={filteredResults} fileName={currentFile} />
                  {currentCode && (
                    <CodeEnhancement fileName={currentFile} originalCode={currentCode} />
                  )}
                </>
              )}
              
              {currentFile && results.length === 0 && !analyzing && !error && (
                <>
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      No vulnerabilities found in the code! The analysis shows your code is secure.
                    </p>
                  </div>
                  {currentCode && (
                    <CodeEnhancement fileName={currentFile} originalCode={currentCode} />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;