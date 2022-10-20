https://reactrouter.com/en/main/start/tutorial


라우터 

소요 예상시간 30-60 분

![img](https://reactrouter.com/_docs/tutorial/15.webp)

**👉 가 있을 때마다 코드를 작성한다는 뜻입니다.**

나머지 글은 그냥 읽어만 봐도 괜찮습니다.


# 1. SETUP

다른 방법으로 앱을 init 해도 괜찮습니다.,

여기서는 react-vite를 사용해서, dev server를 구성하도록 합니다.

npm이나 yarn을 사용해서 세팅합니다.

```
// react + typescript로 변경

yarn create vite@latest {프로젝트이름 여기서는 'router-example'} -- --template react-ts
# follow prompts
cd <your new project directory>
yarn add react-router-dom localforage match-sorter sort-by
yarn dev

```

CSS 는 튜토리얼 페이지 내부에서 제공합니다.

https://gist.githubusercontent.com/ryanflorence/ba20d473ef59e1965543fa013ae4163f/raw/499707f25a5690d490c7b3d54c65c65eb895930c/react-router-6.4-tutorial-css.css

안의 내용을

/src/index.css 내용을 덮어씌워 줍니다.

이 튜토리얼에서는 api를 모사하기 위해서 브라우저의 스토리지를 사용할 것입니다.

또한, react router 사용과는 무관하기 떄문에, 그냥 복사 붛여넣기 해도 괜찮습니다.

그리고 템플릿으로 생성된 필요없는 파일은 제거 해 줍니다.

```
src
├── contacts.js
├── index.css
└── main.jsx
```

튜토리얼의 src 트리


```
src
├── src/App.tsx
├── src/contact.tsx
├── src/index.css
├── src/main.tsx
└── src/vite-env.d.ts
```

현재 프로젝트상의 src 트리

App.tsx는 차후 보면서 제거해 주도록 합니다.

vite-env.d.ts.는 지우지 않아도 괜찮습니다.

# 1. Router 추가하기

가장 먼저 할 일은 Browser Router를 추가하는 것입니다.

'main.tsx' 파일에 추가해 줍니다.

👉 main.tsx에 browserRouter 추가하기

```
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

# 3. Root 라우트 추가

글로벌 레이아웃을 추가합니다.

👉 /src/routes 추가. src/routes/root.tsx 추가합니다.

```
mkdir src/routes
sudo touch src/routes/root.tsx
```

👉 root.tsx에 코드를 추가합니다.

```
export default function Root() {
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </form>
          <form method="post">
            <button type="submit">New</button>
          </form>
        </div>
        <nav>
          <ul>
            <li>
              <a href={`contacts/1`}>Your Name</a>
            </li>
            <li>
              <a href={`contacts/2`}>Your Friend</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail"></div>
    </>
  );
}
```

여기까지는 특별할 것이 없으므로, 복사 붙여넣기 해도 문제 엇습니다.

👉 위 Root를 main.tsx의 element로 추가해 줍니다.

여기까지 진행 되었다면, 이런 형태의 페이지가 될 것입니다.

![img](https://reactrouter.com/_docs/tutorial/01.webp)


# 4. error 핸들링

404 에러를 먼저 잡습니다.

![img](https://reactrouter.com/_docs/tutorial/02.webp)

위 사이드바 메뉴를 클릭하면 404 에러 화면이 나타납니다.

이 부분의 스타일을 먼저 잡습니다.

👉 에러페이지 컴포넌트 작성

```
sudo touch src/error-page.tsx
```
```
// src/error-page.tsx

import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
```
```
// src/main.tsx
/* previous imports */
import ErrorPage from "./error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```


