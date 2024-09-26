import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './HomePage.css'; // Import the CSS file for styles

const HomePage = () => {
  const [inputType, setInputType] = useState('');
  const [imageFile, setImageFile] = useState(null); // Image state
  const [docFile, setDocFile] = useState(null); // Document state
  const [text, setText] = useState(''); // Text state
  const [numberOfQuestions, setNumberOfQuestions] = useState(5); // Default value
  const [difficulty, setDifficulty] = useState('easy'); // Default value
  const [showSecondForm, setShowSecondForm] = useState(false); // To control visibility of the second form
  const [loading, setLoading] = useState(false); // New state to track loading

  const navigate = useNavigate(); // Use navigate for routing

  // Handle file and text input changes
  const handleInputChange = (e) => {
    if (inputType === 'image') {
      setImageFile(e.target.files[0]); // Image handling
    } else if (inputType === 'document') {
      setDocFile(e.target.files[0]); // Document handling
    } else {
      setText(e.target.value); // Text handling
    }
  };

  const handleInputTypeChange = (type) => {
    setInputType(type);
    setShowSecondForm(true); // Show the second form when input type is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting

    try {
      // Handle image upload
      if (inputType === 'image' && imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('number_of_questions', numberOfQuestions); // Include number of questions
        formData.append('difficulty', difficulty); // Include difficulty

        const response = await fetch('http://localhost:5000/generate-questions', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(data.message); // Log the message
        setLoading(false);
        navigate('/quiz');
      }

      // Handle text input
      else if (inputType === 'text' && text) {
        const payload = {
          prompt: text,
          number_of_questions: numberOfQuestions,
          difficulty: difficulty,
        };

        const response = await fetch('http://localhost:5000/generate-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log(data.message); // Log the message
        setLoading(false);
        navigate('/quiz');
      }

      // Handle document upload
      else if (inputType === 'document' && docFile) {
        const formData = new FormData();
        formData.append('document', docFile);
        formData.append('number_of_questions', numberOfQuestions); // Include number of questions
        formData.append('difficulty', difficulty); // Include difficulty

        const response = await fetch('http://localhost:5000/generate-questions', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(data.message); // Log the message
        setLoading(false);
        navigate('/quiz');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat custom-background">
      <h1 className="text-4xl font-bold mb-6 text-white">Smart Quiz Application</h1>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <h2 className="loading-text">Generating Quiz... Please wait</h2>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96 opacity-90">
          <h2 className="text-2xl mb-4">Please select an input type:</h2>
          <div className="flex flex-col mb-4">
            <label className="flex items-center cursor-pointer mb-2">
              <input
                type="radio"
                value="image"
                checked={inputType === 'image'}
                onChange={() => handleInputTypeChange('image')}
                className="hidden"
              />
              <div
                className={`flex items-center justify-center w-full p-3 border rounded-md ${
                  inputType === 'image' ? 'bg-blue-600 text-white' : 'border-gray-300'
                }`}
              >
                Upload Images
              </div>
            </label>
            <label className="flex items-center cursor-pointer mb-2">
              <input
                type="radio"
                value="document"
                checked={inputType === 'document'}
                onChange={() => handleInputTypeChange('document')}
                className="hidden"
              />
              <div
                className={`flex items-center justify-center w-full p-3 border rounded-md ${
                  inputType === 'document' ? 'bg-blue-600 text-white' : 'border-gray-300'
                }`}
              >
                Upload PDF/Document
              </div>
            </label>
            <label className="flex items-center cursor-pointer mb-2">
              <input
                type="radio"
                value="text"
                checked={inputType === 'text'}
                onChange={() => handleInputTypeChange('text')}
                className="hidden"
              />
              <div
                className={`flex items-center justify-center w-full p-3 border rounded-md ${
                  inputType === 'text' ? 'bg-blue-600 text-white' : 'border-gray-300'
                }`}
              >
                Enter Text Content
              </div>
            </label>
          </div>

          {inputType === 'image' && (
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 mb-4"
            />
          )}
          {inputType === 'document' && (
            <input
              type="file"
              accept=".pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 mb-4"
            />
          )}
          {inputType === 'text' && (
            <textarea
              value={text}
              onChange={handleInputChange}
              placeholder="Enter your text here..."
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
          )}

          {showSecondForm && (
            <div className="mb-4">
              <h3 className="text-xl mb-2">Specify Question Details:</h3>
              <div>
                <label className="block mb-2">Number of Questions:</label>
                <input
                  type="number"
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                  min="1"
                />
              </div>
              <div>
                <label className="block mb-2">Difficulty Level:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 mb-2 w-full"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md p-2 hover:bg-blue-500 transition duration-200"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default HomePage;
