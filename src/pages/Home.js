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
          <ul>
            <li>
              Mood-o-matic: a simple mood tracker with interactive graphs and
              changing emojis. made with react and flask. find it{" "}
              <Link to="https://github.com/utcjcao/mood-o-matic">here</Link>
            </li>
            <li>
              Google Docs clone: its a google docs clone that really sucks.
              built with socket.io and express. find it{" "}
              <Link to="https://github.com/utcjcao/google-docs-clone">
                here
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </body>
  );
}

export default Home;
