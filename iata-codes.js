// This file contains a comprehensive list of IATA airport codes and their corresponding details.
// Source: https://github.com/lxndrblz/Airports/blob/main/airports.csv

// --- IATA code and airport name loader/lookup ---
window.IATA_CODES = [];
window.IATA_CODE_TO_NAME = {};
window.IATA_CODES_READY = false;

window.loadIataCodes = function () {
    if (window.IATA_CODES_READY) return Promise.resolve();
    return fetch("airports.csv")
        .then((r) => r.text())
        .then((csv) => {
            window.IATA_CODES = [];
            window.IATA_CODE_TO_NAME = {};
            const lines = csv.split(/\r?\n/).filter(Boolean);
            for (let i = 1; i < lines.length; i++) {
                const cols = lines[i].split(",");
                const code = cols[0]?.replace(/"/g, "").trim();
                const name = cols[2]?.replace(/"/g, "").trim();
                if (/^[A-Z]{3}$/.test(code)) {
                    window.IATA_CODES.push(code);
                    if (name) window.IATA_CODE_TO_NAME[code] = name;
                }
            }
            window.IATA_CODES_READY = true;
        });
};

window.isValidAirportCode = function (code) {
    return (
        /^[A-Z]{3}$/.test(code) &&
        Array.isArray(window.IATA_CODES) &&
        window.IATA_CODES.includes(code)
    );
};

window.getAirportName = function (code) {
    return window.IATA_CODE_TO_NAME[code] || "";
};

// Export for use in app.js
if (typeof module !== "undefined") {
    module.exports = {
        IATA_CODES: window.IATA_CODES,
        IATA_CODE_TO_NAME: window.IATA_CODE_TO_NAME,
        loadIataCodes: window.loadIataCodes,
        isValidAirportCode: window.isValidAirportCode,
        getAirportName: window.getAirportName,
    };
}
