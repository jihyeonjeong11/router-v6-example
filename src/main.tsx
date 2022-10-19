import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";

import Root, {loader as rootLoader} from './routes/root';
import ErrorPage from './error-page';
import Contact from "./routes/contact";

// 5. 중첩 네스팅 이전
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//     errorElement:<ErrorPage />
//   },
//   {
//     path: "contacts/:contactId",
//     element: <Contact />,
//   }
// ]);

// 5. 이후

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);