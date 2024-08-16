import "./Home.css";
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <body>
      <div class="text-container">
        <div class="center-content">
          <h1>chris cao</h1>
          <p>
            student at university of toronto.&nbsp;
            <Link to="/about">more about me</Link>
          </p>
          <h2>Projects</h2>
          <p>nothing yet lol</p>
        </div>
      </div>
    </body>
  );
}

export default Home;
