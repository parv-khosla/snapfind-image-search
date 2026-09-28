# SnapFind — Part 3

A plain HTML, CSS and JavaScript image-search app.

## Features

- Loading indicator shown before `fetch()`
- Empty-state message when no images are found
- `try...catch` plus `response.ok` error handling
- Result count
- Fade-in animation for image cards
- Responsive mobile layout
- Uses the Wikimedia Commons API, so no API key is required

## Run locally

Open `index.html` in a browser.

For the best local experience, use VS Code Live Server or another simple static server.

## Test the required states

### Loading
Search for any word and watch the "Searching..." indicator.

For a slower loading test, use Chrome DevTools:
Network → Throttling → Slow 3G.

### Empty
Search:
`zxqwlk`

You should see:
"No results for "zxqwlk". Try another search."

### Error
Temporarily change `API_URL` in `script.js` to an invalid URL, or turn off the network.

You should see the friendly error message.

## GitHub Pages deployment

1. Create/use the same public GitHub repository from Parts 1 and 2.
2. Put these files in the repository.
3. Create a new branch:
   `git checkout -b part-3-polish-deploy`
4. Commit:
   `git add .`
   `git commit -m "Add loading empty error states and polish"`
5. Push:
   `git push -u origin part-3-polish-deploy`
6. Open a Pull Request from `part-3-polish-deploy` into `main`.
7. In GitHub: Settings → Pages.
8. Select "Deploy from a branch".
9. Choose `main` and `/ (root)`, then Save.
10. Your live URL will be:
   `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

## Pull request description

Repo URL:
PASTE YOUR PUBLIC GITHUB REPOSITORY URL HERE

Live URL:
PASTE YOUR GITHUB PAGES URL HERE
