import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";

import Root, {loader as rootLoader, action as rootAction} from './routes/root';
import ErrorPage from './error-page';
import Contact, {loader as contactLoader} from "./routes/contact";
import EditContact, {
  action as editAction
} from "./routes/edit";

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
    action: rootAction,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
        loader: contactLoader
      },
            {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      }, 
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);