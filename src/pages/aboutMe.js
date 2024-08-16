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
            I like computer science, but I want to work in policy. Feel free to
            say hi :)
          </p>
          <h2>Contact</h2>
          <p>
            <ul>
              <li>
                <a href="https://drive.google.com/file/d/1KQDMIkZTwPAZiN7nAZkYEQ2BQ7xsspNS/view?usp=sharing">
                  CV
                </a>
              </li>
              <li>
                Email me at: chrisj [dot] cao [at] mail [dot] utoronto [dot] ca
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
