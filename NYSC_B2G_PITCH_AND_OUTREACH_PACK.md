# GeoClearance NYSC — B2G Sales, Pilot & Acquisition Playbook 🇳🇬

This playbook breaks down **who actually has the power and budget to buy or license GeoClearance NYSC**, the **3 fastest routes to close a deal in Nigeria**, the **pricing/licensing structures**, and **ready-to-send outreach templates**.

---

## 1. Who Are the Actual Buyers & Decision-Makers?

In Nigeria's public sector, selling software directly to a federal parastatal from scratch takes forever **unless** you enter through one of three doors:

### Tier 1: The Incumbent Technical Partner (Fastest Cash Acquisition / Sub-License)
* **Sidmach Technologies Nigeria Limited** (Lagos / Abuja)
  * **Why them**: Sidmach built and operates the **NYSC Integrated System (NYSC Portal - `portal.nysc.org.ng`)**. They already have the federal contract, the server infrastructure, and the revenue-share agreement with NYSC.
  * **Their Pain Point**: Every month, Sidmach takes the blame when the biometric client crashes at LGA secretariats or fingerprint scanners fail.
  * **Your Pitch to Sidmach**: *"Don't spend ₦500M+ buying and maintaining optical fingerprint scanners across 774 LGAs. License or acquire our zero-hardware cryptographic mobile/web clearance module and plug it directly into the existing NYSC portal as an official upgrade."*
  * **Key Roles to Target on LinkedIn / Warm Intro**:
    * Managing Director / CEO, Sidmach Technologies
    * Head of e-Government / NYSC Project Director at Sidmach
    * Chief Technology Officer (CTO) / Head of Product, Sidmach

### Tier 2: NYSC Directorate Headquarters (Abuja) — Official Pilot Approval
* **Department of Information and Communication Technology (ICT), NYSC NDHQ** (Maitama, Abuja)
  * **Key Decision-Maker**: **Director, ICT Department (NYSC)** & **Director, Corps Welfare & Health Services**.
  * **How to Enter**: Don't ask for a nationwide ₦1B contract on Day 1. Ask for a **Zero-Cost 1-Month Pilot in 1 or 2 High-Volume LGAs** (e.g., **Ikeja LGA in Lagos** or **AMAC in Abuja**).
  * **Why State Coordinators & LGIs Love It**: The **Lagos State Coordinator** and **FCT Coordinator** deal with the worst clearance stampedes (3,000–5,000 corpers per LGA). A State Coordinator can authorize an **innovation pilot alongside normal clearance** in a single LGA and send a glowing report up to the DG (Director-General) in Abuja.

