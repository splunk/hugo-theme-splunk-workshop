+++
title       = "Installing Splunk"
description = "Three platforms, three commands, one running instance."
duration    = "10 min"
difficulty  = "beginner"
weight      = 20
+++

{{< lead >}}
Splunk Enterprise runs on every major OS. Pick your platform, run the install command, and you’ll have a server listening on port 8000 within a few minutes.
{{< /lead >}}

## Choose your platform

{{< tabs >}}

{{< tab "macOS" >}}
The fastest path on macOS is Homebrew. If you don’t have Homebrew yet, [install it first](https://brew.sh).

```bash {file="install.sh"}
brew install --cask splunk-enterprise
sudo /Applications/Splunk/bin/splunk start --accept-license
```

When the prompt asks for an admin username and password, choose something memorable — you’ll be using it constantly.
{{< /tab >}}

{{< tab "Linux" >}}
On Debian/Ubuntu, install the `.deb` package downloaded from splunk.com:

```bash {file="install.sh"}
sudo dpkg -i splunk-9.2.0-linux-2.6-amd64.deb
sudo /opt/splunk/bin/splunk start --accept-license
sudo /opt/splunk/bin/splunk enable boot-start
```
{{< /tab >}}

{{< tab "Docker" >}}
The least-permanent option — perfect for a workshop:

```bash {file="run.sh"}
docker run -d \
  -p 8000:8000 \
  -e "SPLUNK_PASSWORD=changeme" \
  -e "SPLUNK_START_ARGS=--accept-license" \
  --name splunk \
  splunk/splunk:latest
```
{{< /tab >}}

{{< /tabs >}}

## Verify it’s running

Open a terminal and run:

{{< terminal title="bash" >}}
$ curl -s -k https://localhost:8000 -o /dev/null -w "%{http_code}\n"
200
$ splunk status
splunkd is running (PID: 12345).
{{< /terminal >}}

If you see `200`, you’re good. If not, the next callout has the most common fixes.

{{< warning "Port 8000 already in use?" >}}
If you’re running another web server on `:8000`, Splunk will fail to start silently. Either stop the other service or restart Splunk on a different port:

```bash
splunk set web-port 8001
splunk restart
```
{{< /warning >}}

{{< danger "Don’t skip the license prompt" >}}
The `--accept-license` flag is required for unattended starts. Without it, the server boots into an interactive setup loop that will eat your afternoon.
{{< /danger >}}

## Sign in

Open `http://localhost:8000` and sign in with the credentials you set during install.

{{< image src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80" alt="Splunk login page" caption="The Splunk login screen — your portal for the rest of this workshop." >}}

## Project layout

For the rest of this workshop, we’ll work out of a folder structured like this:

{{< file-tree >}}
splunk-workshop/
├── data/
│   ├── access.log         # web-server access log
│   ├── errors.log         # application errors
│   └── tutorial.csv       # sample dataset
├── searches/
│   └── starter.spl
└── README.md
{{< /file-tree >}}

Your config file lives at {{< file "$SPLUNK_HOME/etc/system/local/server.conf" >}} — we’ll edit it later in step 4.

{{< checkpoint "Splunk is installed and reachable at http://localhost:8000" >}}
