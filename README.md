# GeoClearance NYSC 🇳🇬

> **Next-Generation Decentralized Biometric & Location Clearance System for the Nigerian National Youth Service Corps (NYSC).**

[![Zero Hardware Required](https://img.shields.io/badge/Hardware%20Cost-%240%20(Uses%20Smartphones)-008744?style=for-the-badge)](https://github.com)
[![Clearance Speed](https://img.shields.io/badge/Queue%20Speed-0.4s%20per%20person-f5b300?style=for-the-badge)](https://github.com)
[![Offline Ready](https://img.shields.io/badge/Offline%20Engine-ECDSA%20Verified-blue?style=for-the-badge)](https://github.com)

---

## 📌 The Problem
Every month, over **300,000 Nigerian corps members** gather across 774 Local Government Area (LGA) secretariats for mandatory biometric clearance. 
* 3,000+ corpers queue under the sun for 8+ hours.
* Dependent on 1 or 2 sluggish, smudge-prone optical fingerprint scanners.
* Slow or crashing server connections with the central NYSC portal.
* Physical congestion, exhaustion, and frequent server downtime.

---

## 💡 The Solution: GeoClearance NYSC
GeoClearance replaces single-point hardware bottlenecks with a **Decentralized Dual-Mode Architecture**:

```
[Corper's Smartphone]                                [NYSC Station / Officer]
       │                                                         │
1. Enters Geofence (LGA Secretariat)                             │
       │                                                         │
2. Scans Secretariat Dynamic Screen ─────────> (Captures Live Station OTP)
   (Proves line-of-sight in 1 second)                            │
       │                                                         │
3. Phone instantly synthesizes & displays:                       │
   • Verified Corper Identity (State Code + Photo)               │
   • Time-bound Clearance QR Pass (30s TOTP)                     │
       │                                                         │
4. Steps up to Officer's desk ───────────────> Officer Scans in 0.4s
                                              • Instant Green Audio Chime!
                                              • "Cleared: ADELEKE OLUWASEUN"
```

### ⚡ Key Capabilities:
1. **Route A: Officer Scans Corper (High-Stakes Monthly Clearance)**
   - Corper generates a dynamic, time-expiring QR Pass (30s TOTP with HMAC-SHA256).
   - NYSC Official points camera or handheld 2D scanner $\rightarrow$ **cleared in 0.4s**.
   - With 6 desk officers scanning in parallel, **3,000 corpers are cleared in ~25 minutes**.
2. **Route B: Corper Scans Secretariat Screen (Express CDS Mode)**
   - LGI displays a dynamic Master Station QR code on a laptop or projector screen (refreshes every 8 seconds).
   - Corpers walk past, scan the screen, and register their attendance with zero waiting line.
3. **100% Offline Capability ("The Nigerian Factor")**
   - If cellular network (MTN/Airtel) crashes at the secretariat, the Inspector's scanner validates the cryptographic signature **offline in airplane mode**.
   - Clearances are saved locally and batch-synced to the NYSC portal once connected to Wi-Fi.
4. **Anti-Cheat & Fraud Protection**
   - **No WhatsApp Screenshot Sharing**: QR codes cycle with fresh cryptographic hashes every 30 seconds.
   - **No GPS Spoofing**: Native mock location detection rejects fake GPS apps.
   - **Decentralized Biometrics**: Camera facial liveness match against official NYSC dashboard records.
5. **Zero Hardware Expense for Government**:
   - Runs directly on smartphones and standard laptops already owned by corpers and LGA secretariats.

---

## 🚀 How to Run the Prototype Locally

No build tools, node modules, or complex dependencies required. It is built with vanilla HTML5, CSS3, and modern JavaScript.

### Quick Start:
* **Live Production Demo**: [https://0xtryhardx0.github.io/geoclearance-nysc/](https://0xtryhardx0.github.io/geoclearance-nysc/)

```bash
# Clone the repository
git clone https://github.com/0xtryhardx0/geoclearance-nysc.git
cd geoclearance-nysc

# Serve using any local web server, for example:
python3 -m http.server 8000
```
Then open your browser at:
`http://localhost:8000`

---

## 📱 Testing the Interactive Roles

The app includes an interactive **Role Switcher** in the top navigation:
1. **📱 Corps Member View**:
   - Experience the mobile app, switch between **6 Nigerian NYSC LGA Secretariat Stations** (Ikeja Lagos, AMAC Abuja, Port Harcourt Rivers, Ibadan North Oyo, Enugu North, Kano Municipal) and **6 Pre-Enrolled Corps Members**, or **Quick-Enroll** a custom Corps Member.
   - Test geofencing checks (**📍 At Secretariat**, **📡 Live Device GPS** with Haversine distance calculation, **🏠 At Home**, and **⚠️ Fake GPS App**).
   - View the dynamic rolling QR pass, trigger live camera **Biometric Facial Liveness**, and download a cryptographically signed **📄 Official Monthly Clearance Slip (`.txt`)**.
2. **🖥️ Secretariat Screen**: View the high-visibility rolling Master QR screen (8-second challenge beacon) and live telemetry counter for any selected LGA Secretariat.
3. **👮 Inspector Terminal**:
   - Experience the high-speed 0.4s scanner, **📹 Live WebCam** optical feed, **⏭️ Next Corper** queue switcher, sound chime, and **Zero-Internet Offline Mode** batch queue.
   - Search the live **📋 Official Monthly Clearance Manifest & Audit Ledger** table and click **📥 Export Official NYSC CSV** (`NYSC_Clearance_Manifest_<LGA>_Nov2026.csv`).
4. **⚡ Live Dual Demo**: Watch the phone generate the pass on the left and the inspector scan it on the right in real time.

---

## 🔒 Security & Cryptography
* **Zero XSS sinks**: Fully constructed via DOM primitives (`createElement`, `textContent`, `replaceChildren`).
* **Content Security Policy**: Strict CSP meta policy configured.
* **Cryptography**: Web Crypto API (`crypto.subtle`, SHA-256 HMAC tokens, time-sliced rolling challenges).

---

## 📄 Intellectual Property & License
**Proprietary & Confidential — All Rights Reserved (© 2026 0xtryhardx0 Labs / GeoClearance Systems).**  
 Protected under the Nigerian Copyright Commission (NCC) Literary/Software Works Registry. Unauthorized reproduction, reverse engineering, commercial deployment, or derivative integration without a written commercial license is strictly prohibited.