### Tier 3: Federal Digital Champions (Top-Down Endorsement)
* **NITDA (National Information Technology Development Agency)** — Director General (**Kashifu Inuwa Abdullahi**) & Office for Nigerian Digital Innovation (**ONDI**).
* **Federal Ministry of Youth Development** — Minister of Youth Development & Special Advisers on Digital/ICT (who oversee NYSC directly).
* **Federal Ministry of Communications, Innovation & Digital Economy** — Technical Advisers to the Minister (**Dr. 'Bosun Tijani**).

---

## 2. The 4-Step Execution Plan to Close the Deal

### Step 1: Host the Live Interactive Demo on a Dedicated URL (Today)
* Deploy `geoclearance-nysc` to a clean production URL (e.g., `geoclearance-nysc.vercel.app`) so any Director, LGI, or Sidmach executive can tap the link on their phone or laptop and test **📱 Corps Member**, **🖥️ Secretariat Screen**, **👮 Inspector Terminal**, and **⚡ Live Dual Demo** in 30 seconds.

### Step 2: Run the "Trojan Horse" Single-LGA Pilot (Weeks 1–2)
* Walk into (or message) the **NYSC State Secretariat in Surulere, Lagos (or Wuse, Abuja)** and meet the **Assistant Director (ICT)** or **LGI (Local Government Inspector)** for Ikeja / Eti-Osa / AMAC.
* Show them the **⚡ Live Dual Demo** on an iPad/laptop and say:
  > *"Ma/Sir, on the next monthly clearance day, let us set up one laptop screen for just ONE CDS group (e.g., ICT CDS group — 150 corpers) at zero cost to NYSC. Watch us clear 150 corpers in 3 minutes and export the exact CSV manifest you need."*
* Film a **60-second video** of real corps members in khaki getting cleared in 0.4 seconds per person with the green chime. That video becomes your ultimate sales weapon.

### Step 3: Pitch Sidmach Technologies & NYSC ICT Director Simultaneously (Weeks 2–4)
* Send the live demo link + the 60-second pilot video to **Sidmach Technologies** (proposing a technical partnership / white-label buyout) AND to the **NYSC Director of ICT** + **Ministry of Youth Development**.
* When Sidmach sees that you are already showing the solution to NYSC HQ / Ministry of Youth, they are strongly incentivized to **partner with you or buy the IP** rather than risk a competitor taking part of their NYSC contract.

---

## 3. Pricing & Commercial Models (How You Make Money)

| Model | Target Buyer | Structure | Target Valuation / Revenue |
| :--- | :--- | :--- | :--- |
| **Option A: White-Label IP Acquisition / Buyout** | **Sidmach Technologies** (or competing GovTech integrator like Galaxy Backbone / SocketWorks) | Full source code, cryptographic TOTP/ECDSA engine, and handover to integrate into `portal.nysc.org.ng`. | **₦45M – ₦120M** one-time buyout + optional 12-month technical retainer |
| **Option B: Per-Corper SaaS / Portal Levy Share** | **Sidmach + NYSC ICT** | Corps members already pay a portal fee during mobilization. Charge a micro-license per active corps member per year (~400,000 corpers/year). | **₦250 – ₦500 per corper/year** = **₦100M – ₦200M / year** |
| **Option C: State/LGA Secretariat Licensing** | **State Governments** (Lagos State Ministry of Innovation, FCT, Rivers) | Annual license for the 20–57 LGAs/LCDAs in the state for NYSC & State Internship attendance tracking. | **₦15M – ₦35M per State / year** |

---

## 4. Ready-to-Send Outreach Messages

### A. Cold/Warm Message to Sidmach Technologies Executives (LinkedIn / Email)
**Subject:** Eliminating NYSC Monthly Clearance Bottlenecks (Zero-Hardware Cryptographic Module for NYSC Portal)

> Dear **[Name]**,
>
> Sidmach’s work powering the NYSC Integrated System is the backbone of youth mobilization in Nigeria. However, the last-mile monthly clearance across the 774 LGAs still suffers from physical queues, optical fingerprint reader wear-and-tear, and cellular network congestion on clearance days.
>
> We built **GeoClearance NYSC** — a zero-hardware, offline-first cryptographic attendance & facial liveness module designed specifically to plug into the existing NYSC portal:
> - **0.4-Second Clearance**: Replaces single fingerprint scanner bottlenecks with rolling 30-second Ed25519/HMAC QR passes and 8-second Secretariat Master Beacons.
> - **100% Offline-First**: Works when MTN/Airtel networks drop at crowded secretariats, queuing signed ECDSA records locally and exporting official NYSC CSV schedules.
> - **Zero Hardware CAPEX**: Uses the smartphones and laptops LGIs and corps members already have while blocking Mock GPS and WhatsApp screenshot sharing.
>
> **Interactive Live Prototype:** [Insert Vercel Link]
>
> Before we present this for a standalone LGA pilot with the Ministry of Youth Development, we would love to explore licensing or white-labeling this directly to **Sidmach** as an official upgrade to the NYSC Integrated System.
>
> Are you open to a 10-minute demo call this week?
>
> Best regards,  
> **[Your Name / Title]**

---

### B. Official Pilot Proposal Letter to NYSC Director of ICT / State Coordinator
**Subject:** Request for Zero-Cost 1-Day Pilot: High-Speed Biometric & Geofenced Monthly Clearance System (GeoClearance NYSC)

> **To:** The Director, ICT Department / State Coordinator,  
> **National Youth Service Corps (NYSC)**
>
> Dear Sir/Ma,
>
> Every month, over 3,000 Corps Members gather at major LGA secretariats such as Ikeja and AMAC for mandatory biometric clearance—often waiting 6 to 8 hours in the sun due to limited optical fingerprint terminals and network congestion.
>
> We have developed **GeoClearance NYSC**, a decentralized, zero-hardware biometric and geofence clearance system built to clear **3,000 Corps Members in under 28 minutes** at **zero hardware cost to the Scheme**.
>
> **How It Works (Live Demo: [Insert Link]):**
> 1. **Strict Geofence & Anti-Spoofing**: Validates that the Corps Member is physically inside the LGA Secretariat (within 50m) and blocks fake GPS apps.
> 2. **Decentralized Facial Liveness + Dynamic 30s QR Pass**: Eliminates WhatsApp screenshot fraud and dirty fingerprint sensors.
> 3. **Offline-Ready Inspector Terminal & Instant CSV Manifest**: Allows LGIs to scan passes in 0.4 seconds (even without internet) and export the verified monthly clearance schedule in one click.
>
> **Our Request:**
> We respectfully request permission to run a **zero-cost, non-disruptive shadow pilot** with a single CDS group (e.g., ICT CDS Group) during the upcoming monthly clearance exercise.
>
> We are available to demonstrate the live system at your office at your earliest convenience.
>
> Yours faithfully,  
> **[Your Name & Phone Number]**

---

### C. High-Impact X (Twitter) Viral Launch Post (Tagging Key Officials)
*In Nigeria, a crisp 45-second screen recording showing a real solution to an everyday NYSC pain point goes viral among Corpers and gets quote-tweeted directly to the Minister of Youth and Bosun Tijani.*

> Every month, 3,000+ NYSC corpers stand in the sun for 7 hours at LGA secretariats waiting for 1 dusty fingerprint scanner to work.
>
> So we built **GeoClearance NYSC** 🇳🇬⚡
>
> - Geofenced to the LGA Secretariat (blocks Fake GPS)
> - 30-second rolling cryptographic pass (no WhatsApp screenshots)
> - Works 100% OFFLINE when network crashes
> - Clears 1 corper in **0.4 seconds** with zero government hardware cost
>
> Live interactive demo 👇 [Link]
>
> Let’s modernize NYSC clearance. @OfficialNYSCng @fmydNG @nitdanig @bosuntijani

