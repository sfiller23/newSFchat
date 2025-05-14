import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./_index.scss";
import App from "./App.tsx";
import { AppProvider } from "./context/appContext/AppProvider.tsx";
import store from "./redux/store.ts";
import Layout from "./UI/layout/Layout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppProvider>
          <Layout>
            <App />
          </Layout>
        </AppProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
