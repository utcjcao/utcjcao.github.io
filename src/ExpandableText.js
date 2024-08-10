import React, { useState } from 'react';
import './ExpandableText.css';

function ExpandableText({title, content}) {
  // State to manage the expanded/collapsed state
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the state
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="expandable-text">
      <div onClick={handleClick} className={`text-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <p>
          {title} <br></br>
          {isExpanded && content}
        </p>
      </div>
    </div>
  );
}

export default ExpandableText;