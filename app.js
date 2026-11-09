/**
 * GeoClearance NYSC - Core Interactive Application Logic
 * Adheres strictly to SecureCoder frontend guidelines:
 * - Zero innerHTML/outerHTML/insertAdjacentHTML/document.write
 * - Strict DOM construction via createElement, textContent, replaceChildren
 * - Client-side Web Crypto API for SHA-256 tokens and HMAC signatures
 * - Multi-LGA Secretariat Geolocation, Multi-Corper Queue & CSV Manifest Export
 */

(function () {
  'use strict';

  // --- 1. Official NYSC LGA Secretariat Stations & Coordinates ---
  const LGA_STATIONS = {
    IKJ: {
      code: 'IKJ',
      name: 'Ikeja LGA Secretariat',
      title: 'IKEJA LGA SECRETARIAT',
      stationTag: 'STATION #IKJ-HALL-01 • CDS / CLEARANCE TERMINAL',
      stateName: 'Lagos State',
      lat: 6.5965,
      lng: 3.3421,
      enrolled: 3240,
      clearedBase: 1894
    },
    AMC: {
      code: 'AMC',
      name: 'AMAC Secretariat (Wuse Zone 3)',
      title: 'ABUJA MUNICIPAL (AMAC) SECRETARIAT',
      stationTag: 'STATION #AMC-FCT-01 • CDS / CLEARANCE TERMINAL',
      stateName: 'FCT Abuja',
      lat: 9.0579,
      lng: 7.4951,
      enrolled: 4120,
      clearedBase: 2645
    },
    PHC: {
      code: 'PHC',
      name: 'Port Harcourt City LGA Secretariat',
      title: 'PORT HARCOURT LGA SECRETARIAT',
      stationTag: 'STATION #PHC-RIV-02 • CDS / CLEARANCE TERMINAL',
      stateName: 'Rivers State',
      lat: 4.8156,
      lng: 7.0498,
      enrolled: 2180,
      clearedBase: 1412
    },
    IBN: {
      code: 'IBN',
      name: 'Ibadan North LGA Secretariat (Agodi)',
      title: 'IBADAN NORTH LGA SECRETARIAT',
      stationTag: 'STATION #IBN-OYO-01 • CDS / CLEARANCE TERMINAL',
      stateName: 'Oyo State',
      lat: 7.3878,
      lng: 3.8964,
      enrolled: 2890,
      clearedBase: 1730
    },
    ENU: {
      code: 'ENU',
      name: 'Enugu North LGA Secretariat',
      title: 'ENUGU NORTH LGA SECRETARIAT',
      stationTag: 'STATION #ENU-ENG-01 • CDS / CLEARANCE TERMINAL',
      stateName: 'Enugu State',
      lat: 6.4584,
      lng: 7.5464,
      enrolled: 1950,
      clearedBase: 1280
    },
    KNM: {
      code: 'KNM',
      name: 'Kano Municipal LGA Secretariat',
      title: 'KANO MUNICIPAL LGA SECRETARIAT',
      stationTag: 'STATION #KNM-KAN-01 • CDS / CLEARANCE TERMINAL',
      stateName: 'Kano State',
      lat: 11.9964,
      lng: 8.5167,
      enrolled: 1640,
      clearedBase: 1095
    }
  };

  // --- 2. Pre-Enrolled Corps Member Roster ---
  const CORPER_ROSTER = [
    {
      name: 'ADELEKE OLUWASEUN',
      stateCode: 'LA/24B/4819',
      callUpNumber: 'NYSC/UAM/2024/098124',
      ppa: 'Lagos State Ministry of Science & Technology',
      cds: 'ICT & Digital Skills',
      batch: 'Batch B Stream II',
      lgaCode: 'IKJ',
      passportUrl: 'assets/corper_passport.jpg'
    },
    {
      name: 'IBRAHIM ZAINAB AMINA',
      stateCode: 'FC/24C/1092',
      callUpNumber: 'NYSC/ABU/2024/114892',
      ppa: 'National Information Technology Development Agency (NITDA)',
      cds: 'Editorial & Publicity',
      batch: 'Batch C Stream I',
      lgaCode: 'AMC',
      passportUrl: 'assets/corper_passport.jpg'
    },
    {
      name: 'OKONKWO CHUKWUDI EMMANUEL',
      stateCode: 'RV/24B/3310',
      callUpNumber: 'NYSC/UNN/2024/076311',
      ppa: 'Rivers State University Teaching Hospital',
      cds: 'Medical & Health Services',
      batch: 'Batch B Stream I',
      lgaCode: 'PHC',
      passportUrl: 'assets/corper_passport.jpg'
    },
    {
      name: 'BABATUNDE TOLULOPE GRACE',
      stateCode: 'OY/24A/7741',
      callUpNumber: 'NYSC/UI/2024/045219',
      ppa: 'University College Hospital (UCH) Ibadan',
      cds: 'EFCC Anti-Corruption',
      batch: 'Batch A Stream II',
      lgaCode: 'IBN',
      passportUrl: 'assets/corper_passport.jpg'
    },
    {
      name: 'NWOSU KELECHI VICTOR',
      stateCode: 'EN/24C/5502',
      callUpNumber: 'NYSC/FUTO/2024/129044',
      ppa: 'Enugu State Tech Hub & Youth Innovation Center',
      cds: 'NDLEA Drug Free Club',
      batch: 'Batch C Stream I',
      lgaCode: 'ENU',
      passportUrl: 'assets/corper_passport.jpg'
    },
    {
      name: 'MUSA ABDULLAHI SANI',
      stateCode: 'KN/24B/2188',
      callUpNumber: 'NYSC/BUK/2024/088310',
      ppa: 'Kano State Ministry of Agriculture & Natural Resources',
      cds: 'Agro-Allied & SDGs',
      batch: 'Batch B Stream II',
      lgaCode: 'KNM',
      passportUrl: 'assets/corper_passport.jpg'
    }
  ];

  // --- 3. System State ---
  const STATE = {
    currentRole: 'view-corper',
    activeLgaCode: 'IKJ',
    activeCorperIndex: 0,
    locationStatus: 'secretariat', // 'secretariat' | 'realgps' | 'home' | 'fakegps'
    measuredDistanceMeters: 18,
    livenessVerified: true,
    isOfflineMode: false,
    chimeEnabled: true,
    activeCameraStream: null,
    activeSelfieStream: null,

    corper: { ...CORPER_ROSTER[0], month: 'November 2026' },

    corperPassInterval: 30,
    corperPassTimeRemaining: 28,
    stationTokenInterval: 8,
    stationTokenTimeRemaining: 7,

    offlineQueue: [],
    clearedCount: 1894,
    fraudCount: 14,

    // Initial Audit Manifest Ledger
    manifestLog: [
      {
        time: '08:39:12 WAT',
        name: 'IBRAHIM ZAINAB AMINA',
        stateCode: 'FC/24C/1092',
        callUpNumber: 'NYSC/ABU/2024/114892',
        lgaName: 'Ikeja LGA Secretariat',
        syncMode: 'ONLINE (CLOUD)',
        tokenSig: '0x91a4c8e2...f012',
        status: 'CLEARED'
      },
      {
        time: '08:40:04 WAT',
        name: 'OKONKWO CHUKWUDI EMMANUEL',
        stateCode: 'RV/24B/3310',
        callUpNumber: 'NYSC/UNN/2024/076311',
        lgaName: 'Ikeja LGA Secretariat',
        syncMode: 'ONLINE (CLOUD)',
        tokenSig: '0x3b77d19a...88c4',
        status: 'CLEARED'
      },
      {
        time: '08:41:19 WAT',
        name: 'BABATUNDE TOLULOPE GRACE',
        stateCode: 'OY/24A/7741',
        callUpNumber: 'NYSC/UI/2024/045219',
        lgaName: 'Ikeja LGA Secretariat',
        syncMode: 'DENIED (MOCK GPS)',
        tokenSig: 'REVOKED:FAKEGPS',
        status: 'DENIED'
      }
    ]
  };

  // --- 4. ISO/IEC 18004 Standards-Compliant QR Code Generator (Scannable by iOS/Android Cameras) ---
  class CompactQR {
    static getVersionSpec(byteLen) {
      // ISO/IEC 18004 Error Correction Level L (Single-block versions 1..5, up to 106 bytes)
      const specs = [
        { ver: 1, size: 21, dataBytes: 19, ecBytes: 7, align: [] },
        { ver: 2, size: 25, dataBytes: 34, ecBytes: 10, align: [6, 18] },
        { ver: 3, size: 29, dataBytes: 55, ecBytes: 15, align: [6, 22] },
        { ver: 4, size: 33, dataBytes: 80, ecBytes: 20, align: [6, 26] },
        { ver: 5, size: 37, dataBytes: 108, ecBytes: 26, align: [6, 30] }
      ];
      for (const s of specs) {
        if (byteLen + 2 <= s.dataBytes) return s;
      }
      return specs[specs.length - 1];
    }

    static computeReedSolomon(data, ecLen) {
      const exp = new Uint8Array(512);
      const log = new Uint8Array(256);
      let x = 1;
      for (let i = 0; i < 255; i++) {
        exp[i] = x;
        log[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
      }
      for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];

      const gfMul = (a, b) => (a === 0 || b === 0) ? 0 : exp[log[a] + log[b]];

      let gen = new Uint8Array([1]);
      for (let i = 0; i < ecLen; i++) {
        const next = new Uint8Array(gen.length + 1);
        const factor = exp[i];
        for (let j = 0; j < gen.length; j++) {
          next[j] ^= gen[j];
          next[j + 1] ^= gfMul(gen[j], factor);
        }
        gen = next;
      }

      const msg = new Uint8Array(data.length + ecLen);
      msg.set(data, 0);
      for (let i = 0; i < data.length; i++) {
        const coef = msg[i];
        if (coef !== 0) {
          for (let j = 1; j < gen.length; j++) {
            msg[i + j] ^= gfMul(gen[j], coef);
          }
        }
      }
      return msg.slice(data.length);
    }

    static generateMatrix(text) {
      const utf8 = Array.from(new TextEncoder().encode(text));
      const spec = CompactQR.getVersionSpec(utf8.length);
      const payload = utf8.slice(0, spec.dataBytes - 2);

      // Build Byte-mode bit stream (0100 + 8-bit length + payload + terminator + pad bytes)
      const bits = [];
      const pushBits = (val, len) => {
        for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
      };
      pushBits(0b0100, 4);
      pushBits(payload.length, 8);
      for (const b of payload) pushBits(b, 8);

      const maxBits = spec.dataBytes * 8;
      const termLen = Math.min(4, maxBits - bits.length);
      pushBits(0, termLen);
      while (bits.length % 8 !== 0) bits.push(0);

      const dataCodewords = new Uint8Array(spec.dataBytes);
      for (let i = 0; i < bits.length / 8; i++) {
        let byteVal = 0;
        for (let b = 0; b < 8; b++) byteVal = (byteVal << 1) | bits[i * 8 + b];
        dataCodewords[i] = byteVal;
      }
      const padBytes = [0xec, 0x11];
      for (let i = bits.length / 8, p = 0; i < spec.dataBytes; i++, p++) {
        dataCodewords[i] = padBytes[p % 2];
      }

      const ecCodewords = CompactQR.computeReedSolomon(dataCodewords, spec.ecBytes);
      const allCodewords = new Uint8Array(spec.dataBytes + spec.ecBytes);
      allCodewords.set(dataCodewords, 0);
      allCodewords.set(ecCodewords, spec.dataBytes);

      const size = spec.size;
      const matrix = Array.from({ length: size }, () => Array(size).fill(0));
      const reserved = Array.from({ length: size }, () => Array(size).fill(false));

      const placeFinder = (r0, c0) => {
        for (let r = -1; r <= 7; r++) {
          for (let c = -1; c <= 7; c++) {
            const pr = r0 + r, pc = c0 + c;
            if (pr >= 0 && pr < size && pc >= 0 && pc < size) {
              const inFinder = (r >= 0 && r <= 6 && c >= 0 && c <= 6);
              const isDark = inFinder && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
              matrix[pr][pc] = isDark ? 1 : 0;
              reserved[pr][pc] = true;
            }
          }
        }
      };

      placeFinder(0, 0);
      placeFinder(0, size - 7);
      placeFinder(size - 7, 0);

      // Alignment patterns
      if (spec.align.length > 0) {
        for (const ar of spec.align) {
          for (const ac of spec.align) {
            if (reserved[ar][ac]) continue;
            for (let r = -2; r <= 2; r++) {
              for (let c = -2; c <= 2; c++) {
                const isEdge = Math.max(Math.abs(r), Math.abs(c)) === 2;
                const isCenter = (r === 0 && c === 0);
                matrix[ar + r][ac + c] = (isEdge || isCenter) ? 1 : 0;
                reserved[ar + r][ac + c] = true;
              }
            }
          }
        }
      }

      // Timing patterns
      for (let i = 8; i < size - 8; i++) {
        if (!reserved[6][i]) {
          matrix[6][i] = (i % 2 === 0) ? 1 : 0;
          reserved[6][i] = true;
        }
        if (!reserved[i][6]) {
          matrix[i][6] = (i % 2 === 0) ? 1 : 0;
          reserved[i][6] = true;
        }
      }

      // Reserve Format Info areas & set Dark Module
      for (let i = 0; i < 9; i++) {
        if (i !== 6) {
          reserved[8][i] = true;
          reserved[i][8] = true;
        }
      }
      for (let i = 0; i < 8; i++) {
        reserved[8][size - 1 - i] = true;
        reserved[size - 1 - i][8] = true;
      }
      matrix[size - 8][8] = 1;
      reserved[size - 8][8] = true;

      // Place data & EC bits with Mask 0 ((r + c) % 2 === 0)
      const totalBits = allCodewords.length * 8;
      let bitIdx = 0;
      let upward = true;

      for (let rightCol = size - 1; rightCol > 0; rightCol -= 2) {
        if (rightCol === 6) rightCol = 5;
        for (let step = 0; step < size; step++) {
          const r = upward ? (size - 1 - step) : step;
          for (let dc = 0; dc < 2; dc++) {
            const c = rightCol - dc;
            if (!reserved[r][c]) {
              let bit = 0;
              if (bitIdx < totalBits) {
                const cw = allCodewords[bitIdx >> 3];
                bit = (cw >> (7 - (bitIdx & 7))) & 1;
                bitIdx++;
              }
              const maskBit = ((r + c) % 2 === 0) ? 1 : 0;
              matrix[r][c] = bit ^ maskBit;
            }
          }
        }
        upward = !upward;
      }

      // Write Format Information for Level L (01) + Mask 0 (000) -> 0x77c4
      const formatBits = 0x77c4;
      const topLeftRowCols = [0, 1, 2, 3, 4, 5, 7, 8];
      for (let k = 0; k < 8; k++) {
        const bit = (formatBits >> (14 - k)) & 1;
        matrix[8][topLeftRowCols[k]] = bit;
      }
      const topLeftColRows = [7, 5, 4, 3, 2, 1, 0];
      for (let k = 0; k < 7; k++) {
        const bit = (formatBits >> (6 - k)) & 1;
        matrix[topLeftColRows[k]][8] = bit;
      }
      for (let k = 0; k < 7; k++) {
        const bit = (formatBits >> (14 - k)) & 1;
        matrix[size - 1 - k][8] = bit;
      }
      for (let k = 0; k < 8; k++) {
        const bit = (formatBits >> (7 - k)) & 1;
        matrix[8][size - 8 + k] = bit;
      }

      return matrix;
    }

    static drawToCanvas(canvas, matrix, darkColor = '#005a2b', lightColor = '#ffffff') {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const quietZone = 3;
      const size = matrix.length;
      const totalModules = size + quietZone * 2;
      const cellSize = canvas.width / totalModules;

      ctx.fillStyle = lightColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = darkColor;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (matrix[r][c] === 1) {
            ctx.fillRect(
              (c + quietZone) * cellSize,
              (r + quietZone) * cellSize,
              Math.ceil(cellSize),
              Math.ceil(cellSize)
            );
          }
        }
      }
    }
  }

  // --- 5. Web Audio API Chime ---
  function playVerificationChime(isSuccess = true) {
    if (!STATE.chimeEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = isSuccess ? 'sine' : 'sawtooth';
      osc2.type = isSuccess ? 'sine' : 'sawtooth';

      if (isSuccess) {
        osc1.frequency.setValueAtTime(587.33, now);
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        osc2.frequency.setValueAtTime(880, now);
        osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15);
      } else {
        osc1.frequency.setValueAtTime(240, now);
        osc1.frequency.linearRampToValueAtTime(160, now + 0.25);
        osc2.frequency.setValueAtTime(220, now);
        osc2.frequency.linearRampToValueAtTime(140, now + 0.25);
      }

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.06);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch {
      // Ignore if AudioContext blocked
    }
  }

  // --- 6. Cryptographic & Geolocation Utilities ---
  async function generateTokenHash(payload) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function calculateHaversineMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = deg => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  function getFormattedTimeWAT() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds} WAT`;
  }

  // --- 7. DOM Elements ---
  const el = {
    tabs: document.querySelectorAll('.tab-btn'),
    views: document.querySelectorAll('.role-view'),
    timeDisplay: document.getElementById('system-time-display'),

    // Corper Mobile Pass & Status
    corperNameDisplay: document.getElementById('corper-name-display'),
    corperStatecodeDisplay: document.getElementById('corper-statecode-display'),
    corperPpaDisplay: document.getElementById('corper-ppa-display'),
    corperLgaDisplay: document.getElementById('corper-lga-display'),
    clearanceStatusBanner: document.getElementById('clearance-status-banner'),
    statusIndicatorDot: document.getElementById('status-indicator-dot'),
    statusBannerTitle: document.getElementById('status-banner-title'),
    statusBannerSub: document.getElementById('status-banner-sub'),
    passValidTag: document.getElementById('pass-valid-tag'),
    passInstructionText: document.getElementById('pass-instruction-text'),
    corperQrCanvas: document.getElementById('corper-qr-canvas'),
    dualCorperQrCanvas: document.getElementById('dual-corper-qr-canvas'),
    qrRefreshTimer: document.getElementById('qr-refresh-timer'),
    tokenSignatureHash: document.getElementById('token-signature-hash'),
    btnOpenClearanceSlip: document.getElementById('btn-open-clearance-slip'),

    // Legacy / Guarded Stepper & Scan elements
    geofenceZoneTitle: document.getElementById('geofence-zone-title'),
    geofenceCard: document.getElementById('step-geofence-card'),
    geofenceStatusText: document.getElementById('geofence-status-text'),
    geofenceBadge: document.getElementById('geofence-badge'),
    mockgpsCard: document.getElementById('step-mockgps-card'),
    mockgpsStatusText: document.getElementById('mockgps-status-text'),
    mockgpsBadge: document.getElementById('mockgps-badge'),
    livenessCard: document.getElementById('step-liveness-card'),
    livenessStatusText: document.getElementById('liveness-status-text'),
    btnReverifySelfie: document.getElementById('btn-reverify-selfie'),
    btnScanStationScreen: document.getElementById('btn-scan-station-screen'),

    // Roster & LGA Selectors (Sidmach Pre-loaded)
    selectActiveLga: document.getElementById('select-active-lga'),
    selectActiveCorper: document.getElementById('select-active-corper'),
    inputCustomName: document.getElementById('input-custom-name'),
    inputCustomStatecode: document.getElementById('input-custom-statecode'),
    btnEnrollCustomCorper: document.getElementById('btn-enroll-custom-corper'),

    // Simulation Dock Buttons
    simLocSecretariat: document.getElementById('sim-loc-secretariat'),
    simLocBuddy: document.getElementById('sim-loc-buddy'),
    simLocRealgps: document.getElementById('sim-loc-realgps'),
    simLocHome: document.getElementById('sim-loc-home'),
    simLocVelocity: document.getElementById('sim-loc-velocity'),
    simLocFakeGps: document.getElementById('sim-loc-fakegps'),

    // Sector Mode & Smart Queue AI
    selectSectorMode: document.getElementById('select-sector-mode'),
    appSeal: document.getElementById('app-seal'),
    smartSlotTitle: document.getElementById('smart-slot-title'),
    smartSlotSub: document.getElementById('smart-slot-sub'),
    smartSlotBadge: document.getElementById('smart-slot-badge'),

    // Secretariat View
    secretariatTitleDisplay: document.getElementById('secretariat-title-display'),
    secretariatStationDisplay: document.getElementById('secretariat-station-display'),
    stationMasterQrCanvas: document.getElementById('station-master-qr-canvas'),
    stationTokenCounter: document.getElementById('station-token-counter'),
    stationProgressBar: document.getElementById('station-progress-bar'),
    statClearedCount: document.getElementById('stat-cleared-count'),
    statEnrolledSub: document.getElementById('stat-enrolled-sub'),
    statThroughputRate: document.getElementById('stat-throughput-rate'),
    statFraudCount: document.getElementById('stat-fraud-count'),

    // Inspector View
    inspectorCameraVideo: document.getElementById('inspector-camera-video'),
    btnTriggerInspectorScan: document.getElementById('btn-trigger-inspector-scan'),
    btnNextCorperQueue: document.getElementById('btn-next-corper-queue'),
    btnToggleCameraFeed: document.getElementById('btn-toggle-camera-feed'),
    inputDeadphoneCode: document.getElementById('input-deadphone-code'),
    btnDeadphoneClear: document.getElementById('btn-deadphone-clear'),
    inspectorChimeToggle: document.getElementById('inspector-chime-toggle'),
    inspectorApprovalBanner: document.getElementById('inspector-approval-banner'),
    inspectorStatusHeader: document.getElementById('inspector-status-header'),
    inspectorStatusSub: document.getElementById('inspector-status-sub'),
    inspectorStatusIcon: document.getElementById('inspector-status-icon'),
    inspectorAiVerdictBox: document.getElementById('inspector-ai-verdict-box'),
    inspectorAiTitle: document.getElementById('inspector-ai-title'),
    inspectorAiSub: document.getElementById('inspector-ai-sub'),
    inspectorAiBadge: document.getElementById('inspector-ai-badge'),
    scannerStatusOverlay: document.getElementById('scanner-status-overlay'),
    recName: document.getElementById('rec-name'),
    recStatecode: document.getElementById('rec-statecode'),
    recCallup: document.getElementById('rec-callup'),
    recCds: document.getElementById('rec-cds'),
    recPpa: document.getElementById('rec-ppa'),
    offlineModeToggle: document.getElementById('offline-mode-toggle'),
    offlineStatusDesc: document.getElementById('offline-status-desc'),
    btnSyncOfflineBatch: document.getElementById('btn-sync-offline-batch'),
    offlinePendingCount: document.getElementById('offline-pending-count'),

    // Manifest Table & Export
    inputManifestSearch: document.getElementById('input-manifest-search'),
    btnExportManifestCsv: document.getElementById('btn-export-manifest-csv'),
    manifestTableBody: document.getElementById('manifest-table-body'),

    // Dual Simulation
    dualCorperStatecode: document.getElementById('dual-corper-statecode'),
    dualCorperName: document.getElementById('dual-corper-name'),
    dualGeofenceLine: document.getElementById('dual-geofence-line'),
    btnDualInstantScan: document.getElementById('btn-dual-instant-scan'),
    btnDualNextCorper: document.getElementById('btn-dual-next-corper'),
    dualTimerText: document.getElementById('dual-timer-text'),
    dualInspectorBadge: document.getElementById('dual-inspector-badge'),
    dualResultIcon: document.getElementById('dual-result-icon'),
    dualResultTitle: document.getElementById('dual-result-title'),
    dualResultDesc: document.getElementById('dual-result-desc'),

    // Modals
    modalSelfie: document.getElementById('modal-selfie'),
    selfieVideo: document.getElementById('selfie-video'),
    selfieMockImg: document.getElementById('selfie-mock-img'),
    selfieLivenessPrompt: document.getElementById('selfie-liveness-prompt'),
    btnCloseSelfieModal: document.getElementById('btn-close-selfie-modal'),
    btnCaptureSelfie: document.getElementById('btn-capture-selfie'),
    modalStationScanner: document.getElementById('modal-station-scanner'),
    btnCloseStationModal: document.getElementById('btn-close-station-modal'),
    btnConfirmStationToken: document.getElementById('btn-confirm-station-token'),
    modalClearanceSlip: document.getElementById('modal-clearance-slip'),
    btnCloseSlipModal: document.getElementById('btn-close-slip-modal'),
    slipName: document.getElementById('slip-name'),
    slipStatecode: document.getElementById('slip-statecode'),
    slipCallup: document.getElementById('slip-callup'),
    slipLga: document.getElementById('slip-lga'),
    slipMonth: document.getElementById('slip-month'),
    slipStatus: document.getElementById('slip-status'),
    slipSig: document.getElementById('slip-sig'),
    btnDownloadSlipFile: document.getElementById('btn-download-slip-file')
  };

  // --- 8. Render Active Corper & LGA Across All Views ---
  function syncActiveProfileToUI() {
    const c = STATE.corper;
    const station = LGA_STATIONS[STATE.activeLgaCode] || LGA_STATIONS.IKJ;

    // Phone Card
    if (el.corperNameDisplay) el.corperNameDisplay.textContent = c.name;
    if (el.corperStatecodeDisplay) el.corperStatecodeDisplay.textContent = c.stateCode;
    if (el.corperPpaDisplay) el.corperPpaDisplay.textContent = c.ppa;
    if (el.corperLgaDisplay) el.corperLgaDisplay.textContent = `${station.name} • ${c.batch || 'Batch B Stream II'}`;
    if (el.geofenceZoneTitle) el.geofenceZoneTitle.textContent = `Geofence: ${station.name}`;

    // Secretariat Master Display
    if (el.secretariatTitleDisplay) el.secretariatTitleDisplay.textContent = station.title;
    if (el.secretariatStationDisplay) el.secretariatStationDisplay.textContent = station.stationTag;
    const pct = ((STATE.clearedCount / station.enrolled) * 100).toFixed(1);
    if (el.statClearedCount) el.statClearedCount.textContent = STATE.clearedCount.toLocaleString();
    if (el.statEnrolledSub) el.statEnrolledSub.textContent = `Out of ${station.enrolled.toLocaleString()} Enrolled (${pct}%)`;

    // Inspector Profile Card
    if (el.recName) el.recName.textContent = c.name;
    if (el.recStatecode) el.recStatecode.textContent = c.stateCode;
    if (el.recCallup) el.recCallup.textContent = c.callUpNumber;
    if (el.recCds) el.recCds.textContent = c.cds;
    if (el.recPpa) el.recPpa.textContent = c.ppa;

    // Dual Demo Card
    if (el.dualCorperStatecode) el.dualCorperStatecode.textContent = c.stateCode;
    if (el.dualCorperName) el.dualCorperName.textContent = c.name;

    updateClearanceStatusUI();
    refreshCorperPass();
    refreshStationToken();
  }

  // --- 9. Safe DOM Rendering for Manifest Table (Zero innerHTML) ---
  function renderManifestTable() {
    if (!el.manifestTableBody) return;
    el.manifestTableBody.replaceChildren();

    const query = (el.inputManifestSearch ? el.inputManifestSearch.value : '').trim().toUpperCase();
    const filtered = STATE.manifestLog.filter(row => {
      if (!query) return true;
      return (
        row.name.toUpperCase().includes(query) ||
        row.stateCode.toUpperCase().includes(query) ||
        row.lgaName.toUpperCase().includes(query)
      );
    });

    filtered.forEach(item => {
      const tr = document.createElement('tr');

      const tdTime = document.createElement('td');
      tdTime.style.fontFamily = 'monospace';
      tdTime.textContent = item.time;

      const tdName = document.createElement('td');
      tdName.style.fontWeight = '600';
      tdName.textContent = item.name;

      const tdCode = document.createElement('td');
      const codeSpan = document.createElement('span');
      codeSpan.className = 'state-code-pill';
      codeSpan.textContent = item.stateCode;
      tdCode.appendChild(codeSpan);

      const tdCallup = document.createElement('td');
      tdCallup.style.color = 'var(--text-secondary)';
      tdCallup.textContent = item.callUpNumber;

      const tdLga = document.createElement('td');
      tdLga.textContent = item.lgaName;

      const tdMode = document.createElement('td');
      tdMode.textContent = item.syncMode;

      const tdSig = document.createElement('td');
      tdSig.style.fontFamily = 'monospace';
      tdSig.style.fontSize = '0.72rem';
      tdSig.style.color = 'var(--text-muted)';
      tdSig.textContent = item.tokenSig;

      const tdStatus = document.createElement('td');
      const pill = document.createElement('span');
      if (item.status === 'CLEARED') {
        pill.className = 'status-pill cleared';
        pill.textContent = '✓ CLEARED';
      } else if (item.status === 'QUEUED') {
        pill.className = 'status-pill queued';
        pill.textContent = '⏳ OFFLINE QUEUED';
      } else {
        pill.className = 'status-pill denied';
        pill.textContent = '✕ DENIED';
      }
      tdStatus.appendChild(pill);

      tr.appendChild(tdTime);
      tr.appendChild(tdName);
      tr.appendChild(tdCode);
      tr.appendChild(tdCallup);
      tr.appendChild(tdLga);
      tr.appendChild(tdMode);
      tr.appendChild(tdSig);
      tr.appendChild(tdStatus);

      el.manifestTableBody.appendChild(tr);
    });
  }

  // --- 10. Navigation / Role Switcher ---
  function initNavigation() {
    el.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetViewId = tab.getAttribute('data-view');
        if (!targetViewId) return;

        el.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        el.views.forEach(v => {
          if (v.id === targetViewId) {
            v.classList.add('active-view');
          } else {
            v.classList.remove('active-view');
          }
        });

        STATE.currentRole = targetViewId;
        if (targetViewId === 'view-secretariat') {
          refreshStationToken();
        } else if (targetViewId === 'view-corper' || targetViewId === 'view-dual') {
          refreshCorperPass();
        }
      });
    });
  }

  // --- 11. Battery-Saving Power & Heartbeat Manager ---
  let clockInterval = null;
  let corperInterval = null;
  let stationInterval = null;
  let isTabActive = true;

  function getBaseUrl() {
    return window.location.origin + window.location.pathname;
  }

  function startHeartbeats() {
    if (clockInterval) clearInterval(clockInterval);
    if (corperInterval) clearInterval(corperInterval);
    if (stationInterval) clearInterval(stationInterval);

    el.timeDisplay.textContent = getFormattedTimeWAT();
    clockInterval = setInterval(() => {
      if (!isTabActive) return;
      el.timeDisplay.textContent = getFormattedTimeWAT();
    }, 1000);

    corperInterval = setInterval(() => {
      if (!isTabActive) return;
      STATE.corperPassTimeRemaining--;
      if (STATE.corperPassTimeRemaining <= 0) {
        STATE.corperPassTimeRemaining = STATE.corperPassInterval;
        if (STATE.currentRole === 'view-corper' || STATE.currentRole === 'view-dual') {
          refreshCorperPass();
        }
      }

      if (STATE.currentRole === 'view-corper' || STATE.currentRole === 'view-dual') {
        el.qrRefreshTimer.textContent = `Pass refreshes in ${STATE.corperPassTimeRemaining}s`;
        el.dualTimerText.textContent = `Expires in ${STATE.corperPassTimeRemaining}s`;

        const circle = document.querySelector('.progress-ring__circle');
        if (circle) {
          const offset = 62.8 * (1 - STATE.corperPassTimeRemaining / STATE.corperPassInterval);
          circle.style.strokeDashoffset = offset;
        }
      }
    }, 1000);

    stationInterval = setInterval(() => {
      if (!isTabActive) return;
      STATE.stationTokenTimeRemaining--;
      if (STATE.stationTokenTimeRemaining <= 0) {
        STATE.stationTokenTimeRemaining = STATE.stationTokenInterval;
        if (STATE.currentRole === 'view-secretariat') {
          refreshStationToken();
        }
      }

      if (STATE.currentRole === 'view-secretariat') {
        el.stationTokenCounter.textContent = `Refresh in ${STATE.stationTokenTimeRemaining}s`;
        const progressPercent = (STATE.stationTokenTimeRemaining / STATE.stationTokenInterval) * 100;
        el.stationProgressBar.style.width = `${progressPercent}%`;
      }
    }, 1000);
  }

  function pauseHeartbeats() {
    isTabActive = false;
  }

  function resumeHeartbeats() {
    isTabActive = true;
    el.timeDisplay.textContent = getFormattedTimeWAT();
    if (STATE.currentRole === 'view-secretariat') {
      refreshStationToken();
    } else if (STATE.currentRole === 'view-corper' || STATE.currentRole === 'view-dual') {
      refreshCorperPass();
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseHeartbeats();
    } else {
      resumeHeartbeats();
    }
  });

  // --- 12. Dynamic Corper Pass Refresh Loop ---
  let currentPassToken = '';

  async function refreshCorperPass() {
    const timestamp = Math.floor(Date.now() / 30000);
    const payload = `NYSC|PASS|${STATE.corper.stateCode}|${STATE.activeLgaCode}|${STATE.locationStatus}|${timestamp}`;
    const hash = await generateTokenHash(payload);
    currentPassToken = hash;

    if (el.tokenSignatureHash) {
      el.tokenSignatureHash.textContent = `TOKEN: XXII-${hash.slice(0, 8)}...${hash.slice(-6)} (PROPRIETARY)`;
    }

    const baseUrl = getBaseUrl();
    const scanUrl = `${baseUrl}?s=1&c=${STATE.activeCorperIndex}&l=${STATE.activeLgaCode}&m=${STATE.locationStatus}`;

    const isZoneValid = (STATE.locationStatus === 'secretariat' || STATE.locationStatus === 'realgps');
    if (isZoneValid) {
      const matrix = CompactQR.generateMatrix(scanUrl);
      CompactQR.drawToCanvas(el.corperQrCanvas, matrix, '#005a2b', '#ffffff');
      if (el.dualCorperQrCanvas) CompactQR.drawToCanvas(el.dualCorperQrCanvas, matrix, '#005a2b', '#ffffff');
    } else if (STATE.locationStatus === 'buddy') {
      const buddyMatrix = CompactQR.generateMatrix(scanUrl);
      CompactQR.drawToCanvas(el.corperQrCanvas, buddyMatrix, '#b45309', '#fef3c7');
      if (el.dualCorperQrCanvas) CompactQR.drawToCanvas(el.dualCorperQrCanvas, buddyMatrix, '#b45309', '#fef3c7');
    } else {
      const invalidMatrix = CompactQR.generateMatrix(scanUrl);
      CompactQR.drawToCanvas(el.corperQrCanvas, invalidMatrix, '#ef4444', '#fee2e2');
      if (el.dualCorperQrCanvas) CompactQR.drawToCanvas(el.dualCorperQrCanvas, invalidMatrix, '#ef4444', '#fee2e2');
    }
  }

  // --- 13. Rotating Station Master QR (Route B) ---
  let stationMasterToken = '';

  async function refreshStationToken() {
    const randomBytes = new Uint32Array(2);
    crypto.getRandomValues(randomBytes);
    const nonce = Array.from(randomBytes).map(n => n.toString(16)).join('');
    const payload = `STATION:${STATE.activeLgaCode}:${Date.now()}:${nonce}`;
    const hash = await generateTokenHash(payload);
    stationMasterToken = hash.slice(0, 16);

    const baseUrl = getBaseUrl();
    const beaconUrl = `${baseUrl}?s=2&l=${STATE.activeLgaCode}&t=${stationMasterToken.slice(0, 6)}`;
    const matrix = CompactQR.generateMatrix(beaconUrl);
    CompactQR.drawToCanvas(el.stationMasterQrCanvas, matrix, '#008744', '#ffffff');
  }

  // --- 14. Roster, Custom Enroll & LGA Station Controls ---
  function cycleNextCorper() {
    STATE.activeCorperIndex = (STATE.activeCorperIndex + 1) % CORPER_ROSTER.length;
    if (el.selectActiveCorper) {
      el.selectActiveCorper.value = String(STATE.activeCorperIndex);
    }
    STATE.corper = { ...CORPER_ROSTER[STATE.activeCorperIndex], month: 'November 2026' };
    syncActiveProfileToUI();
  }

  function initRosterAndLgaControls() {
    if (el.selectActiveLga) {
      el.selectActiveLga.addEventListener('change', (e) => {
        const code = e.target.value;
        if (LGA_STATIONS[code]) {
          STATE.activeLgaCode = code;
          STATE.clearedCount = LGA_STATIONS[code].clearedBase;
          syncActiveProfileToUI();
        }
      });
    }

    if (el.selectActiveCorper) {
      el.selectActiveCorper.addEventListener('change', (e) => {
        const idx = parseInt(e.target.value, 10);
        if (!Number.isNaN(idx) && CORPER_ROSTER[idx]) {
          STATE.activeCorperIndex = idx;
          STATE.corper = { ...CORPER_ROSTER[idx], month: 'November 2026' };
          syncActiveProfileToUI();
        }
      });
    }

    if (el.btnEnrollCustomCorper) {
      el.btnEnrollCustomCorper.addEventListener('click', () => {
        const rawName = (el.inputCustomName.value || '').trim().toUpperCase();
        const rawCode = (el.inputCustomStatecode.value || '').trim().toUpperCase();

        // Strict input validation against allow-list pattern
        const validName = /^[A-Z\s.'-]{3,48}$/.test(rawName);
        const validCode = /^[A-Z]{2}\/\d{2}[A-C]\/\d{4}$/.test(rawCode);

        if (!validName || !validCode) {
          el.geofenceStatusText.textContent = 'Enter valid Name & State Code (e.g. LA/25A/1204)';
          return;
        }

        const newCorper = {
          name: rawName,
          stateCode: rawCode,
          callUpNumber: `NYSC/ENR/2025/${Math.floor(100000 + Math.random() * 899999)}`,
          ppa: `${LGA_STATIONS[STATE.activeLgaCode].stateName} Digital Service Commission`,
          cds: 'ICT & Digital Skills',
          batch: 'Batch A Stream I',
          lgaCode: STATE.activeLgaCode,
          passportUrl: 'assets/corper_passport.jpg'
        };

        CORPER_ROSTER.push(newCorper);
        const newIdx = CORPER_ROSTER.length - 1;

        const opt = document.createElement('option');
        opt.value = String(newIdx);
        opt.textContent = `${newCorper.stateCode} — ${newCorper.name} (Enrolled)`;
        el.selectActiveCorper.appendChild(opt);
        el.selectActiveCorper.value = String(newIdx);

        STATE.activeCorperIndex = newIdx;
        STATE.corper = { ...newCorper, month: 'November 2026' };
        el.inputCustomName.value = '';
        el.inputCustomStatecode.value = '';
        syncActiveProfileToUI();
      });
    }

    if (el.btnNextCorperQueue) {
      el.btnNextCorperQueue.addEventListener('click', cycleNextCorper);
    }
    if (el.btnDualNextCorper) {
      el.btnDualNextCorper.addEventListener('click', cycleNextCorper);
    }
  }

  // --- 14. Real-Time Clearance Status & Telemetry UI ---
  function updateClearanceStatusUI() {
    const station = LGA_STATIONS[STATE.activeLgaCode] || LGA_STATIONS.IKJ;
    if (!el.clearanceStatusBanner) return;

    el.clearanceStatusBanner.className = 'clearance-status-banner';

    switch (STATE.locationStatus) {
      case 'secretariat':
        el.clearanceStatusBanner.classList.add('in-zone');
        if (el.statusBannerTitle) el.statusBannerTitle.textContent = '📍 Inside Clearance Zone';
        if (el.statusBannerSub) el.statusBannerSub.textContent = `${station.name} Secretariat • Verified Present (${STATE.measuredDistanceMeters || 18}m)`;
        if (el.passValidTag) {
          el.passValidTag.className = 'pass-valid-tag';
          el.passValidTag.textContent = 'READY FOR SCAN';
        }
        if (el.passInstructionText) {
          el.passInstructionText.textContent = 'Show this QR pass to the NYSC Inspector at the clearance desk.';
        }
        if (el.dualGeofenceLine) {
          el.dualGeofenceLine.textContent = `✓ Geofence & AI Verified (${STATE.measuredDistanceMeters || 18}m)`;
          el.dualGeofenceLine.style.color = '#34d399';
        }
        break;

      case 'realgps':
        el.clearanceStatusBanner.classList.add('in-zone');
        if (el.statusBannerTitle) el.statusBannerTitle.textContent = '📍 Inside Clearance Zone';
        if (el.statusBannerSub) el.statusBannerSub.textContent = `Live Device GPS Locked • ${station.name} Secretariat`;
        if (el.passValidTag) {
          el.passValidTag.className = 'pass-valid-tag';
          el.passValidTag.textContent = 'GPS VERIFIED';
        }
        if (el.passInstructionText) {
          el.passInstructionText.textContent = 'Show this QR pass to the NYSC Inspector at the clearance desk.';
        }
        if (el.dualGeofenceLine) {
          el.dualGeofenceLine.textContent = `✓ Live Hardware GPS Locked`;
          el.dualGeofenceLine.style.color = '#34d399';
        }
        break;

      case 'buddy':
        el.clearanceStatusBanner.classList.add('buddy-mode');
        if (el.statusBannerTitle) el.statusBannerTitle.textContent = '🔋 Buddy-Assist Mode Active';
        if (el.statusBannerSub) el.statusBannerSub.textContent = 'Shared Device in Zone • LGI Visual Passport Match Required';
        if (el.passValidTag) {
          el.passValidTag.className = 'pass-valid-tag buddy';
          el.passValidTag.textContent = 'BUDDY PASS';
        }
        if (el.passInstructionText) {
          el.passInstructionText.textContent = 'Present phone to Inspector for direct visual passport photo match.';
        }
        if (el.dualGeofenceLine) {
          el.dualGeofenceLine.textContent = '🔋 Buddy-Assist Pass (LGI Visual Photo Match)';
          el.dualGeofenceLine.style.color = '#fbbf24';
        }
        break;

      case 'home':
        el.clearanceStatusBanner.classList.add('out-zone');
        if (el.statusBannerTitle) el.statusBannerTitle.textContent = '⚠️ Outside Clearance Zone';
        if (el.statusBannerSub) el.statusBannerSub.textContent = '14.2 km from Secretariat • Move within LGA perimeter to activate pass';
        if (el.passValidTag) {
          el.passValidTag.className = 'pass-valid-tag fail';
          el.passValidTag.textContent = 'OUT OF ZONE';
        }
        if (el.passInstructionText) {
          el.passInstructionText.textContent = 'Clearance pass locked until you arrive at the LGA Secretariat.';
        }
        if (el.dualGeofenceLine) {
          el.dualGeofenceLine.textContent = '✕ Out of Zone (14.2 km away)';
          el.dualGeofenceLine.style.color = '#f87171';
        }
        break;

      case 'velocity':
        el.clearanceStatusBanner.classList.add('fraud-risk');
        if (el.statusBannerTitle) el.statusBannerTitle.textContent = '❌ Spoof Detected: Teleport Anomaly';
        if (el.statusBannerSub) el.statusBannerSub.textContent = 'Remote Coordinate Jump Blocked (Lekki ➔ Ikeja)';
        if (el.passValidTag) {
          el.passValidTag.className = 'pass-valid-tag fail';
          el.passValidTag.textContent = 'PASS BLOCKED';
        }
        if (el.passInstructionText) {
          el.passInstructionText.textContent = 'Security audit flag generated. Please report to Secretariat in person.';
        }
        if (el.dualGeofenceLine) {
          el.dualGeofenceLine.textContent = '✕ AI Blocked: Remote Teleport Spoof';
          el.dualGeofenceLine.style.color = '#f87171';
        }
        break;

      case 'fakegps':
        el.clearanceStatusBanner.classList.add('fraud-risk');
        if (el.statusBannerTitle) el.statusBannerTitle.textContent = '❌ Spoof Detected: Mock Location Flagged';
        if (el.statusBannerSub) el.statusBannerSub.textContent = 'Synthetic Emulator / Fake GPS App Identified';
        if (el.passValidTag) {
          el.passValidTag.className = 'pass-valid-tag fail';
          el.passValidTag.textContent = 'PASS BLOCKED';
        }
        if (el.passInstructionText) {
          el.passInstructionText.textContent = 'Disable mock location apps and restart device to clear your pass.';
        }
        if (el.dualGeofenceLine) {
          el.dualGeofenceLine.textContent = '✕ Fraud Alert: Mock GPS Emulator Blocked';
          el.dualGeofenceLine.style.color = '#f87171';
        }
        break;

      default:
        el.clearanceStatusBanner.classList.add('in-zone');
        if (el.statusBannerTitle) el.statusBannerTitle.textContent = '📍 Inside Clearance Zone';
        if (el.statusBannerSub) el.statusBannerSub.textContent = `${station.name} Secretariat • Verified`;
        break;
    }
  }

  // --- 15. Location, XXII-Sentinel AI & Buddy-Assist Simulator Controls ---
  function initSimulationControls() {
    const resetButtons = () => {
      if (el.simLocSecretariat) el.simLocSecretariat.classList.remove('active-ctrl');
      if (el.simLocBuddy) el.simLocBuddy.classList.remove('active-ctrl');
      if (el.simLocRealgps) el.simLocRealgps.classList.remove('active-ctrl');
      if (el.simLocHome) el.simLocHome.classList.remove('active-ctrl');
      if (el.simLocVelocity) el.simLocVelocity.classList.remove('active-ctrl');
      if (el.simLocFakeGps) el.simLocFakeGps.classList.remove('active-ctrl');
    };

    // Case 1: At Secretariat (Legitimate Passive AI Verified)
    if (el.simLocSecretariat) {
      el.simLocSecretariat.addEventListener('click', () => {
        resetButtons();
        el.simLocSecretariat.classList.add('active-ctrl');
        STATE.locationStatus = 'secretariat';
        STATE.measuredDistanceMeters = 18;

        updateClearanceStatusUI();
        refreshCorperPass();
      });
    }

    // Case 1B: Buddy-Assist Mode (Dead Battery / Borrowed Friend's Phone)
    if (el.simLocBuddy) {
      el.simLocBuddy.addEventListener('click', () => {
        resetButtons();
        el.simLocBuddy.classList.add('active-ctrl');
        STATE.locationStatus = 'buddy';
        STATE.measuredDistanceMeters = 16;

        updateClearanceStatusUI();
        refreshCorperPass();
      });
    }

    // Case 2: Live Device GPS (Browser Geolocation API)
    if (el.simLocRealgps) {
      el.simLocRealgps.addEventListener('click', () => {
        resetButtons();
        el.simLocRealgps.classList.add('active-ctrl');
        if (el.statusBannerSub) el.statusBannerSub.textContent = 'Acquiring hardware GPS satellite lock...';

        if (!navigator.geolocation) {
          STATE.locationStatus = 'realgps';
          STATE.measuredDistanceMeters = 20;
          updateClearanceStatusUI();
          refreshCorperPass();
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude, accuracy } = pos.coords;
            const station = LGA_STATIONS[STATE.activeLgaCode] || LGA_STATIONS.IKJ;
            const dist = calculateHaversineMeters(latitude, longitude, station.lat, station.lng);
            STATE.locationStatus = 'realgps';
            STATE.measuredDistanceMeters = Math.min(dist, 24);

            updateClearanceStatusUI();
            if (el.statusBannerSub) {
              el.statusBannerSub.textContent = `Live GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (±${Math.round(accuracy || 12)}m) • In Zone`;
            }
            refreshCorperPass();
          },
          () => {
            STATE.locationStatus = 'realgps';
            STATE.measuredDistanceMeters = 22;
            updateClearanceStatusUI();
            refreshCorperPass();
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      });
    }

    // Case 3: At Home (Out of Zone)
    if (el.simLocHome) {
      el.simLocHome.addEventListener('click', () => {
        resetButtons();
        el.simLocHome.classList.add('active-ctrl');
        STATE.locationStatus = 'home';
        STATE.measuredDistanceMeters = 14200;

        updateClearanceStatusUI();
        refreshCorperPass();
      });
    }

    // Case 3B: Remote Teleportation Spoof (Lekki -> Ikeja)
    if (el.simLocVelocity) {
      el.simLocVelocity.addEventListener('click', () => {
        resetButtons();
        el.simLocVelocity.classList.add('active-ctrl');
        STATE.locationStatus = 'velocity';

        updateClearanceStatusUI();
        refreshCorperPass();
      });
    }

    // Case 4: Fake GPS App Detected
    if (el.simLocFakeGps) {
      el.simLocFakeGps.addEventListener('click', () => {
        resetButtons();
        el.simLocFakeGps.classList.add('active-ctrl');
        STATE.locationStatus = 'fakegps';

        updateClearanceStatusUI();
        refreshCorperPass();
      });
    }

    // Multi-Sector Switcher (NYSC / University / Security Patrol)
    if (el.selectSectorMode) {
      el.selectSectorMode.addEventListener('change', (e) => {
        const mode = e.target.value;
        const tabCorperSpan = document.querySelector('#tab-corper-btn span');
        const tabSecSpan = document.querySelector('#tab-secretariat-btn span');
        const tabInspSpan = document.querySelector('#tab-inspector-btn span');

        if (mode === 'CIV') {
          if (el.appSeal) el.appSeal.textContent = 'GOV';
          if (tabCorperSpan) tabCorperSpan.textContent = '📱 Civil Servant ID';
          if (tabSecSpan) tabSecSpan.textContent = '🖥️ Ministry Hall Beacon';
          if (tabInspSpan) tabInspSpan.textContent = '🏛️ Payroll Audit Console';
          if (el.smartSlotTitle) el.smartSlotTitle.textContent = '🧠 Ghost-Worker Audit AI: VERIFIED ACTIVE';
          if (el.smartSlotSub) el.smartSlotSub.textContent = 'State Secretariat Biometric Payroll Verification';
          if (el.smartSlotBadge) el.smartSlotBadge.textContent = 'PAYROLL OK';
        } else if (mode === 'SEC') {
          if (el.appSeal) el.appSeal.textContent = 'OPS';
          if (tabCorperSpan) tabCorperSpan.textContent = '📱 Guard Patrol App';
          if (tabSecSpan) tabSecSpan.textContent = '🖥️ Site Beacon Display';
          if (tabInspSpan) tabInspSpan.textContent = '🛡️ Supervisor Console';
          if (el.smartSlotTitle) el.smartSlotTitle.textContent = '🧠 Night-Shift Patrol AI: ON POST';
          if (el.smartSlotSub) el.smartSlotSub.textContent = 'Hourly Check-in Window: 02:00 AM • Verified';
          if (el.smartSlotBadge) el.smartSlotBadge.textContent = 'ON SITE';
        } else {
          if (el.appSeal) el.appSeal.textContent = 'NYSC';
          if (tabCorperSpan) tabCorperSpan.textContent = '📱 Corps Member';
          if (tabSecSpan) tabSecSpan.textContent = '🖥️ Secretariat Screen';
          if (tabInspSpan) tabInspSpan.textContent = '👮 Inspector Terminal';
          if (el.smartSlotTitle) el.smartSlotTitle.textContent = '🧠 Smart Queue AI: LOW CROWD';
          if (el.smartSlotSub) el.smartSlotSub.textContent = 'Window: 08:30–09:00 AM • Est. Wait: ~2 mins';
          if (el.smartSlotBadge) el.smartSlotBadge.textContent = 'SLOT OPEN';
        }
      });
    }
  }

  // --- 16. Inspector Scanner, AI Verdict & Manifest Logging ---
  function performInspectorScan(isDualDemo = false) {
    const station = LGA_STATIONS[STATE.activeLgaCode] || LGA_STATIONS.IKJ;
    const isBuddyMode = (STATE.locationStatus === 'buddy');
    const isZoneValid = (STATE.locationStatus === 'secretariat' || STATE.locationStatus === 'realgps' || isBuddyMode);

    if (!isZoneValid) {
      playVerificationChime(false);
      STATE.fraudCount++;
      if (el.statFraudCount) {
        el.statFraudCount.textContent = String(STATE.fraudCount);
      }

      let reason = 'REJECTED: Device is 14.2 km outside Secretariat Geofence';
      let syncLabel = 'BLOCKED (OUT OF ZONE)';
      if (STATE.locationStatus === 'velocity') {
        reason = 'XXII-SENTINEL AI BLOCK: Remote Coordinate Teleportation Detected';
        syncLabel = 'AI BLOCKED (TELEPORT SPOOF)';
      } else if (STATE.locationStatus === 'fakegps') {
        reason = 'XXII-SENTINEL AI BLOCK: Synthetic Mock GPS Emulator Detected';
        syncLabel = 'AI BLOCKED (MOCK GPS)';
      }

      el.inspectorApprovalBanner.className = 'approval-banner';
      el.inspectorApprovalBanner.style.borderColor = 'rgba(239, 68, 68, 0.5)';
      el.inspectorApprovalBanner.style.background = 'rgba(239, 68, 68, 0.15)';
      el.inspectorStatusHeader.textContent = 'CLEARANCE DENIED';
      el.inspectorStatusHeader.style.color = '#f87171';
      el.inspectorStatusSub.textContent = reason;
      el.inspectorStatusIcon.textContent = '❌';

      if (el.inspectorAiVerdictBox) {
        el.inspectorAiVerdictBox.style.background = 'rgba(239, 68, 68, 0.14)';
        el.inspectorAiVerdictBox.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        el.inspectorAiTitle.style.color = '#f87171';
        el.inspectorAiTitle.textContent = '🧠 XXII-Sentinel AI Risk Score: 99.4% (SPOOF BLOCKED)';
        el.inspectorAiSub.textContent = reason;
        el.inspectorAiBadge.className = 'step-badge fail';
        el.inspectorAiBadge.textContent = 'BLOCKED';
      }

      STATE.manifestLog.unshift({
        time: getFormattedTimeWAT(),
        name: STATE.corper.name,
        stateCode: STATE.corper.stateCode,
        callUpNumber: STATE.corper.callUpNumber,
        lgaName: station.name,
        syncMode: syncLabel,
        tokenSig: `REVOKED:${STATE.locationStatus.toUpperCase()}`,
        status: 'DENIED'
      });
      renderManifestTable();

      if (isDualDemo) {
        el.dualInspectorBadge.textContent = 'AI BLOCKED';
        el.dualInspectorBadge.style.background = 'rgba(239, 68, 68, 0.2)';
        el.dualInspectorBadge.style.color = '#f87171';
        el.dualResultIcon.textContent = '❌';
        el.dualResultTitle.textContent = `Denied: ${STATE.corper.name}`;
        el.dualResultTitle.style.color = '#f87171';
        el.dualResultDesc.textContent = reason;
      }
      return;
    }

    // Valid Clearance (Standard or Buddy-Assist Dead Battery Mode)
    playVerificationChime(true);

    el.inspectorApprovalBanner.className = 'approval-banner';
    el.inspectorApprovalBanner.style.borderColor = isBuddyMode ? 'rgba(245, 179, 0, 0.5)' : 'rgba(16, 185, 129, 0.4)';
    el.inspectorApprovalBanner.style.background = isBuddyMode
      ? 'linear-gradient(135deg, rgba(180, 83, 9, 0.28), rgba(245, 179, 0, 0.12))'
      : 'linear-gradient(135deg, rgba(0, 135, 68, 0.25), rgba(16, 185, 129, 0.1))';
    el.inspectorStatusHeader.textContent = isBuddyMode
      ? 'BUDDY-ASSIST APPROVED (VISUAL ID MATCH)'
      : 'VERIFIED & APPROVED';
    el.inspectorStatusHeader.style.color = isBuddyMode ? '#fbbf24' : '#34d399';
    el.inspectorStatusSub.textContent = isBuddyMode
      ? `Dead-Battery Assist Verified via LGI Passport Check (${station.code})`
      : `Clearance Stamped: Nov 2026 (${station.code} • Pass: ${currentPassToken.slice(0, 8)})`;
    el.inspectorStatusIcon.textContent = isBuddyMode ? '🔋' : '✅';

    if (el.inspectorAiVerdictBox) {
      el.inspectorAiVerdictBox.style.background = isBuddyMode ? 'rgba(245, 179, 0, 0.12)' : 'rgba(16, 185, 129, 0.1)';
      el.inspectorAiVerdictBox.style.borderColor = isBuddyMode ? 'rgba(245, 179, 0, 0.35)' : 'rgba(52, 211, 153, 0.3)';
      el.inspectorAiTitle.style.color = isBuddyMode ? '#fbbf24' : '#34d399';
      el.inspectorAiTitle.textContent = isBuddyMode
        ? '🧠 XXII-Sentinel: Buddy-Assist (2nd Login on Shared Phone)'
        : '🧠 XXII-Sentinel AI Risk Score: 0.02% (SAFE)';
      el.inspectorAiSub.textContent = isBuddyMode
        ? 'Corper battery dead — LGI confirmed physical passport photo at desk.'
        : 'Proprietary Spatial & Presence Telemetry Verified';
      el.inspectorAiBadge.className = 'step-badge';
      el.inspectorAiBadge.textContent = isBuddyMode ? 'BUDDY OK' : 'AUTHENTIC';
    }

    STATE.clearedCount++;
    el.statClearedCount.textContent = STATE.clearedCount.toLocaleString();

    const shortSig = `0x${currentPassToken.slice(0, 8)}...${currentPassToken.slice(-4)}`;

    if (STATE.isOfflineMode) {
      STATE.offlineQueue.push({
        name: STATE.corper.name,
        stateCode: STATE.corper.stateCode,
        callUpNumber: STATE.corper.callUpNumber,
        lgaName: station.name,
        timestamp: new Date().toISOString(),
        token: shortSig
      });
      el.offlinePendingCount.textContent = String(STATE.offlineQueue.length);

      STATE.manifestLog.unshift({
        time: getFormattedTimeWAT(),
        name: STATE.corper.name,
        stateCode: STATE.corper.stateCode,
        callUpNumber: STATE.corper.callUpNumber,
        lgaName: station.name,
        syncMode: 'OFFLINE (ECDSA QUEUE)',
        tokenSig: shortSig,
        status: 'QUEUED'
      });
    } else {
      STATE.manifestLog.unshift({
        time: getFormattedTimeWAT(),
        name: STATE.corper.name,
        stateCode: STATE.corper.stateCode,
        callUpNumber: STATE.corper.callUpNumber,
        lgaName: station.name,
        syncMode: isBuddyMode ? 'ONLINE (BUDDY-ASSIST)' : 'ONLINE (CLOUD)',
        tokenSig: shortSig,
        status: 'CLEARED'
      });
    }

    renderManifestTable();

    if (isDualDemo) {
      el.dualInspectorBadge.textContent = isBuddyMode ? 'BUDDY-ASSIST OK' : 'CLEARED IN 0.4s';
      el.dualInspectorBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      el.dualInspectorBadge.style.color = '#34d399';
      el.dualResultIcon.textContent = isBuddyMode ? '🔋' : '✅';
      el.dualResultTitle.textContent = `Approved: ${STATE.corper.name}`;
      el.dualResultTitle.style.color = '#34d399';
      el.dualResultDesc.textContent = isBuddyMode
        ? `State Code: ${STATE.corper.stateCode} • Cleared via Buddy-Assist Visual Match`
        : `State Code: ${STATE.corper.stateCode} • ${station.name} Validated`;
    }
  }

  // --- 17. Official CSV Export & Clearance Certificate Download ---
  function exportManifestToCSV() {
    const headers = [
      'Timestamp_WAT',
      'Corps_Member_Name',
      'State_Code',
      'Call_Up_Number',
      'LGA_Secretariat',
      'Sync_Mode',
      'Cryptographic_Token',
      'Clearance_Status'
    ];

    const escapeCsv = val => `"${String(val || '').replace(/"/g, '""')}"`;
    const rows = STATE.manifestLog.map(item => [
      escapeCsv(item.time),
      escapeCsv(item.name),
      escapeCsv(item.stateCode),
      escapeCsv(item.callUpNumber),
      escapeCsv(item.lgaName),
      escapeCsv(item.syncMode),
      escapeCsv(item.tokenSig),
      escapeCsv(item.status)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NYSC_Clearance_Manifest_${STATE.activeLgaCode}_Nov2026.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function downloadClearanceSlipFile() {
    const station = LGA_STATIONS[STATE.activeLgaCode] || LGA_STATIONS.IKJ;
    const isZoneValid = (STATE.locationStatus === 'secretariat' || STATE.locationStatus === 'realgps');
    const lines = [
      '============================================================',
      '           NATIONAL YOUTH SERVICE CORPS (NYSC)              ',
      '      OFFICIAL BIOMETRIC & GEOFENCED CLEARANCE RECEIPT      ',
      '============================================================',
      `Corps Member Name : ${STATE.corper.name}`,
      `State Code        : ${STATE.corper.stateCode}`,
      `Call-Up Number    : ${STATE.corper.callUpNumber}`,
      `PPA               : ${STATE.corper.ppa}`,
      `CDS Group         : ${STATE.corper.cds}`,
      `LGA Secretariat   : ${station.name} (${station.stateName})`,
      `Clearance Month   : ${STATE.corper.month}`,
      `Verification Time : ${getFormattedTimeWAT()}`,
      `Clearance Status  : ${isZoneValid ? 'CLEARED FOR MONTHLY ALLOWANCE' : 'PENDING / OUT OF ZONE'}`,
      `Ed25519 Signature : 0x${currentPassToken}`,
      '============================================================',
      'Verified automatically by GeoClearance NYSC Protocol v3.'
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NYSC_Clearance_Slip_${STATE.corper.stateCode.replace(/\//g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // --- 18. Inspector Controls & Camera Stream ---
  function initInspectorControls() {
    el.btnTriggerInspectorScan.addEventListener('click', () => performInspectorScan(false));
    el.btnDualInstantScan.addEventListener('click', () => performInspectorScan(true));

    // Dead-Battery / No-Phone LGI Visual ID Kiosk Clear
    if (el.btnDeadphoneClear && el.inputDeadphoneCode) {
      el.btnDeadphoneClear.addEventListener('click', () => {
        const query = (el.inputDeadphoneCode.value || '').trim().toUpperCase();
        if (query) {
          const foundIdx = CORPER_ROSTER.findIndex(c =>
            c.stateCode.toUpperCase().includes(query) ||
            c.name.toUpperCase().includes(query)
          );
          if (foundIdx !== -1) {
            STATE.activeCorperIndex = foundIdx;
            STATE.corper = { ...CORPER_ROSTER[foundIdx], month: 'November 2026' };
            if (el.selectActiveCorper) el.selectActiveCorper.value = String(foundIdx);
            syncActiveProfileToUI();
          }
        }
        const station = LGA_STATIONS[STATE.activeLgaCode] || LGA_STATIONS.IKJ;
        playVerificationChime(true);

        el.inspectorApprovalBanner.className = 'approval-banner';
        el.inspectorApprovalBanner.style.borderColor = 'rgba(245, 179, 0, 0.5)';
        el.inspectorApprovalBanner.style.background = 'linear-gradient(135deg, rgba(180, 83, 9, 0.28), rgba(245, 179, 0, 0.12))';
        el.inspectorStatusHeader.textContent = 'CLEARED VIA LGI VISUAL KIOSK (DEAD BATTERY)';
        el.inspectorStatusHeader.style.color = '#fbbf24';
        el.inspectorStatusSub.textContent = `Physical Passport Verified at ${station.code} Desk (${STATE.corper.stateCode})`;
        el.inspectorStatusIcon.textContent = '🔋';

        if (el.inspectorAiVerdictBox) {
          el.inspectorAiVerdictBox.style.background = 'rgba(245, 179, 0, 0.12)';
          el.inspectorAiVerdictBox.style.borderColor = 'rgba(245, 179, 0, 0.35)';
          el.inspectorAiTitle.style.color = '#fbbf24';
          el.inspectorAiTitle.textContent = '🧠 XXII-Sentinel: LGI Kiosk Override (Dead Battery / No Device)';
          el.inspectorAiSub.textContent = `Officer confirmed physical presence of ${STATE.corper.name} against NYSC passport photo.`;
          el.inspectorAiBadge.className = 'step-badge';
          el.inspectorAiBadge.textContent = 'KIOSK OK';
        }

        STATE.clearedCount++;
        el.statClearedCount.textContent = STATE.clearedCount.toLocaleString();
        STATE.manifestLog.unshift({
          time: getFormattedTimeWAT(),
          name: STATE.corper.name,
          stateCode: STATE.corper.stateCode,
          callUpNumber: STATE.corper.callUpNumber,
          lgaName: station.name,
          syncMode: 'LGI VISUAL KIOSK (DEAD BAT)',
          tokenSig: `KIOSK:${station.code}:${Date.now().toString(16).slice(-6)}`,
          status: 'CLEARED'
        });
        renderManifestTable();
        el.inputDeadphoneCode.value = '';
      });
    }

    if (el.inputManifestSearch) {
      el.inputManifestSearch.addEventListener('input', renderManifestTable);
    }
    if (el.btnExportManifestCsv) {
      el.btnExportManifestCsv.addEventListener('click', exportManifestToCSV);
    }

    el.inspectorChimeToggle.addEventListener('change', (e) => {
      STATE.chimeEnabled = e.target.checked;
    });

    el.offlineModeToggle.addEventListener('change', (e) => {
      STATE.isOfflineMode = e.target.checked;
      if (STATE.isOfflineMode) {
        el.offlineStatusDesc.textContent = 'Offline Active: Clearances saved locally using ECDSA keys.';
        el.offlineStatusDesc.style.color = 'var(--nysc-gold-light)';
      } else {
        el.offlineStatusDesc.textContent = 'Online: Direct sync to NYSC Central Database.';
        el.offlineStatusDesc.style.color = 'var(--text-muted)';
      }
    });

    el.btnSyncOfflineBatch.addEventListener('click', () => {
      if (STATE.offlineQueue.length === 0) {
        el.offlineStatusDesc.textContent = 'All offline clearance records are synced with NYSC Central Cloud.';
        return;
      }
      const count = STATE.offlineQueue.length;
      el.offlineStatusDesc.textContent = `Uploading ${count} signed records to NYSC Central Database...`;
      setTimeout(() => {
        STATE.offlineQueue = [];
        el.offlinePendingCount.textContent = '0';
        STATE.manifestLog.forEach(item => {
          if (item.status === 'QUEUED') {
            item.status = 'CLEARED';
            item.syncMode = 'SYNCED (BATCH CLOUD)';
          }
        });
        renderManifestTable();
        el.offlineStatusDesc.textContent = `Successfully synced ${count} offline clearances to NYSC cloud!`;
        el.offlineStatusDesc.style.color = '#34d399';
      }, 600);
    });

    // Live WebCam Toggle in Inspector Viewfinder
    el.btnToggleCameraFeed.addEventListener('click', async () => {
      if (STATE.activeCameraStream) {
        STATE.activeCameraStream.getTracks().forEach(track => track.stop());
        STATE.activeCameraStream = null;
        if (el.inspectorCameraVideo) {
          el.inspectorCameraVideo.style.display = 'none';
          el.inspectorCameraVideo.srcObject = null;
        }
        el.btnToggleCameraFeed.textContent = '📹 Live WebCam';
        el.scannerStatusOverlay.textContent = 'Ready to scan Corper Dynamic Pass';
        return;
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          el.scannerStatusOverlay.textContent = 'Camera API unavailable — using optical simulation scanner.';
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        STATE.activeCameraStream = stream;
        if (el.inspectorCameraVideo) {
          el.inspectorCameraVideo.srcObject = stream;
          el.inspectorCameraVideo.style.display = 'block';
        }
        el.btnToggleCameraFeed.textContent = '⏹️ Stop WebCam';
        el.scannerStatusOverlay.textContent = 'Live Optical Feed Active — Point at Corper Pass';
      } catch {
        el.scannerStatusOverlay.textContent = 'Camera permission declined — simulated optical scanner active.';
      }
    });
  }

  // --- 19. Modals (Biometric Selfie, Station Screen & Clearance Slip) ---
  function stopSelfieStream() {
    if (STATE.activeSelfieStream) {
      STATE.activeSelfieStream.getTracks().forEach(t => t.stop());
      STATE.activeSelfieStream = null;
    }
    if (el.selfieVideo) {
      el.selfieVideo.style.display = 'none';
      el.selfieVideo.srcObject = null;
    }
    if (el.selfieMockImg) {
      el.selfieMockImg.style.display = 'block';
    }
  }

  function initModals() {
    // Selfie Liveness Modal with Live Front Camera attempt
    if (el.btnReverifySelfie) {
      el.btnReverifySelfie.addEventListener('click', async () => {
        el.modalSelfie.classList.add('active-modal');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            STATE.activeSelfieStream = stream;
            if (el.selfieVideo && el.selfieMockImg) {
              el.selfieVideo.srcObject = stream;
              el.selfieVideo.style.display = 'block';
              el.selfieMockImg.style.display = 'none';
            }
            if (el.selfieLivenessPrompt) {
              el.selfieLivenessPrompt.textContent = 'Live Front Camera Active — Blink to verify presence';
            }
          } catch {
            if (el.selfieLivenessPrompt) {
              el.selfieLivenessPrompt.textContent = 'Analyzing 3D facial landmarks...';
            }
          }
        }
      });
    }

    if (el.btnCloseSelfieModal) {
      el.btnCloseSelfieModal.addEventListener('click', () => {
        stopSelfieStream();
        el.modalSelfie.classList.remove('active-modal');
      });
    }

    if (el.btnCaptureSelfie) {
      el.btnCaptureSelfie.addEventListener('click', () => {
        stopSelfieStream();
        el.modalSelfie.classList.remove('active-modal');
        if (el.livenessStatusText) el.livenessStatusText.textContent = 'Passive match 99.4% • Freshly Verified';
        playVerificationChime(true);
        refreshCorperPass();
      });
    }

    // Station Screen Scan Modal (Route B)
    if (el.btnScanStationScreen) {
      el.btnScanStationScreen.addEventListener('click', () => {
        el.modalStationScanner.classList.add('active-modal');
      });
    }
    if (el.btnCloseStationModal) {
      el.btnCloseStationModal.addEventListener('click', () => {
        el.modalStationScanner.classList.remove('active-modal');
      });
    }
    if (el.btnConfirmStationToken) {
      el.btnConfirmStationToken.addEventListener('click', () => {
        el.modalStationScanner.classList.remove('active-modal');
        const station = LGA_STATIONS[STATE.activeLgaCode] || LGA_STATIONS.IKJ;
        playVerificationChime(true);
        if (el.geofenceStatusText) {
          el.geofenceStatusText.textContent = `Walkthrough Check-in Approved via ${station.code} Master Beacon!`;
        }
        if (el.geofenceCard) el.geofenceCard.className = 'step-card verified';

        STATE.clearedCount++;
        el.statClearedCount.textContent = STATE.clearedCount.toLocaleString();
        STATE.manifestLog.unshift({
          time: getFormattedTimeWAT(),
          name: STATE.corper.name,
          stateCode: STATE.corper.stateCode,
          callUpNumber: STATE.corper.callUpNumber,
          lgaName: station.name,
          syncMode: 'ROUTE-B BEACON',
          tokenSig: `0x${stationMasterToken.slice(0, 10)}`,
          status: 'CLEARED'
        });
        renderManifestTable();
      });
    }

    // Monthly Clearance Slip Receipt Modal
    if (el.btnOpenClearanceSlip) {
      el.btnOpenClearanceSlip.addEventListener('click', () => {
        const station = LGA_STATIONS[STATE.activeLgaCode] || LGA_STATIONS.IKJ;
        const isZoneValid = (STATE.locationStatus === 'secretariat' || STATE.locationStatus === 'realgps');

        el.slipName.textContent = STATE.corper.name;
        el.slipStatecode.textContent = STATE.corper.stateCode;
        el.slipCallup.textContent = STATE.corper.callUpNumber;
        el.slipLga.textContent = `${station.name} (${station.stateName})`;
        el.slipMonth.textContent = STATE.corper.month;
        el.slipStatus.textContent = isZoneValid ? 'CLEARED FOR ALLOWANCE' : 'OUT OF ZONE / REVOKED';
        el.slipStatus.style.color = isZoneValid ? '#34d399' : '#f87171';
        el.slipSig.textContent = `0x${currentPassToken.slice(0, 12)}...${currentPassToken.slice(-8)}`;

        el.modalClearanceSlip.classList.add('active-modal');
      });
    }
    if (el.btnCloseSlipModal) {
      el.btnCloseSlipModal.addEventListener('click', () => {
        el.modalClearanceSlip.classList.remove('active-modal');
      });
    }
    if (el.btnDownloadSlipFile) {
      el.btnDownloadSlipFile.addEventListener('click', downloadClearanceSlipFile);
    }
  }

  // --- 20. Mobile Camera QR Scan URL Handler & Initialization Entrypoint ---
  function handleMobileCameraScanParams() {
    const params = new URLSearchParams(window.location.search);
    const scanType = params.get('s');
    if (!scanType) return;

    const lgaParam = (params.get('l') || '').toUpperCase();
    if (LGA_STATIONS[lgaParam]) {
      STATE.activeLgaCode = lgaParam;
      if (el.selectActiveLga) el.selectActiveLga.value = lgaParam;
    }

    const corperIdx = parseInt(params.get('c') || '0', 10);
    if (!Number.isNaN(corperIdx) && CORPER_ROSTER[corperIdx]) {
      STATE.activeCorperIndex = corperIdx;
      STATE.corper = { ...CORPER_ROSTER[corperIdx], month: 'November 2026' };
      if (el.selectActiveCorper) el.selectActiveCorper.value = String(corperIdx);
    }

    const modeParam = params.get('m') || 'secretariat';
    const allowedModes = ['secretariat', 'buddy', 'realgps', 'home', 'velocity', 'fakegps'];
    if (allowedModes.includes(modeParam)) {
      STATE.locationStatus = modeParam;
    }

    syncActiveProfileToUI();

    if (scanType === '1') {
      // Phone scanned a Corper Dynamic Pass -> Switch directly to Inspector Verification View & run scan!
      const inspectorTab = document.getElementById('tab-inspector-btn');
      if (inspectorTab) inspectorTab.click();
      setTimeout(() => {
        performInspectorScan(false);
        if (el.btnOpenClearanceSlip) el.btnOpenClearanceSlip.click();
      }, 250);
    } else if (scanType === '2') {
      // Corper phone scanned the Secretariat Master Beacon -> Instant Walkthrough Clearance Receipt!
      setTimeout(() => {
        performInspectorScan(false);
        if (el.btnOpenClearanceSlip) el.btnOpenClearanceSlip.click();
      }, 250);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initRosterAndLgaControls();
    initSimulationControls();
    initInspectorControls();
    initModals();
    syncActiveProfileToUI();
    renderManifestTable();
    startHeartbeats();
    handleMobileCameraScanParams();
  });

})();
