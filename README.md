# pittmanwoodworks.com

Website for Pittman Woodworks, commercial casework and countertops in North Richland Hills, Texas.

## Pages
| Address | File |
|---|---|
| `/` | `index.html` (home) |
| `/industries/` | `industries/index.html` |
| `/industries/healthcare`, `education`, `restaurants`, `offices`, `multifamily`, `retail-automotive` | `industries/*.html` |
| `/construction` | `construction.html` |
| `/bidding` | `bidding.html` (bid form, prequal, FAQ) |
| `/contact` | `contact.html` |
| `/about` | `about.html` (team) |
| `/careers` | `careers.html` (job listings + applications) |
| `/privacy`, `/terms`, `/accessibility` | legal pages |

Shared styles live in `styles.css`; the mobile menu script is `site.js`.

## Hosting
Hosted on Netlify. Every change saved to the `main` branch publishes automatically.
`netlify.toml` holds redirects from the old Wix page addresses.

## Forms (Netlify Forms)
- `contact` (contact page) → thomas@
- `bid` (bidding page) → sydnee@, thomas@
- `application` (careers page) → thomas@
- `privacy-request` (privacy page) → thomas@

## Editing
Use the website admin at `/admin` (sign in with a GitHub account that has access to this repository):
- **Team** → `data/team.json` (About page)
- **Job listings** → `data/jobs.json` (Careers page)
- **Trusted by** → `data/clients.json` (homepage banner)

Uploaded photos and logos are saved to `images/uploads/`. Every save publishes automatically.
The admin is not linked from the site and is excluded from search engines.
