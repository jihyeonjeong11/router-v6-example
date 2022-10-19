import React from 'react';
import { useRouteError } from "react-router-dom";

interface ErrorProps {
    statusText: string;
    message: string;
}

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const caught = error as ErrorProps;

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{caught.statusText || caught.message}</i>
      </p>
    </div>
  );
}