import "./Links.css";
import React from "react";

function Links() {
  return (
    <div>
      <body>
        <div class="icon-container">
          <a
            href="mailto:chrisj.cao@mail.utoronto.ca"
            class="icon-link"
            title="Email"
          >
            <i class="fa fa-envelope icon"></i>
          </a>
          <a href="https://github.com/utcjcao" class="icon-link" title="GitHub">
            <i class="fa-brands fa-github icon"></i>
          </a>
          <a
            href="https://linkedin.com/in/cjao"
            class="icon-link"
            title="LinkedIn"
          >
            <i class="fa-brands fa-linkedin icon"></i>
          </a>
        </div>
      </body>
    </div>
  );
}

export default Links;
