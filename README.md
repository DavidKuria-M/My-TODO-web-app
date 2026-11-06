# TodoFlow 

TodoFlow is a modern, feature-rich client-side task management web application designed to help users organize their daily projects, track priorities, manage dynamic checklists, and keep workflows structured. Built as part of The Odin Project curriculum, this project emphasizes modular architecture, clean separation of concerns, and robust state persistence.

---

## Key Features

* **Interactive Side Detail Panel:** Seamlessly view, create, and edit task details (titles, descriptions, notes, due dates, priorities, and projects) using a slide-out panel lifecycle.
* **ContentEditable Titles:** Clean, inline-editable task headers with robust state handling and anti-whitespace sanitization.
* **Dynamic Checklists:** Add, check off, and manage sub-tasks within individual items without cross-task bleeding.
* **Project Categorization & Color-Coding:** Group tasks by custom projects, complete with dynamic visual indicator dots and priority color tags (Low, Medium, High).
* **Trash & Recovery System:** Safely delete tasks into a dedicated Trash store with instant UI badge and header updates.
* **Persistent Storage:** All active tasks and trash items are automatically saved to the browser's `LocalStorage` so your data never disappears on refresh.
* **Modern Tooling & Bundling:** Powered by Webpack with ES6+ modular JavaScript classes.

---

## Built With

* **HTML5** & **CSS3** (Custom CSS Grid & Flexbox layouts)
* **JavaScript (ES6+)** (Object-oriented classes, modules, and event-driven architecture)
* **Webpack** (Module bundler and asset management)
* **LocalStorage API** (Client-side state persistence)

---

## Project Structure

```text
todoflow/
├── dist/                  # Compiled production build output
├── src/
│   ├── assets/            # Images, icons, and static assets
│   ├── detailsPanel.js    # Side edit panel lifecycle and DOM controller
│   ├── storage.js         # LocalStorage handlers for active tasks
│   ├── trashTodos.js      # Trash management and storage logic
│   ├── uiRender.js        # DOM rendering engine and event listeners
│   └── index.js           # App entry point, state routing, and event wiring
├── package.json
└── webpack.config.js

```

---

## Getting Started

To run TodoFlow locally on your machine, follow these simple steps:

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/DavidKuria-M/My-TODO-web-app.git

```


2. **Navigate to the project directory:**
```bash
cd todoflow

```


3. **Install dependencies:**
```bash
npm install

```


4. **Run the development server (Webpack):**
```bash
npm run start

```


5. **Build for production:**
```bash
npm run build

```



---

## Author

* **David Kuria**
* GitHub: [@DavidKuria-M](https://www.google.com/search?q=https://github.com/DavidKuria-M)

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/DavidKuria-M/todoflow/issues).