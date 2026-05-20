## Makefile — common dev workflows for the Splunk Workshop Theme.
## Run `make help` to see targets. Defaults are tuned for theme development.

THEME_DIR     := $(shell pwd)
EXAMPLE_DIR   := exampleSite
PORT          ?= 1313
HUGO          ?= hugo

## LAN IP for serving on all interfaces — auto-detected for mobile testing.
## Tries macOS Wi-Fi (en0), then macOS Ethernet (en1), then Linux `hostname -I`.
## Override with `LAN_IP=192.168.x.y make serve` if the wrong interface is picked.
LAN_IP        ?= $(shell ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || hostname -I 2>/dev/null | awk '{print $$1}' || echo 127.0.0.1)

.DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

.PHONY: serve
serve: ## Run the demo on http://$(LAN_IP):$(PORT) (LAN-reachable for mobile testing)
	$(HUGO) server --source $(EXAMPLE_DIR) --themesDir ../.. --port $(PORT) --bind 0.0.0.0 --baseURL http://$(LAN_IP) --disableFastRender

.PHONY: serve-drafts
serve-drafts: ## Run the demo with drafts visible (LAN-reachable)
	$(HUGO) server --source $(EXAMPLE_DIR) --themesDir ../.. --port $(PORT) --bind 0.0.0.0 --baseURL http://$(LAN_IP) --buildDrafts --disableFastRender

.PHONY: build
build: ## Build the demo to exampleSite/public
	$(HUGO) --source $(EXAMPLE_DIR) --themesDir ../.. --minify

.PHONY: clean
clean: ## Remove build output and caches
	rm -rf $(EXAMPLE_DIR)/public $(EXAMPLE_DIR)/resources $(EXAMPLE_DIR)/.hugo_build.lock
	rm -rf public resources .hugo_build.lock

.PHONY: check
check: ## Build with strict logging to surface warnings
	$(HUGO) --source $(EXAMPLE_DIR) --themesDir ../.. --logLevel info --printI18nWarnings --printPathWarnings

.PHONY: shortcodes
shortcodes: ## List every shortcode shipped with the theme
	@ls layouts/shortcodes | sed 's/\.html$$//' | sort | column

.PHONY: stats
stats: ## Print line-counts for layouts/CSS/JS
	@echo "== Templates ==";    wc -l layouts/_default/*.html layouts/_partials/*.html 2>/dev/null
	@echo;                       echo "== Shortcodes =="
	@find layouts/shortcodes -name '*.html' | wc -l | xargs printf "  %s shortcodes\n"
	@echo;                       echo "== Stylesheets =="; wc -l assets/css/*.css
	@echo;                       echo "== Scripts =="; wc -l assets/js/*.js

.PHONY: screenshot
screenshot: ## Capture screenshot.png + tn.png from the running demo
	@mkdir -p images
	@echo "Make sure 'make serve' is running in another terminal, then press enter"
	@read _
	@CHROME=$$([ -d "/Applications/Google Chrome.app" ] && echo "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" || echo "google-chrome"); \
	"$$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
	  --window-size=1500,1000 \
	  --screenshot=images/screenshot.png http://localhost:$(PORT)/; \
	"$$CHROME" --headless --disable-gpu --no-sandbox --hide-scrollbars \
	  --window-size=900,600 \
	  --screenshot=images/tn.png http://localhost:$(PORT)/
	@echo "Wrote images/screenshot.png and images/tn.png"
