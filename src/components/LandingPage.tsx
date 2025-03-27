import React from 'react';
import { Shield, Code, Lock, AlertTriangle, Server, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Secure Your Code with AI-Powered Vulnerability Detection
              </h1>
              <p className="text-xl mb-8">
                CodeSafe finds and fixes security vulnerabilities in your code before they become threats.
              </p>
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50 transition duration-300"
              >
                Let's Get Started
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-indigo-500 bg-opacity-20 rounded-full absolute top-0 left-0 animate-pulse"></div>
                <div className="w-80 h-80 bg-purple-500 bg-opacity-20 rounded-full absolute top-10 left-10"></div>
                <div className="relative z-10">
                  <Shield className="w-32 h-32 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
              <AlertTriangle className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Vulnerability Detection</h3>
            <p className="text-gray-600">
              Identify security vulnerabilities including SQL injections, XSS attacks, and more.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
              <Code className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Language Support</h3>
            <p className="text-gray-600">
              Support for JavaScript, Python, Java, and continuous expansion to more languages.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Fixes</h3>
            <p className="text-gray-600">
              Get smart suggestions to fix identified vulnerabilities and improve your code quality.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full mr-3">
                  1
                </div>
                <h3 className="text-xl font-semibold">Upload Your Code</h3>
              </div>
              <p className="text-gray-600">
                Upload your code files or snippets through our simple interface.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full mr-3">
                  2
                </div>
                <h3 className="text-xl font-semibold">AI Analysis</h3>
              </div>
              <p className="text-gray-600">
                Our AI engine scans your code for vulnerabilities and security issues.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-full mr-3">
                  3
                </div>
                <h3 className="text-xl font-semibold">Get Results & Fixes</h3>
              </div>
              <p className="text-gray-600">
                Receive a detailed report with severity ratings and recommended fixes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Start Securing Your Code Today</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of developers who use CodeSafe to identify and fix security vulnerabilities before they become problems.
          </p>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-50 transition duration-300"
          >
            Let's Get Started
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">CodeSafe</h3>
              <p className="text-gray-400">Secure code, peace of mind</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CodeSafe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 