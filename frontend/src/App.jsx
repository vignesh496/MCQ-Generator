// App.jsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import QuizPage from './QuizPage';
import ResultsPage from './ResultsPage'; // Import the ResultsPage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
