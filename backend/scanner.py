import socket
import requests
import urllib3
from urllib.parse import urlparse
from risk import generate_report

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def get_base_url(target):
    if not target.startswith('http://') and not target.startswith('https://'):
        return 'http://' + target
    return target

def check_https(url_parsed):
    if url_parsed.scheme == 'https':
        return True, "HTTPS is enforced."
    
    host = url_parsed.hostname or url_parsed.netloc
    if check_port(host, 443):
        return True, "HTTPS is supported (port 443 open) but not strictly enforced in URL."
    return False, "HTTPS is neither enforced nor available."

def check_port(host, port, timeout=2):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.settimeout(timeout)
            result = sock.connect_ex((host, port))
            return result == 0
    except:
        return False

def scan_target(target):
    findings = []
    base_url = get_base_url(target)
    parsed = urlparse(base_url)
    host = parsed.hostname or parsed.netloc

    # 1. HTTPS Check
    has_https, https_msg = check_https(parsed)
    if not has_https:
        findings.append({
            "type": "Missing HTTPS",
            "risk": "HIGH",
            "score": 10,
            "description": "The site does not use HTTPS, meaning traffic is unencrypted.",
            "impact": "Attackers can intercept sensitive data like passwords or credentials via MITM (Man In The Middle) attacks.",
            "mitigation": "Install a TLS/SSL certificate and redirect all HTTP traffic to HTTPS."
        })

    # 2. Port Scan
    common_ports = {
        21: "FTP",
        22: "SSH",
        3306: "MySQL",
        80: "HTTP"
    }
    for port, service in common_ports.items():
        if check_port(host, port):
            if port == 80 and has_https:
                continue
            risk = "MEDIUM" if port in [21, 22, 3306] else "LOW"
            score = 6 if risk == "MEDIUM" else 2
            findings.append({
                "type": f"Open Port: {service} ({port})",
                "risk": risk,
                "score": score,
                "description": f"The {service} port ({port}) is open to the internet.",
                "impact": f"Exposing {service} globally increases the attack surface for server exploits, brute-force or default-credential attacks.",
                "mitigation": "Restrict access to this port using a firewall or Security Group, or disable the service if not needed."
            })

    # 3. Security Headers
    try:
        response = requests.get(base_url, timeout=5, verify=False, allow_redirects=True)
        headers = {k.lower(): v for k, v in response.headers.items()}
        print(f"[{host}] Headers scanned: {list(headers.keys())}")
        
        key_headers = [
            'content-security-policy',
            'strict-transport-security',
            'x-frame-options'
        ]
        
        missing_headers = [h for h in key_headers if h not in headers]
        
        if missing_headers:
            if len(missing_headers) == len(key_headers):
                risk = "MEDIUM"
                score = 5
            elif has_https and len(missing_headers) < len(key_headers):
                risk = "LOW"
                score = 2
            else:
                risk = "LOW"
                score = 4

            findings.append({
                "type": "Missing Security Headers",
                "risk": risk,
                "score": score,
                "description": f"The HTTP response is missing important security headers: {', '.join(missing_headers)}.",
                "impact": "Leaves the application vulnerable to Cross-Site Scripting (XSS), Clickjacking, or MITM downgrade attacks.",
                "mitigation": "Configure the web server or application framework to include missing headers like CSP, X-Frame-Options, and HSTS."
            })
    except requests.RequestException:
        pass

    # 4. Basic SQLi Error simulation
    try:
        # Appending simple syntax breaker
        sqli_payload = base_url + "?id=1'"
        resp = requests.get(sqli_payload, timeout=5, verify=False)
        body = resp.text.lower()
        error_patterns = [
            "you have an error in your sql syntax",
            "warning: mysql_fetch",
            "unclosed quotation mark",
            "quoted string not properly terminated",
            "pg_query(): query failed"
        ]
        if any(pattern in body for pattern in error_patterns):
            findings.append({
                "type": "Possible SQL Injection",
                "risk": "HIGH",
                "score": 10,
                "description": "The server responded with a database error when injecting a SQL special character.",
                "impact": "Attackers could potentially view, modify, or delete sensitive database contents.",
                "mitigation": "Use parameterized queries or prepared statements consistently instead of string concatenation."
            })
    except requests.RequestException:
        pass
    
    return generate_report(findings)