![img](https://reactrouter.com/_docs/tutorial/03.webp)

route 를 이동할 때 에러가 발생한다면 이 페이지로 이동한다는 것을 기억합시다.

지금으로써는, 이 에러 스크린이 로딩이나, 크래쉬같은 것들을 대체할 것입니다.

# 5. Contact 라우트 UI 작성

이제 새로운 route를 만들어 보도록 합니다.

👉 src/routes/contact.tsx를 작성합니다.

```
//src/routes/contact.tsx

import { Form } from "react-router-dom";

export default function Contact() {
  const contact = {
    first: "Your",
    last: "Name",
    avatar: "https://placekitten.com/g/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  };

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={contact.avatar || null}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
      >
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
}
```

👉 main.tsx를 수정해 위 contact를 등록합니다.

```
//src/main.tsx

/* existing imports */
import Contact from "./routes/contact";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "contacts/:contactId",
    element: <Contact />,
  },
]);

/* existing code */
```

![img](https://reactrouter.com/_docs/tutorial/04.webp)

이제 사이드바의 메뉴를 클릭한다면 위와 같은 contact 컴포넌트가 표시됩니다.


# 5. 중첩 라우팅(nested routing)

![img](https://reactrouter.com/_docs/tutorial/05.webp)

이제 contact 라우트가 완성되었으니 root 컴포넌트에 합칠 수 있습니다.

```
// src/main.tsx

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
    ],
  },
]);
```

```
// src/routes/root.tsx

import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      {/* all the other elements */}
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
```


# 6. 클라이언트 사이드 렌더링

현재 root.tsx에서는 a 태그로 페이지를 이동합니다.

이것을 서버의 요청이 필요 없도록 만들기 위해 a 태그를 Link로 바꾸어 줍니다.

👉 a href 를 Link to 로 바꾸기

```
// src/routes/root.tsx

import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div id="sidebar">
        {/* other elements */}

        <nav>
          <ul>
            <li>
              <Link to={`contacts/1`}>Your Name</Link>
            </li>
            <li>
              <Link to={`contacts/2`}>Your Friend</Link>
            </li>
          </ul>
        </nav>

        {/* other elements */}
      </div>
    </>
  );
}
```


개발자 도구의 network에서 이동 시 요청을 하지 않는 것을 알 수 있습니다.


# 7. 데이터 로딩

URL 세그먼트는 일반적으로 이런 형태로 완성이 됩니다.

| URL          | Comp    | Data           |   |   |
|--------------|---------|----------------|---|---|
| /            | Root    | contact list   |   |   |
| contacts/:id | Contact | single contact |   |   |
|              |         |                |   |   |

이러한 규칙을 따라 React Router에서도 데이터 컨벤션을 맞춰 데이터 패칭을 할 수 있습니다.

여기서는 'loader'와 'useLoaderData' 두 가지 api를 사용해 데이터를 가져오도록 합니다.

👉 root.tsx에 loader를 추가

```
import { Outlet, Link } from "react-router-dom";
import { getContacts } from "../contacts";

export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}
```

👉 main.tsx에 로더 적용하기

```
src/main.tsx

/* other imports */
import Root, { loader as rootLoader } from "./routes/root";

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
```

👉 loader 데이터 실제로 render하기

```
// src/routes/root.tsx

import {
  Outlet,
  Link,
  useLoaderData,
} from "react-router-dom";
import { getContacts } from "../contacts";

/* other code */

export default function Root() {
  const { contacts } = useLoaderData();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        {/* other code */}

        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>

        {/* other code */}
      </div>
    </>
  );
}
```

위 function은 로컬 스토리지에서 데이터를 찾는 것이므로 아직 데이터가 없어서 아래 사진과 같은 결과가 보일 것입니다.

![img](https://reactrouter.com/_docs/tutorial/06.webp)


# 8. 데이터 작성 + forms

이제 빈 데이터를 채우는 작업을 진행합니다.

그 전에 HTML에 잠깐만 언급합니다.

React Router는 HTML의 form 의 navigation을 에뮬레이트하는 것을 원칙으로 합니다. 리액트 이전에 쓰던 것들입니다.

이러한 오래된 모델을 단순하게 구현하는 것이 목표입니다.

익숙하지 않을 수도 있지만, html의 form은 실제로 내비게이션을 기본 동작으로 가지고 있습니다. link를 클릭하는 것과 같습니다.

차이는 link는 그저 url을 바꾸는 역할만을 할 뿐이지만, form에서는 실제 request를 보내고, 이에 대한 응답으로 url을 변경하는 것입니다.

전통적으로 브라우저에서는 form에 입력된 데이터를 시리얼라이즈 한 뒤 서버에 post 형태로 전송합니다. get 일때는 urlSearchParam의 형태가 됩니다.
리액트 라우터도 마찬가지로 동작합니다. 다른 점은, react router에서는 클라이언트 사이드 라우팅과 함꼐 이것을 라우트의 'action'에 결과를 전송한다는 것입니다.

이것을 현재 앱의 new 버튼을 눌러서 확인할 수 있습니다. new 버튼을 누르면 아래와 같은 결과가 나타납니다.

![img](https://reactrouter.com/_docs/tutorial/07.webp)

vite 서버가 post 요청을 받아들이지 못하기 떄문입니다. 따라서 직접 서버 요청을 하는 것이 아니라 클라이언트 사이드 렌더링으로 구현합니다.

# 9. Contacts 생성

root 라우트에 action 생성 및 form 을 Form으로 변경,
route 선언에 등록,


👉 Create the action and change <form> to <Form>



```
// src/routes/root.tsx

import {
  Outlet,
  Link,
  useLoaderData,
  Form,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";

export async function action() {
  await createContact();
}

/* other code */

export default function Root() {
  const { contacts } = useLoaderData();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          {/* other code */}
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>

        {/* other code */}
      </div>
    </>
  );
}
```

👉 Import and set the action on the route



```
// src/main.tsx

/* other imports */

import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";

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
      },
    ],
  },
]);

```

이런식으로, form 의 submit action을 위의 createContacts()를 호출하도록 합니다.

![img](https://reactrouter.com/_docs/tutorial/08.webp)

이제 new 버튼을 누르면 no name이라는 contact 로우가  생성되는 것을 확인할 수 있습니다.

주목해야 할 것은 React Router Form 태그가 submit 이 일어날 때 

일반적으로 서버에 요청을 보내는 것 대신 방금 정의한 action의 코드를 실행한 다는 것입니다.

웹 표준에서 POST 액션은 어떠한 데이터가 변경되는 것을 의미합니다. 이것을 React Router에서는 변경되는 데이터를 userLoaderData 훅으로 자동적으로 싱크하게 됩니다.

# 10. Loader에서 Url params 사용하기

이제 아무런 데이터가 없는 row를 만들 수 있게 되었으므로, params을 넣어서 데이터 자체를 넣는 것을 할 수 있게 되었습니다.

현재 생성된 no nmae 을 클릭하면 데이터가 없으므로 default로 설정된 데이터가 출력됩니다.

![img](https://reactrouter.com/_docs/tutorial/09.webp)

현재 contact 상세는 코드는 이렇습니다.

```
[
  {
    path: "contacts/:contactId",
    element: <Contact />,
  },
];
```

':contactId' 세그먼트에서 :는 dynamic 세그먼트라고 부릅니다.

실제로는 contacts/wjdwlgus11 의 다이나믹한 param을 받는다는 의미이며 이것을 URL params, 혹은 params라고 부릅니다.

이것은 loader에서 핸들링할 수 있으며, params.contactId의 형태로 조회할 수 있습니다.

👉 contact 페이지의 loader에 데이터를 조회하는 로직응ㄹ 추가합니다.

```
// src/routes/contact.jsx

import { Form, useLoaderData } from "react-router-dom";
import { getContact } from "../contacts";

export async function loader({ params }) {
  return getContact(params.contactId);
}

export default function Contact() {
  const contact = useLoaderData();
  // existing code
}

```

👉 route root에 loader룰 추가합니다.

```
// src/main.tsx

/* existing code */
import Contact, {
  loader as contactLoader,
} from "./routes/contact";

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
        loader: contactLoader,
      },
    ],
  },
]);

/* existing code */

```

# 10. 데이터 업데이트

Form으로 데이터의 업데이트 역시 가능합니다.

여기서는 contacts/:contactId/edit 로 데이터 업데이트를 쳐리하도록 합니다.

👉 edit 컴포넌트 생성

```
sudo touch src/routes/edit.tsx
```

👉 edit page 작성

```

// src/routes/edit.tsx

import { Form, useLoaderData } from "react-router-dom";

export default function EditContact() {
  const contact = useLoaderData();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </p>
    </Form>
  );
}
```

👉 edit 라우트 추가

```

// src/main.tsx

/* existing code */
import EditContact from "./routes/edit";

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
        loader: contactLoader,
      },
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
      },
    ],
  },
]);

/* existing code */

```

url 세그먼트는 다음과 같습니다.

```
http://localhost:5173/contacts/1sspcao/edit
```

그리고 contactLoader를 재사용 하였으나, 권장되지는 않습니다.(스크린 별로 따로 사용해 주세요.)

# 13. FormData를 사용한 데이터 업데이트

이제 실제 업데이트 로직을 채울 차례입니다.

```
// src/routes/edit.tsx

import {
  Form,
  useLoaderData,
  redirect,
} from "react-router-dom";
import { updateContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}
```

👉 Main.tsx에 액션을 추가합니다.

```

// src/routes/main.tsx

/* existing code */
import EditContact, {
  action as editAction,
} from "./routes/edit";

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
        loader: contactLoader,
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

/* existing code */

```

![img](https://reactrouter.com/_docs/tutorial/12.webp)

업데이트가 정상적으로 실행되는 것을 확인할 수 있습니다.

// 이후 다른 작업을 해 나가면서 추가적으로 정리할 예정