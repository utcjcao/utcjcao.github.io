import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './Header';
import resume from "./resume"
import ExpandableText  from './ExpandableText';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header />
    <ExpandableText 
      title= "education"
      content={resume.education}
    />
    <ExpandableText 
      title= "experience"
      content={resume.experience_1 + <br></br> + resume.experience_2}
    /> 

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
