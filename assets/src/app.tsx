/* global FS */
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import "boxicons";
import conf from "conf";
import "phoenix_html";
// Put all CSS stylesheets here that are over ridden so it properly cascades event with code splitting
// import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "src/css/index.css";
import Router from "./Router";
import * as serviceWorker from "./serviceWorker";

React;

const IS_SENTRY_ACTIVE =
  conf.has("SENTRY_DNS") && conf.get("SENTRY_DNS") !== "";

if (process.env.NODE_ENV !== "production") {
  localStorage.debug = "app:*";
} else {
  // localStorage.debug = null; //Set to null to not print in prod
  localStorage.debug = "app:*";

  //check for existence because optional
  if (IS_SENTRY_ACTIVE) {
    console.log("Sentry stationed");
    Sentry.init({
      environment: process.env.NODE_ENV,
      dsn: conf.get("SENTRY_DNS"),
      // This enables automatic instrumentation (highly recommended), but is not
      // necessary for purely manual usage
      integrations: [
        new BrowserTracing({
          // routingInstrumentation: Sentry.reactRouterV6Instrumentation(history),
          tracingOrigins: [
            "localhost",
            "eta-staging.onrender.com",
            "app.clayboard.com",
            /^\//,
          ],
          // ... other options
        }),
      ],

      // To set a uniform sample rate
      tracesSampleRate: 0.2,
    });
    // setFSSession();
    // setLGSession();
  }
}

const element = document.getElementById(conf.get("HTML_ROOT_ID"));
if (element) {
  const root = createRoot(element);
  root.render(<Router />);
} else {
  console.error("Failed to find element");
  Sentry.captureMessage("Failed to find root element, page failed to load");
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
