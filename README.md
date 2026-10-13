# ArrayGrade: Student Grade Management System

An interactive educational website demonstrating how **JavaScript arrays** solve a real-world student grade management problem.

## Features
- Add, view, search, edit, and delete student records
- Calculate class average, highest and lowest scores
- Grade distribution chart using UCC-style grade bands
- Interactive array index visualization and method demonstrations
- Browser localStorage persistence (no server/database)
- Responsive layout for desktop and mobile
- Explanations of six real-world applications of arrays

## Main data structure

```js
let students = [
  { id: 1001, name: 'Ama Mensah', score: 85 },
  { id: 1002, name: 'Kojo Asante', score: 72 }
];
```

Array methods: `push`, `pop`, `find`, `findIndex`, `filter`, `map`, `reduce`, `splice`, `sort`, and `reverse`.

## Run locally
Open `index.html` in a browser. No installation or build tools required.

## Publish with GitHub and Vercel
1. Create a **public** GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root.
3. The `GITHUB_REPO_URL` value in `script.js` is already set to `https://github.com/Selanku11-cmd/Student-Grades-Management-System`. If you change the repository name later, update that value too.
4. In [Vercel](https://vercel.com/new), choose **Add New Project** and import your GitHub repository.
5. Select **Other** as the framework preset. Keep the root directory as `./` and leave the build command blank. Deploy.
6. Share the Vercel URL. The website's **GitHub Source** link points back to your code.

Future pushes to the production branch automatically redeploy the Vercel website.

## Important notes
- Demo student records are provided on first load. They can be edited or deleted.
- Data is stored in the visitor's own browser only, not shared across devices.
- Do not use this demo to store confidential student information.
- This is a static educational project, not a production-grade school system.
