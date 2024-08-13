import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ExpandableText from "./ExpandableText";
import Header from "./Header";
import reportWebVitals from "./reportWebVitals";
import Title from "./Title";
import Links from "./Links";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <head>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </head>
    <Title></Title>
    <Links></Links>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
