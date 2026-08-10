import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/app.store";
import App from "../src/app/App.jsx"
import "./app/App.css"

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);

