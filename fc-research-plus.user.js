
// ==UserScript==
// @name         FCResearch Plus - GRU8
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Escaneia até 20 totes extraindo dados do inventário
// @author       silvlucz
// @match        https://qifcr.na.aftx.amazonoperations.app/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Roboto+Mono:wght@500&display=swap');

        :root {
            --fp-primary: #ff9900;
            --fp-primary-hover: #e88b00;
            --fp-primary-gradient: linear-gradient(135deg, #ff9900, #ffb84d);
            --fp-header: #232f3e;
            --fp-bg: #ffffff;
            --fp-bg-body: #f8f9fb;
            --fp-bg-input: #f8fafc;
            --fp-border: #e2e8f0;
            --fp-border-dark: #cbd5e1;
            --fp-text: #334155;
            --fp-text-label: #4a5568;
            --fp-text-secondary: #64748b;
            --fp-success: #22c55e;
            --fp-success-bg: #f0fdf4;
            --fp-success-border: #bbf7d0;
            --fp-error: #ef4444;
            --fp-error-bg: #fef2f2;
            --fp-error-border: #fecaca;
            --fp-warning: #ff9900;
            --fp-warning-bg: #fff8ee;
            --fp-warning-border: #ffd580;
            --fp-gray-bg: #f1f5f9;
            --fp-gray-border: #cbd5e1;
            --fp-yellow-bg: #fffbeb;
            --fp-yellow-border: #fde68a;
            --fp-font: 'Outfit', sans-serif;
            --fp-mono: 'Roboto Mono', monospace;
            --fp-radius: 14px;
            --fp-radius-sm: 10px;
            --fp-transition: 0.25s ease;
        }

        #fp-fab {
            position: fixed; bottom: 28px; right: 28px;
            width: 62px; height: 62px; border-radius: 50%;
            background: var(--fp-primary-gradient);
            border: 3px solid var(--fp-header);
            box-shadow: 0 4px 18px rgba(0,0,0,0.25);
            cursor: pointer; z-index: 2147483647;
            display: flex; align-items: center; justify-content: center;
            transition: transform var(--fp-transition), box-shadow var(--fp-transition);
            font-size: 26px; color: var(--fp-header); user-select: none;
        }
        #fp-fab:hover { transform: scale(1.12) rotate(5deg); box-shadow: 0 6px 24px rgba(0,0,0,0.35); }

        #fp-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.45);
            backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            z-index: 2147483640; display: none;
            animation: fp-fade-in 0.25s ease;
        }
        @keyframes fp-fade-in { from { opacity: 0; } to { opacity: 1; } }

        #fp-panel {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 740px; max-height: 90vh;
            border-radius: 18px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            display: none; flex-direction: column;
            z-index: 2147483645; font-family: var(--fp-font);
            color: var(--fp-text); overflow: hidden;
            background: var(--fp-bg);
            animation: fp-scale-in 0.3s ease;
        }
        @keyframes fp-scale-in {
            from { opacity:0; transform: translate(-50%,-50%) scale(0.95); }
            to { opacity:1; transform: translate(-50%,-50%) scale(1); }
        }

        #fp-header-bar {
            background: var(--fp-header); color: #fff;
            padding: 18px 24px;
            border-bottom: 3px solid var(--fp-primary);
            display: flex; align-items: center; justify-content: space-between;
            flex-shrink: 0;
        }
        #fp-header-bar .fp-title { font-weight: 800; font-size: 17px; display: flex; align-items: center; gap: 10px; }
        #fp-header-bar .fp-badge { background: var(--fp-primary); color: var(--fp-header); font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
        #fp-header-bar .fp-close-btn { background: transparent; border: none; color: #fff; opacity: 0.7; cursor: pointer; font-size: 20px; padding: 4px 8px; border-radius: 6px; transition: all var(--fp-transition); }
        #fp-header-bar .fp-close-btn:hover { opacity: 1; background: rgba(255,255,255,0.12); }

        #fp-body { padding: 24px; overflow-y: auto; background: var(--fp-bg-body); flex: 1; }
        #fp-body::-webkit-scrollbar { width: 6px; }
        #fp-body::-webkit-scrollbar-track { background: transparent; }
        #fp-body::-webkit-scrollbar-thumb { background: var(--fp-border-dark); border-radius: 3px; }

        .fp-section { background: var(--fp-bg); border: 1px solid var(--fp-border); border-radius: var(--fp-radius); padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); margin-bottom: 18px; }
        .fp-section-label { font-size: 12px; font-weight: 700; color: var(--fp-text-label); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px; }

        .fp-textarea { width: 100%; box-sizing: border-box; border: 1.5px solid var(--fp-border-dark); border-radius: var(--fp-radius-sm); padding: 12px 14px; font-family: var(--fp-mono); font-size: 13px; color: var(--fp-text); background: var(--fp-bg-input); transition: border-color var(--fp-transition), box-shadow var(--fp-transition); outline: none; resize: vertical; min-height: 72px; }
        .fp-textarea:focus { border-color: var(--fp-primary); box-shadow: 0 0 0 3px rgba(255,153,0,0.15); }
        .fp-hint { font-size: 11px; color: var(--fp-text-secondary); margin-top: 6px; }

        .fp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 22px; border-radius: var(--fp-radius-sm); font-family: var(--fp-font); font-weight: 700; font-size: 14px; cursor: pointer; border: none; transition: background var(--fp-transition), transform 0.12s ease; }
        .fp-btn:active { transform: scale(0.97); }
        .fp-btn-primary { background: var(--fp-primary); color: var(--fp-header); box-shadow: 0 2px 8px rgba(255,153,0,0.25); }
        .fp-btn-primary:hover { background: var(--fp-primary-hover); }
        .fp-btn-primary:disabled { background: var(--fp-border-dark); color: #94a3b8; cursor: not-allowed; box-shadow: none; }
        .fp-btn-secondary { background: #f1f5f9; color: var(--fp-text); border: 1px solid var(--fp-border); }
        .fp-btn-secondary:hover { background: #e2e8f0; }
        .fp-btn-block { width: 100%; }
        .fp-btn-row { display: flex; gap: 10px; margin-top: 14px; }

        .fp-progress-wrap { background: var(--fp-border); border-radius: 20px; height: 22px; position: relative; overflow: hidden; margin: 14px 0; }
        .fp-progress-bar { height: 100%; border-radius: 20px; background: var(--fp-primary-gradient); transition: width 0.4s ease; }
        .fp-progress-text { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; font-family: var(--fp-mono); font-size: 11px; font-weight: 600; color: var(--fp-text); }
        .fp-progress-status { font-size: 12px; color: var(--fp-text-secondary); text-align: center; margin-top: 6px; }

        /* GRID FILTER TABS */
        .fp-grid-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px; }
        .fp-grid-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
        .fp-grid-tab { padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; border: 1.5px solid var(--fp-border); background: var(--fp-bg); color: var(--fp-text-secondary); transition: all 0.2s ease; font-family: var(--fp-font); }
        .fp-grid-tab:hover { border-color: var(--fp-primary); color: var(--fp-primary); }
        .fp-grid-tab.active { background: var(--fp-header); color: #fff; border-color: var(--fp-header); }

        /* TOTE CARDS */
        .fp-tote-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .fp-tote-card { border-radius: 12px; padding: 12px 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; border: 2px solid var(--fp-border); background: var(--fp-bg); transition: all var(--fp-transition); cursor: pointer; min-height: 68px; }
        .fp-tote-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .fp-tote-card .fp-tote-id { font-family: var(--fp-mono); font-size: 10px; font-weight: 600; color: var(--fp-text); word-break: break-all; margin-bottom: 4px; }
        .fp-tote-card .fp-tote-info { font-size: 9px; font-weight: 700; text-transform: uppercase; line-height: 1.3; }

        /* Card states */
        .fp-tote-card.pending { border-color: var(--fp-border); }
        .fp-tote-card.pending .fp-tote-info { color: var(--fp-text-secondary); }
        .fp-tote-card.loading { border-color: var(--fp-warning-border); background: var(--fp-warning-bg); animation: fp-pulse 1.5s infinite; }
        .fp-tote-card.loading .fp-tote-info { color: #b45309; }

        /* Card color classes */
        .fp-tote-card.card-green { border-color: var(--fp-success-border); background: var(--fp-success-bg); }
        .fp-tote-card.card-green .fp-tote-info { color: #15803d; }
        .fp-tote-card.card-red { border-color: var(--fp-error-border); background: var(--fp-error-bg); }
        .fp-tote-card.card-red .fp-tote-info { color: #dc2626; }
        .fp-tote-card.card-gray { border-color: var(--fp-gray-border); background: var(--fp-gray-bg); }
        .fp-tote-card.card-gray .fp-tote-info { color: #64748b; }
        .fp-tote-card.card-yellow { border-color: var(--fp-yellow-border); background: var(--fp-yellow-bg); }
        .fp-tote-card.card-yellow .fp-tote-info { color: #92400e; }
        .fp-tote-card.card-error { border-color: var(--fp-error-border); background: var(--fp-error-bg); }
        .fp-tote-card.card-error .fp-tote-info { color: var(--fp-error); }

        @keyframes fp-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,153,0,0.35); } 50% { box-shadow: 0 0 0 8px rgba(255,153,0,0); } }

        /* DETAIL VIEW */
        #fp-detail-view { display: none; }
        #fp-detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
        #fp-detail-header .fp-back-btn { background: none; border: none; cursor: pointer; font-size: 14px; font-weight: 700; color: var(--fp-primary); display: flex; align-items: center; gap: 6px; font-family: var(--fp-font); padding: 6px 12px; border-radius: var(--fp-radius-sm); transition: background var(--fp-transition); }
        #fp-detail-header .fp-back-btn:hover { background: rgba(255,153,0,0.08); }
        #fp-detail-tote-id { font-family: var(--fp-mono); font-weight: 700; font-size: 15px; color: var(--fp-header); }

        .fp-filter-wrap { position: relative; display: inline-block; }
        .fp-filter-btn { background: var(--fp-header); color: #fff; border: none; border-radius: var(--fp-radius-sm); padding: 8px 16px; font-family: var(--fp-font); font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background var(--fp-transition); }
        .fp-filter-btn:hover { background: #37475a; }
        .fp-filter-dropdown { position: absolute; top: 100%; right: 0; margin-top: 6px; background: var(--fp-bg); border: 1.5px solid var(--fp-border); border-radius: var(--fp-radius-sm); box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 10; min-width: 180px; overflow: hidden; display: none; }
        .fp-filter-dropdown.open { display: block; }
        .fp-filter-option { padding: 10px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s ease; font-family: var(--fp-font); color: var(--fp-text); display: flex; align-items: center; gap: 8px; }
        .fp-filter-option:hover { background: var(--fp-bg-body); }
        .fp-filter-option.active { background: #fff8ee; color: #b45309; }
        .fp-filter-option .fp-check { font-size: 14px; width: 16px; }

        .fp-data-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-family: var(--fp-font); font-size: 13px; }
        .fp-data-table thead th { background: var(--fp-header); color: #fff; padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
        .fp-data-table thead th:first-child { border-radius: 8px 0 0 0; }
        .fp-data-table thead th:last-child { border-radius: 0 8px 0 0; }
        .fp-data-table tbody td { padding: 10px 12px; border-bottom: 1px solid var(--fp-border); font-family: var(--fp-mono); font-size: 12px; }
        .fp-data-table tbody tr:hover { background: #fafbfc; }
        .fp-data-table tbody tr:last-child td { border-bottom: none; }
        .fp-data-table tbody tr:last-child td:first-child { border-radius: 0 0 0 8px; }
        .fp-data-table tbody tr:last-child td:last-child { border-radius: 0 0 8px 0; }

        .fp-tag { display: inline-block; padding: 3px 10px; border-radius: 6px; font-family: var(--fp-mono); font-size: 10px; font-weight: 600; }
        .fp-tag-sellable { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .fp-tag-damaged { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .fp-tag-other { background: #fff8ee; color: #b45309; border: 1px solid #ffd580; }
        .fp-tag-unowned { background: #fff8ee; color: #b45309; border: 1px solid #ffd580; }
        .fp-tag-transshipment { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .fp-tag-consumer-other { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .fp-tag-fba { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
        .fp-tag-retail { background: #fff8ee; color: #b45309; border: 1px solid #ffd580; }
        .fp-tag-default { background: var(--fp-gray-bg); color: var(--fp-text-secondary); border: 1px solid var(--fp-gray-border); }

        .fp-title-cell { font-family: var(--fp-font) !important; font-size: 11px !important; color: var(--fp-text-secondary); font-style: italic; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .fp-title-cell[title] { cursor: help; }

        .fp-empty-state { text-align: center; padding: 30px 20px; color: var(--fp-text-secondary); }
        .fp-empty-state .fp-empty-icon { font-size: 36px; margin-bottom: 8px; }
        .fp-empty-state .fp-empty-text { font-size: 13px; font-weight: 600; }

        .fp-summary-bar { display: flex; gap: 8px; margin-bottom: 16px; }
        .fp-summary-item { flex: 1; text-align: center; padding: 10px 6px; border-radius: var(--fp-radius-sm); border: 1px solid var(--fp-border); }
        .fp-summary-num { font-size: 24px; font-weight: 800; }
        .fp-summary-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--fp-text-label); margin-top: 2px; }
        .fp-sum-total { background: #f0f4ff; border-color: #c7d2fe; }
        .fp-sum-total .fp-summary-num { color: #4f46e5; }
        .fp-sum-done { background: var(--fp-success-bg); border-color: var(--fp-success-border); }
        .fp-sum-done .fp-summary-num { color: var(--fp-success); }
        .fp-sum-empty { background: var(--fp-gray-bg); border-color: var(--fp-gray-border); }
        .fp-sum-empty .fp-summary-num { color: var(--fp-text-secondary); }

        .fp-api-badge { display: inline-flex; align-items: center; gap: 4px; background: #ecfdf5; color: #059669; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; border: 1px solid #a7f3d0; }
        .fp-api-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; animation: fp-blink 1.5s infinite; }
        @keyframes fp-blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

        /* LEGEND */
        .fp-legend { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--fp-border); }
        .fp-legend-item { display: flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 600; color: var(--fp-text-secondary); }
        .fp-legend-dot { width: 10px; height: 10px; border-radius: 3px; }
        .fp-legend-dot.lg-green { background: var(--fp-success); }
        .fp-legend-dot.lg-red { background: var(--fp-error); }
        .fp-legend-dot.lg-gray { background: var(--fp-gray-border); }
        .fp-legend-dot.lg-yellow { background: #f59e0b; }
    `);

    // =============================================
    // CONSTANTS & STATE
    // =============================================
    const FC_SITE = 'GRU8';
    const API_URL = `https://qifcr.na.aftx.amazonoperations.app/${FC_SITE}/results/inventory`;
    const MAX_TOTES = 20;
    const DELAY_BETWEEN = 800;
    const INV_COL = { FNSKU: 30, QTY: 33, DISPOSITION: 34, CONSUMER: 35, EXTERNAL_LOC: 37, TITLE: 39 };
    const BAD_DISPS = ['DIST_DAMAGE', 'WHSE_DAMAGE', 'DEFECTIVE', 'EXPIRED'];

    let state = {
        isRunning: false, stopRequested: false, results: {}, allTotes: [],
        currentFilter: 'quantity', gridFilter: 'quantity', _currentDetailTote: null,
    };

    // =============================================
    // AUDIO
    // =============================================
    let audioCtx = null;
    function getAudioCtx() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
    function playTone(f, d, t = 'sine') { try { const c = getAudioCtx(), o = c.createOscillator(), g = c.createGain(); o.type = t; o.frequency.value = f; g.gain.value = 0.12; o.connect(g); g.connect(c.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d); o.stop(c.currentTime + d); } catch (e) {} }
    function soundOk() { playTone(880, 0.12); setTimeout(() => playTone(1100, 0.15), 140); }
    function soundDone() { playTone(660, 0.1); setTimeout(() => playTone(880, 0.1), 120); setTimeout(() => playTone(1100, 0.2), 240); }

    // =============================================
    // HELPERS
    // =============================================
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
    function parseToteIds(text) { return [...new Set(text.split(/[\s,;\n]+/).map(s => s.trim()).filter(s => s.length > 0))].slice(0, MAX_TOTES); }
    function esc(str) { return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

    function dispTagClass(d) {
        const u = (d || '').toUpperCase();
        if (u.includes('SELLABLE')) return 'fp-tag-sellable';
        if (BAD_DISPS.some(b => u.includes(b))) return 'fp-tag-damaged';
        return 'fp-tag-other';
    }
    function consumerTagClass(c) {
        const u = (c || '').toUpperCase();
        if (u.includes('UNOWNED')) return 'fp-tag-unowned';
        if (u.includes('TRANSSHIPMENT')) return 'fp-tag-transshipment';
        return 'fp-tag-consumer-other';
    }
    function getTypeTag(fnsku) { return fnsku.startsWith('X00') ? 'fp-tag-fba' : fnsku.startsWith('B0') ? 'fp-tag-retail' : 'fp-tag-default'; }
    function getTypeLabel(fnsku) { return fnsku.startsWith('X00') ? 'FBA' : fnsku.startsWith('B0') ? 'Retail' : 'Outro'; }

    // =============================================
    // TITLE SUMMARIZER v2
    // =============================================
    function summarizeTitle(title) {
        if (!title || title.trim().length === 0) return 'Sem título';
        const original = title.trim();

        let variant = '';
        const parenMatch = original.match(/\(([^)]{2,30})\)\s*$/);
        if (parenMatch) variant = '(' + parenMatch[1] + ')';

        let flavor = '';
        const flavorMatch = original.match(/\bsabor\s+([A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)?)/i);
        if (flavorMatch) flavor = 'Sabor ' + flavorMatch[1];

        let weight = '';
        const weightMatch = original.match(/\b(\d+(?:[.,]\d+)?\s*(?:g\/m²|kg|g|ml|l|oz|lb))\b/i);
        if (weightMatch) weight = weightMatch[1].replace(/\s+/g, '');

        let spec = '';
        if (!variant) { const m = original.match(/\b(bivolt|110\s*v|220\s*v|127\s*v)\b/i); if (m) spec = m[1]; }

        let cleaned = original.replace(/^\+/, '').replace(/\([^)]*\)\s*$/, '').replace(/\s*[-–—|]\s*display\b.*/i, '').replace(/\s*[-–—|]\s*kit\s+com\b.*/i, '').replace(/\s+/g, ' ').trim();

        const junkWords = new Set(['de','do','da','dos','das','em','no','na','nos','nas','um','uma','uns','umas','o','a','os','as','ao','the','of','for','and','with','in','on','at','to']);
        const stopPatterns = [/^com$/i,/^para$/i,/^ideal$/i,/^compatível$/i,/^compativel$/i,/^universal$/i,/^multifuncional$/i,/^macia$/i,/^macio$/i,/^alta$/i,/^super$/i,/^premium$/i,/^profissional$/i,/^tamanho$/i,/^medida$/i,/^\d+%$/,/^\d+(?:[.,]\d+)?\s*(?:g\/m²|kg|g|mm|cm|m|pol|"|gb|tb|mb|mah|w|v|hz|ml|l)$/i];

        const words = cleaned.split(' ');
        const nameWords = []; let keyCount = 0;
        for (let i = 0; i < words.length && keyCount < 4; i++) {
            const word = words[i]; const lower = word.toLowerCase();
            let hitStop = false;
            for (const pat of stopPatterns) { if (pat.test(word)) { hitStop = true; break; } }
            if (hitStop && keyCount >= 2) break;
            if (lower === 'sabor' && flavor) break;
            nameWords.push(word);
            if (!junkWords.has(lower)) keyCount++;
        }

        const parts = [nameWords.join(' ')];
        if (flavor && !parts[0].toLowerCase().includes('sabor')) parts.push(flavor);
        if (weight && !parts[0].includes(weight)) parts.push(weight);
        if (spec) parts.push(spec);
        if (variant) parts.push(variant);

        let summary = parts.join(' ');
        if (summary.length > 45) {
            summary = summary.substring(0, 42).replace(/\s+\S*$/, '') + '...';
            if (variant && !summary.includes(variant)) {
                const maxBase = 42 - variant.length - 1;
                const basePart = parts.slice(0, -1).join(' ');
                summary = (basePart.length > maxBase ? basePart.substring(0, maxBase).replace(/\s+\S*$/, '') + '...' : basePart) + ' ' + variant;
            }
        }
        return summary || original.substring(0, 35) + '...';
    }

    function titleCell(fullTitle) {
        const short = summarizeTitle(fullTitle);
        return `<td class="fp-title-cell" title="${esc(fullTitle || 'Sem título')}">${esc(short)}</td>`;
    }

    // =============================================
    // GRID CARD ANALYSIS — calcula cor e info para cada filtro
    // =============================================
    function analyzeForGrid(toteId, gridFilter) {
        const data = state.results[toteId];
        if (!data) return { cls: 'pending', info: 'Aguardando' };
        if (data.status === 'error') return { cls: 'card-error', info: 'Erro' };
        if (data.status === 'empty' || data.items.length === 0) return { cls: 'card-gray', info: 'Vazio' };

        const items = data.items;

        if (gridFilter === 'quantity') {
            const totalQty = items.reduce((s, i) => s + i.qty, 0);
            const hasFBA = items.some(i => i.fnsku.startsWith('X00'));
            const hasRetail = items.some(i => i.fnsku.startsWith('B0'));
            let cls, typeLabel;
            if (hasFBA && hasRetail) {
                cls = 'card-red'; typeLabel = 'FBA + Retail';
            } else if (hasFBA) {
                cls = 'card-green'; typeLabel = 'FBA';
            } else if (hasRetail) {
                cls = 'card-green'; typeLabel = 'Retail';
            } else {
                cls = 'card-green'; typeLabel = 'Outro';
            }
            return { cls, info: `${totalQty} un. • ${typeLabel}` };
        }

        if (gridFilter === 'disposition') {
            const disps = [...new Set(items.map(i => (i.disposition || '').toUpperCase()).filter(d => d))];
            const allBad = disps.length > 0 && disps.every(d => BAD_DISPS.some(b => d.includes(b)));
            const allSellable = disps.length > 0 && disps.every(d => d.includes('SELLABLE'));
            let cls;
            if (allSellable) cls = 'card-green';
            else if (allBad) cls = 'card-red';
            else cls = 'card-gray';
            const shortDisps = [...new Set(items.map(i => {
                const d = (i.disposition || '').toUpperCase();
                if (d.includes('SELLABLE')) return 'Sellable';
                if (d.includes('DIST_DAMAGE')) return 'Dist Damage';
                if (d.includes('WHSE_DAMAGE')) return 'Whse Damage';
                if (d.includes('DEFECTIVE')) return 'Defective';
                if (d.includes('EXPIRED')) return 'Expired';
                return i.disposition || 'N/A';
            }))];
            return { cls, info: shortDisps.join(' + ') };
        }

        if (gridFilter === 'consumer') {
            const consumers = [...new Set(items.map(i => (i.consumer || '').toUpperCase()).filter(c => c))];
            if (consumers.length === 0) return { cls: 'card-gray', info: 'N/A' };
            if (consumers.length > 1) return { cls: 'card-gray', info: consumers.map(c => c.includes('UNOWNED') ? 'Unowned' : c.includes('TRANSSHIPMENT') ? 'Transship' : c).join(' + ') };
            const single = consumers[0];
            if (single.includes('UNOWNED')) return { cls: 'card-yellow', info: 'Unowned' };
            if (single.includes('TRANSSHIPMENT')) return { cls: 'card-green', info: 'Transshipment' };
            return { cls: 'card-gray', info: items[0].consumer || 'Outro' };
        }

        if (gridFilter === 'externalLoc') {
            const locs = [...new Set(items.map(i => (i.externalLoc || '').trim()).filter(l => l))];
            if (locs.length === 0) return { cls: 'card-gray', info: 'N/A' };
            const allDzS = locs.every(l => l.startsWith('dz-S'));
            const displayLocs = [...new Set(locs)].join(', ');
            const shortLoc = displayLocs.length > 25 ? displayLocs.substring(0, 22) + '...' : displayLocs;
            return { cls: allDzS ? 'card-green' : 'card-gray', info: shortLoc };
        }

        return { cls: 'card-gray', info: '—' };
    }

    function getLegend(gridFilter) {
        const legends = {
            quantity: [
                { cls: 'lg-green', label: 'Só FBA ou só Retail' },
                { cls: 'lg-red', label: 'FBA + Retail misturado' },
                { cls: 'lg-gray', label: 'Vazio' },
            ],
            disposition: [
                { cls: 'lg-green', label: 'Tudo Sellable' },
                { cls: 'lg-red', label: 'Tudo Damage/Defective/Expired' },
                { cls: 'lg-gray', label: 'Mix de disposições' },
            ],
            consumer: [
                { cls: 'lg-green', label: 'Transshipment' },
                { cls: 'lg-yellow', label: 'Unowned' },
                { cls: 'lg-gray', label: 'Outro / Múltiplos' },
            ],
            externalLoc: [
                { cls: 'lg-green', label: 'Local dz-S...' },
                { cls: 'lg-gray', label: 'Outro local' },
            ],
        };
        const items = legends[gridFilter] || [];
        return `<div class="fp-legend">${items.map(l => `<div class="fp-legend-item"><div class="fp-legend-dot ${l.cls}"></div>${l.label}</div>`).join('')}</div>`;
    }

    // =============================================
    // API FETCH
    // =============================================
    async function fetchToteInventory(toteId) {
        try {
            const resp = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'text/html, */*; q=0.01' }, credentials: 'same-origin', body: `s=${encodeURIComponent(toteId)}` });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return parseInventoryHTML(await resp.text());
        } catch (err) { console.error(`[FP] Erro: ${toteId}`, err); return { items: [], status: 'error', error: err.message }; }
    }

    function parseInventoryHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const items = [];
        let invTable = doc.querySelector('#table-inventory');
        if (!invTable) {
            for (const tbl of doc.querySelectorAll('table')) {
                for (const th of tbl.querySelectorAll('thead th')) {
                    if (th.textContent.trim().toUpperCase() === 'FNSKU') { invTable = tbl; break; }
                }
                if (invTable) break;
            }
        }
        if (!invTable) return { items, status: 'empty' };

        const colMap = { fnsku: -1, qty: -1, disposition: -1, consumer: -1, externalLoc: -1, title: -1 };
        invTable.querySelectorAll('thead tr th').forEach((th, idx) => {
            const raw = th.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
            if (raw === 'fnsku') colMap.fnsku = idx;
            else if (raw.startsWith('quantidade')) colMap.qty = idx;
            else if (raw === 'disposição' || raw === 'disposition') colMap.disposition = idx;
            else if (raw === 'consumidor' || raw === 'consumer') colMap.consumer = idx;
            else if (raw === 'local externo' || raw === 'external location') colMap.externalLoc = idx;
            else if (raw === 'título' || raw === 'titulo' || raw === 'title') colMap.title = idx;
        });
        if (colMap.fnsku === -1) colMap.fnsku = INV_COL.FNSKU;
        if (colMap.qty === -1) colMap.qty = INV_COL.QTY;
        if (colMap.disposition === -1) colMap.disposition = INV_COL.DISPOSITION;
        if (colMap.consumer === -1) colMap.consumer = INV_COL.CONSUMER;
        if (colMap.externalLoc === -1) colMap.externalLoc = INV_COL.EXTERNAL_LOC;
        if (colMap.title === -1) colMap.title = INV_COL.TITLE;

        invTable.querySelectorAll('tbody tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 5) return;
            const gt = (idx) => (idx >= 0 && idx < cells.length && cells[idx]) ? cells[idx].textContent.trim() : '';
            const fnsku = gt(colMap.fnsku);
            if (fnsku && fnsku.length > 2 && !fnsku.toLowerCase().includes('no matching')) {
                items.push({ fnsku, qty: parseInt(gt(colMap.qty), 10) || 0, disposition: gt(colMap.disposition), consumer: gt(colMap.consumer), externalLoc: gt(colMap.externalLoc), title: gt(colMap.title) });
            }
        });
        return { items, status: items.length > 0 ? 'done' : 'empty' };
    }

    // =============================================
    // SCAN ENGINE
    // =============================================
    async function runScan(toteIds) {
        state.isRunning = true; state.stopRequested = false;
        state.results = {}; state.allTotes = toteIds;
        showScanUI(); refreshGrid(); updateProgress(0, toteIds.length, 'Iniciando...');

        for (let i = 0; i < toteIds.length; i++) {
            if (state.stopRequested) break;
            const toteId = toteIds[i];
            updateToteCardDirect(toteId, 'loading', '⏳ Buscando...');
            updateProgress(i, toteIds.length, `Buscando: ${toteId}`);

            const result = await fetchToteInventory(toteId);
            state.results[toteId] = result;
            soundOk();

            updateProgress(i + 1, toteIds.length, i + 1 < toteIds.length ? `Próximo: ${toteIds[i + 1]}` : 'Finalizando...');
            updateSummary();
            refreshGrid();
            if (i < toteIds.length - 1 && !state.stopRequested) await sleep(DELAY_BETWEEN);
        }
        finishScan();
    }

    // =============================================
    // UI BUILD
    // =============================================
    function buildUI() {
        const fab = document.createElement('div');
        fab.id = 'fp-fab'; fab.innerHTML = '📦'; fab.title = 'FCResearch Plus';
        document.body.appendChild(fab);
        const overlay = document.createElement('div'); overlay.id = 'fp-overlay'; document.body.appendChild(overlay);

        const panel = document.createElement('div'); panel.id = 'fp-panel';
        panel.innerHTML = `
            <div id="fp-header-bar">
                <div class="fp-title">🔬 FCResearch Plus <span class="fp-badge">${FC_SITE}</span> <span class="fp-api-badge"><span class="fp-api-dot"></span> API Mode</span></div>
                <button class="fp-close-btn" id="fp-close">✕</button>
            </div>
            <div id="fp-body">
                <div id="fp-main-view">
                    <div class="fp-section">
                        <div class="fp-section-label">📋 IDs dos Totes (máx. ${MAX_TOTES})</div>
                        <textarea id="fp-input" class="fp-textarea" placeholder="Cole os IDs dos totes aqui&#10;Ex: tsX389z0i1h, tsX123abc"></textarea>
                        <div class="fp-hint">Separados por vírgula, espaço ou quebra de linha • Busca via API sem recarregar ⚡</div>
                        <div class="fp-btn-row">
                            <button id="fp-btn-scan" class="fp-btn fp-btn-primary fp-btn-block">⚡ Iniciar Scan</button>
                            <button id="fp-btn-stop" class="fp-btn fp-btn-secondary" style="display:none;">⏹ Parar</button>
                        </div>
                    </div>
                    <div id="fp-progress-section" class="fp-section" style="display:none;">
                        <div class="fp-section-label">⏳ Progresso</div>
                        <div class="fp-progress-wrap"><div id="fp-progress-bar" class="fp-progress-bar" style="width:0%"></div><div id="fp-progress-text" class="fp-progress-text">0 / 0</div></div>
                        <div id="fp-progress-status" class="fp-progress-status">Aguardando...</div>
                    </div>
                    <div id="fp-summary-section" style="display:none;">
                        <div class="fp-summary-bar">
                            <div class="fp-summary-item fp-sum-total"><div id="fp-sum-total" class="fp-summary-num">0</div><div class="fp-summary-label">Total</div></div>
                            <div class="fp-summary-item fp-sum-done"><div id="fp-sum-done" class="fp-summary-num">0</div><div class="fp-summary-label">Com Dados</div></div>
                            <div class="fp-summary-item fp-sum-empty"><div id="fp-sum-empty" class="fp-summary-num">0</div><div class="fp-summary-label">Vazios</div></div>
                        </div>
                    </div>
                    <div id="fp-grid-section" class="fp-section" style="display:none;">
                        <div class="fp-grid-header">
                            <div class="fp-section-label" style="margin-bottom:0;">🗂 Totes Escaneados</div>
                            <div class="fp-grid-tabs" id="fp-grid-tabs">
                                <div class="fp-grid-tab active" data-grid="quantity">📦 Quantidade</div>
                                <div class="fp-grid-tab" data-grid="disposition">🏷️ Disposição</div>
                                <div class="fp-grid-tab" data-grid="consumer">👤 Consumidor</div>
                                <div class="fp-grid-tab" data-grid="externalLoc">📍 Local Ext.</div>
                            </div>
                        </div>
                        <div id="fp-tote-grid" class="fp-tote-grid"></div>
                        <div id="fp-grid-legend"></div>
                    </div>
                </div>
                <div id="fp-detail-view">
                    <div id="fp-detail-header">
                        <button class="fp-back-btn" id="fp-back-btn">← Voltar</button>
                        <span id="fp-detail-tote-id"></span>
                        <div class="fp-filter-wrap">
                            <button class="fp-filter-btn" id="fp-filter-btn">🔽 Filtro: Quantidade</button>
                            <div class="fp-filter-dropdown" id="fp-filter-dropdown">
                                <div class="fp-filter-option active" data-filter="quantity"><span class="fp-check">✓</span> Quantidade</div>
                                <div class="fp-filter-option" data-filter="disposition"><span class="fp-check"></span> Disposição</div>
                                <div class="fp-filter-option" data-filter="consumer"><span class="fp-check"></span> Consumidor</div>
                                <div class="fp-filter-option" data-filter="externalLoc"><span class="fp-check"></span> Local Externo</div>
                            </div>
                        </div>
                    </div>
                    <div id="fp-detail-content" class="fp-section"></div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Events
        fab.addEventListener('click', openPanel);
        overlay.addEventListener('click', closePanel);
        document.getElementById('fp-close').addEventListener('click', closePanel);
        document.getElementById('fp-btn-scan').addEventListener('click', startScan);
        document.getElementById('fp-btn-stop').addEventListener('click', stopScan);
        document.getElementById('fp-back-btn').addEventListener('click', showMainView);

        // Grid filter tabs
        document.querySelectorAll('.fp-grid-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                state.gridFilter = tab.dataset.grid;
                document.querySelectorAll('.fp-grid-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                refreshGrid();
            });
        });

        // Detail filter dropdown
        document.getElementById('fp-filter-btn').addEventListener('click', () => {
            document.getElementById('fp-filter-dropdown').classList.toggle('open');
        });
        document.querySelectorAll('.fp-filter-option').forEach(opt => {
            opt.addEventListener('click', () => {
                state.currentFilter = opt.dataset.filter;
                const labels = { quantity: 'Quantidade', disposition: 'Disposição', consumer: 'Consumidor', externalLoc: 'Local Externo' };
                document.getElementById('fp-filter-btn').textContent = `🔽 Filtro: ${labels[opt.dataset.filter]}`;
                document.querySelectorAll('.fp-filter-option').forEach(o => { o.classList.remove('active'); o.querySelector('.fp-check').textContent = ''; });
                opt.classList.add('active'); opt.querySelector('.fp-check').textContent = '✓';
                document.getElementById('fp-filter-dropdown').classList.remove('open');
                renderDetailContent(state._currentDetailTote);
            });
        });
        document.addEventListener('click', (e) => {
            const dd = document.getElementById('fp-filter-dropdown');
            const btn = document.getElementById('fp-filter-btn');
            if (dd && !dd.contains(e.target) && e.target !== btn) dd.classList.remove('open');
        });
    }

    // =============================================
    // PANEL CONTROLS
    // =============================================
    function openPanel() { document.getElementById('fp-overlay').style.display = 'block'; document.getElementById('fp-panel').style.display = 'flex'; }
    function closePanel() { document.getElementById('fp-overlay').style.display = 'none'; document.getElementById('fp-panel').style.display = 'none'; }
    function showMainView() { document.getElementById('fp-detail-view').style.display = 'none'; document.getElementById('fp-main-view').style.display = 'block'; }

    function showDetailView(toteId) {
        state._currentDetailTote = toteId; state.currentFilter = 'quantity';
        document.getElementById('fp-filter-btn').textContent = '🔽 Filtro: Quantidade';
        document.querySelectorAll('.fp-filter-option').forEach(o => { o.classList.remove('active'); o.querySelector('.fp-check').textContent = ''; });
        const def = document.querySelector('.fp-filter-option[data-filter="quantity"]');
        if (def) { def.classList.add('active'); def.querySelector('.fp-check').textContent = '✓'; }
        document.getElementById('fp-detail-tote-id').textContent = toteId;
        document.getElementById('fp-main-view').style.display = 'none';
        document.getElementById('fp-detail-view').style.display = 'block';
        renderDetailContent(toteId);
    }

    // =============================================
    // GRID — renderiza cards com filtro global
    // =============================================
    function refreshGrid() {
        const grid = document.getElementById('fp-tote-grid');
        const legend = document.getElementById('fp-grid-legend');
        if (!grid) return;

        grid.innerHTML = state.allTotes.map(id => {
            const analysis = analyzeForGrid(id, state.gridFilter);
            return `<div class="fp-tote-card ${analysis.cls}" data-tote="${id}">
                <div class="fp-tote-id">${id}</div>
                <div class="fp-tote-info">${analysis.info}</div>
            </div>`;
        }).join('');

        if (legend) legend.innerHTML = getLegend(state.gridFilter);

        grid.querySelectorAll('.fp-tote-card').forEach(card => {
            card.addEventListener('click', () => {
                const tid = card.dataset.tote;
                const r = state.results[tid];
                if (r && r.status === 'done') showDetailView(tid);
            });
        });
    }

    function updateToteCardDirect(toteId, cls, info) {
        const cards = document.querySelectorAll(`[data-tote="${toteId}"]`);
        cards.forEach(card => {
            card.className = `fp-tote-card ${cls}`;
            card.querySelector('.fp-tote-info').textContent = info;
        });
    }

    // =============================================
    // DETAIL RENDERING
    // =============================================
    function renderDetailContent(toteId) {
        const container = document.getElementById('fp-detail-content');
        const data = state.results[toteId];
        if (!data || data.items.length === 0) {
            container.innerHTML = `<div class="fp-empty-state"><div class="fp-empty-icon">📭</div><div class="fp-empty-text">${data && data.status === 'error' ? 'Erro ao buscar dados' : 'Tote sem inventário'}</div></div>`;
            return;
        }
        const items = data.items;
        const filter = state.currentFilter;
        let html = '';

        if (filter === 'quantity') {
            const grouped = {}; const titles = {};
            items.forEach(i => { grouped[i.fnsku] = (grouped[i.fnsku] || 0) + i.qty; if (!titles[i.fnsku] && i.title) titles[i.fnsku] = i.title; });
            const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
            const totalQty = entries.reduce((s, e) => s + e[1], 0);
            html = `<div style="font-size:12px;color:var(--fp-text-secondary);margin-bottom:10px;font-weight:600;">${entries.length} FNSku(s) — ${totalQty} unidade(s)</div>
                <table class="fp-data-table"><thead><tr><th>FNSku</th><th>Produto</th><th style="text-align:center;width:65px;">Tipo</th><th style="text-align:center;width:55px;">Qtd</th></tr></thead>
                <tbody>${entries.map(([fnsku, qty]) => `<tr><td>${fnsku}</td>${titleCell(titles[fnsku] || '')}<td style="text-align:center;"><span class="fp-tag ${getTypeTag(fnsku)}">${getTypeLabel(fnsku)}</span></td><td style="text-align:center;font-weight:700;">${qty}</td></tr>`).join('')}</tbody></table>`;
        } else if (filter === 'disposition') {
            html = `<table class="fp-data-table"><thead><tr><th>FNSku</th><th>Produto</th><th>Disposição</th></tr></thead>
                <tbody>${items.map(i => `<tr><td>${i.fnsku}</td>${titleCell(i.title)}<td><span class="fp-tag ${dispTagClass(i.disposition)}">${i.disposition || 'N/A'}</span></td></tr>`).join('')}</tbody></table>`;
        } else if (filter === 'consumer') {
            html = `<table class="fp-data-table"><thead><tr><th>FNSku</th><th>Produto</th><th>Consumidor</th></tr></thead>
                <tbody>${items.map(i => `<tr><td>${i.fnsku}</td>${titleCell(i.title)}<td><span class="fp-tag ${consumerTagClass(i.consumer)}">${i.consumer || 'N/A'}</span></td></tr>`).join('')}</tbody></table>`;
        } else if (filter === 'externalLoc') {
            html = `<table class="fp-data-table"><thead><tr><th>FNSku</th><th>Produto</th><th>Local Externo</th></tr></thead>
                <tbody>${items.map(i => `<tr><td>${i.fnsku}</td>${titleCell(i.title)}<td style="font-weight:600;">${i.externalLoc || 'N/A'}</td></tr>`).join('')}</tbody></table>`;
        }
        container.innerHTML = html;
    }

    // =============================================
    // PROGRESS & SUMMARY
    // =============================================
    function updateProgress(current, total, statusText) {
        const pct = total > 0 ? Math.round((current / total) * 100) : 0;
        const bar = document.getElementById('fp-progress-bar');
        const txt = document.getElementById('fp-progress-text');
        const sts = document.getElementById('fp-progress-status');
        if (bar) bar.style.width = `${pct}%`;
        if (txt) txt.textContent = `${current} / ${total}`;
        if (sts) sts.textContent = statusText;
    }
    function updateSummary() {
        document.getElementById('fp-summary-section').style.display = 'block';
        const entries = Object.values(state.results);
        document.getElementById('fp-sum-total').textContent = entries.length;
        document.getElementById('fp-sum-done').textContent = entries.filter(r => r.status === 'done').length;
        document.getElementById('fp-sum-empty').textContent = entries.filter(r => r.status === 'empty').length;
    }

    // =============================================
    // SCAN CONTROLS
    // =============================================
    function showScanUI() {
        document.getElementById('fp-btn-scan').disabled = true;
        document.getElementById('fp-btn-scan').textContent = '⚡ Escaneando...';
        document.getElementById('fp-btn-stop').style.display = 'inline-flex';
        document.getElementById('fp-progress-section').style.display = 'block';
        document.getElementById('fp-grid-section').style.display = 'block';
        document.getElementById('fp-summary-section').style.display = 'none';
    }
    async function startScan() {
        const input = document.getElementById('fp-input').value;
        const toteIds = parseToteIds(input);
        if (toteIds.length === 0) { alert('Insira pelo menos um ID de tote.'); return; }
        if (toteIds.length > MAX_TOTES) { alert(`Máximo de ${MAX_TOTES} totes por scan.`); return; }
        await runScan(toteIds);
    }
    function stopScan() { state.stopRequested = true; }
    function finishScan() {
        state.isRunning = false;
        const btnScan = document.getElementById('fp-btn-scan');
        const btnStop = document.getElementById('fp-btn-stop');
        if (btnScan) { btnScan.disabled = false; btnScan.textContent = '⚡ Iniciar Scan'; }
        if (btnStop) btnStop.style.display = 'none';
        updateProgress(Object.keys(state.results).length, state.allTotes.length, state.stopRequested ? 'Cancelado ⚠️' : 'Concluído ✓');
        updateSummary(); refreshGrid(); soundDone();
    }

    // =============================================
    // INIT
    // =============================================
    function init() { buildUI(); console.log('[FCResearch Plus] v6.0.0 API Mode — ' + FC_SITE); }
    if (document.readyState === 'complete') init(); else window.addEventListener('load', init);
})();

// Parte da jornada é o fim.
