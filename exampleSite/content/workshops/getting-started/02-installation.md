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

{{< tabs groupid="install" >}}
{{< tab "macOS" >}}
The fastest path on macOS is Homebrew:

```bash {file="install.sh"}
brew install --cask splunk-enterprise
sudo /Applications/Splunk/bin/splunk start --accept-license
```
{{< /tab >}}
{{< tab "Linux" >}}
On Debian/Ubuntu:

```bash {file="install.sh"}
sudo dpkg -i splunk-9.2.0-linux-2.6-amd64.deb
sudo /opt/splunk/bin/splunk start --accept-license
```
{{< /tab >}}
{{< tab "Docker" >}}
The least-permanent option:

```bash {file="run.sh"}
docker run -d -p 8000:8000 \
  -e "SPLUNK_PASSWORD=changeme" \
  -e "SPLUNK_START_ARGS=--accept-license" \
  --name splunk splunk/splunk:latest
```
{{< /tab >}}
{{< /tabs >}}

## Verify it’s running

{{< terminal title="bash" >}}
$ curl -s -k https://localhost:8000 -o /dev/null -w "%{http_code}\n"
200
$ splunk status
splunkd is running (PID: 12345).
{{< /terminal >}}

{{< warning "Port 8000 already in use?" >}}
If you’re running another web server on `:8000`, Splunk fails silently. Restart on a different port:

```bash
splunk set web-port 8001
splunk restart
```
{{< /warning >}}

{{< checkpoint "Splunk is installed and reachable at http://localhost:8000" >}}
