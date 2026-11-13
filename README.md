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
Netlify runs `node build.mjs`, which copies the site into `dist/` and builds the blog (`/blog`) from `content/blog/*.json`.
`netlify.toml` holds redirects from the old Wix page addresses.

## Forms (Netlify Forms)
- `contact` (contact page) → thomas@
- `bid` (bidding page) → sydnee@, thomas@
- `application` (careers page) → thomas@
- `privacy-request` (privacy page) → thomas@

## Editing
Use the website admin at `/admin` (sign in with a GitHub account that has access to this repository):
- **Site settings** → `data/site.json` (logo, favicon, phone, email, address, hours, credentials, notice bar, social links)
- **Blog** → `content/blog/*.json` (posts at /blog, linked from the footer only)
- **Page text** → `data/home.json`, `data/about.json`, `data/careers.json` (headlines and copy)
- **Industries** → `data/industries.json` (six industry pages and homepage cards)
- **Projects** → `data/projects.json` (photo gallery on home and industry pages)
- **FAQ** → `data/faq.json` (Bidding page)
- **Team** → `data/team.json` (About page)
- **Job listings** → `data/jobs.json` (Careers page)
- **Trusted by** → `data/clients.json` (homepage banner)

Uploaded photos and logos are saved to `images/uploads/`. Every save publishes automatically.
The admin is not linked from the site and is excluded from search engines.
