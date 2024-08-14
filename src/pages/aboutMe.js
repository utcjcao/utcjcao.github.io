import "./aboutMe.css";
import React from "react";

function aboutMe() {
  return (
    <body>
      <a href="/">← chris cao</a>

      <div class="text-container">
        <div class="center-content">
          <h1>About Me</h1>
          <p>
            Hello! My name is Chris, I'm a student at the University of Toronto.
            Beyond work I read voraciously, build plenty of side projects and
            try to live a full life away from all things digital. Here's what
            I'm doing now
          </p>
          <h2>Contact</h2>
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

export default aboutMe;
