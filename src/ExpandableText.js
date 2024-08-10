import React, { useState } from 'react';

function ExpandableText() {
  // State to manage the expanded/collapsed state
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the state
  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="expandable-text">
      <p onClick={handleClick} className="toggle-button">
        {isExpanded ? 'Show Less' : 'Show More'}
      </p>
      <div className={`text-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <p>
          This is the text that will expand or collapse when you click the button above. 
          {isExpanded && " Here is some more content that becomes visible when expanded."}
        </p>
      </div>
    </div>
  );
}

export default ExpandableText;