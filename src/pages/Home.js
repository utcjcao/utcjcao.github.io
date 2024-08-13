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
            student at university of toronto.
            <Link to="/about">more about me.</Link>
          </p>
          <h2>Projects</h2>
          <p>
            <ul>
              <li>
                <a href="path/to/your/cv.pdf" target="_blank">
                  CV
                </a>
              </li>
              <li>
                Email me at:
                <a href="mailto:chrisj.cao@mail.utoronto.ca">
                  chrisj [dot] cao [at] mail [dot] utoronto [dot] ca
                </a>
              </li>
              <li>
                <a href="https://github.com/utcjcao">Github</a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/cjao">Linkedin</a>
              </li>
            </ul>
          </p>
        </div>
      </div>
    </body>
  );
}

export default Home;
