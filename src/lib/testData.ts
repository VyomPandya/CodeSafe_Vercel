/**
 * This file contains test data to demonstrate the code analysis functionality.
 * It provides sample vulnerable code for JavaScript, Python, and Java.
 */

export const generateTestJavaScript = () => {
  return `// This is a test JavaScript file with vulnerabilities

function unsafeCode() {
  const userInput = document.getElementById('user-input').value;
  
  // HIGH severity: Using eval on user input is dangerous
  eval(userInput);
  
  // HIGH severity: Using dangerouslySetInnerHTML
  const element = <div dangerouslySetInnerHTML={{ __html: userInput }} />;
  
  // MEDIUM severity: Using innerHTML
  document.getElementById('output').innerHTML = userInput;
  
  // MEDIUM severity: Hardcoded password
  const password = "superSecretPassword123";
  
  // LOW severity: Console statements
  console.log("Debug info:", userInput);
  
  // LOW severity: TODO comment
  // TODO: Implement proper validation
}
`;
}

export const generateTestPython = () => {
  return `# This is a test Python file with vulnerabilities

import pickle
import subprocess

def unsafe_code():
    # HIGH severity: Using exec
    user_input = input("Enter some code: ")
    exec(user_input)
    
    # HIGH severity: Unsafe pickle deserialization
    data = pickle.loads(user_input.encode())
    
    # MEDIUM severity: Unsanitized input
    name = input("Enter your name: ")
    print("Hello, " + name)
    
    # MEDIUM severity: Using shell=True
    cmd = "echo " + name
    subprocess.call(cmd, shell=True)
`;
}

export const generateTestJava = () => {
  return `// This is a test Java file with vulnerabilities

import java.io.IOException;

public class UnsafeCode {
    
    public void executeCommand(String userInput) throws IOException {
        // HIGH severity: Using Runtime.exec with user input
        Runtime.getRuntime().exec("cmd.exe /c " + userInput);
    }
    
    public void handleException() {
        try {
            // Some code that might throw exception
            throw new RuntimeException("Test exception");
        } catch (Exception e) {
            // MEDIUM severity: Printing stack trace
            e.printStackTrace();
        }
    }
    
    public void printInfo(String message) {
        // LOW severity: Using System.out.println
        System.out.println(message);
    }
    
    public void checkObject(Object obj) {
        // LOW severity: Null checks without Optional
        if (obj == null) {
            return;
        }
        
        if (obj != null) {
            System.out.println(obj.toString());
        }
    }
}
`;
}

export const generateTestFile = (fileType: string): File => {
  let content = '';
  let fileName = '';
  
  switch (fileType) {
    case 'js':
      content = generateTestJavaScript();
      fileName = 'test-vulnerable.js';
      break;
    case 'py':
      content = generateTestPython();
      fileName = 'test-vulnerable.py';
      break;
    case 'java':
      content = generateTestJava();
      fileName = 'test-vulnerable.java';
      break;
    default:
      content = generateTestJavaScript();
      fileName = 'test-vulnerable.js';
  }
  
  const blob = new Blob([content], { type: 'text/plain' });
  return new File([blob], fileName, { type: 'text/plain' });
}; 