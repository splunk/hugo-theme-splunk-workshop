+++
title       = "Deploy"
description = "Ship your site — to GitHub Pages, Netlify, Cloudflare Pages, or any static host."
weight      = 30
+++

{{< lead >}}
The theme produces a fully static site. Anywhere that serves files works.
{{< /lead >}}

## GitHub Pages (recommended for the demo)

The theme repo ships with a workflow at `.github/workflows/pages.yml` that builds `exampleSite/` and publishes to the `gh-pages` branch on every push to `main`.

To use it for your own site:

{{< step "Enable Pages" "1" "1 min" >}}
In your repo settings, **Pages → Source → GitHub Actions**.
{{< /step >}}

{{< step "Adapt the workflow" "2" "2 min" >}}
Copy `.github/workflows/pages.yml` from this theme into your own site, and adjust the `--source` flag if your Hugo project lives at the repo root (drop the `--source exampleSite` argument).
{{< /step >}}

{{< step "Push" "3" "30 sec" >}}
```bash
git push origin main
```

In a minute the site will be live at `https://<your-org>.github.io/<repo>/`.
{{< /step >}}

## Netlify

```toml
# netlify.toml
[build]
  publish = "public"
  command = "hugo --minify"

[build.environment]
  HUGO_VERSION = "0.161.1"
```

Connect the repo on netlify.com — done.

## Cloudflare Pages

In the Cloudflare dashboard:

- **Build command:** `hugo --minify`
- **Output dir:** `public`
- **Environment variable:** `HUGO_VERSION = 0.161.1`

## Plain static hosting (S3, nginx, etc.)

```bash
hugo --minify
rsync -avz --delete public/ user@server:/var/www/site/
```

That's it — `public/` is the entire deployable bundle.

{{< notice warning "Set baseURL correctly" >}}
The `baseURL` in your `hugo.toml` must match the deployed URL. For GitHub Pages this is usually `https://<org>.github.io/<repo>/` — the trailing slash matters. Wrong baseURL produces broken asset paths and search index.
{{< /notice >}}

{{< checkpoint "Site deployed and accessible at the public URL" >}}
