# 🌐 User Search Frontend (Angular)

Welcome to the **User Search Frontend**, a sleek and responsive single-page web app built with **Angular**. It connects to a Spring Boot backend and lets you search, sort, and filter users in real-time. Designed to feel like Google Search for users — clean, fast, and intuitive.

---

## ✨ What It Does

* 🔎 **Global Search Bar** — Search users by *first name*, *last name*, or *SSN*.
* ⚡ **Instant Results** — Fetches users as soon as you type 3+ characters.
* 🧱 **Client-Side Sorting** — Toggle sort by age (ascending/descending).
* 🎯 **Role-Based Filtering** — Quickly filter results without reloading.
* 💎 **Responsive UI** — Works beautifully on desktop, tablet, and mobile.

---

## 🧩 How It's Built

| Layer    | Technology               |
| -------- | ------------------------ |
| Frontend | Angular 17+              |
| Styling  | Bootstrap 5 + Custom CSS |
| Language | TypeScript               |

The project follows **clean code principles** and **atomic design** — every component has a clear purpose and is easy to test, maintain, and reuse.

---

## 🧠 Architecture Overview

```
src/app/
├── app-routing.module.ts      # Root routing (lazy loads SearchModule)
├── core/
│   ├── models/user.model.ts   # User interface
│   └── services/user.service.ts # API integration
└── features/search/
    ├── search.module.ts       # Lazy-loaded feature module
    ├── search-page/           # Handles search UI and logic
    └── user-grid/             # Displays user cards in grid layout
```

---

## ⚙️ Environment Configuration

**`src/environments/environment.ts`**

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/users'
};
```

---

## 🚀 How to Run Locally

### 1. Clone the project

```bash
cd usersearch-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
ng serve
```

Visit [http://localhost:4200](http://localhost:4200) in your browser.

> 💡 Make sure your backend (Spring Boot API) is running at `http://localhost:8080`.

---

## 🧪 Testing & Code Coverage

Run tests:

```bash
ng test
```

Run with coverage report:

```bash
npm run test:coverage
```

Open report:

```
coverage/index.html
```

### Includes tests for:

* **UserService** → backend API calls.
* **SearchPageComponent** → search, sort, filter behavior.
* **UserGridComponent** → visual rendering.

---

## 🧰 Key Highlights

* **Atomic Design** — small, focused components.
* **SPA Architecture** — built as a single-page app.
* **Lazy Loading** — only loads the Search module when needed.
* **Responsive Design** — fully adaptive using Bootstrap grid.
* **Error Handling** — graceful messages on network or API issues.
* **Externalized Config** — environment-based API URLs.

---

## 💬 Example API Call

Backend endpoint:

```
GET http://localhost:8080/api/users/search?query=John
```

Frontend service:

```ts
searchUsers(query: string): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl}/search?query=${query}`);
}
```

---

## 👨‍💻 Author

**Ashwini Kumar**
Full Stack Developer — Java | Spring Boot | Angular | GCP

---

