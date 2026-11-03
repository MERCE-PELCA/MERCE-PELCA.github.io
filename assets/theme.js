/* PELCA — mode nuit automatique, selon le lever et le coucher du soleil chez le visiteur.
   Chargé dans <head> sans « defer » : le thème est posé avant l'affichage (pas de flash blanc).

   Position : déduite du fuseau horaire de l'appareil (ex. Europe/Paris → Paris), sans demander
   d'autorisation. Si le visiteur a déjà autorisé la géolocalisation pour ce site, sa position
   exacte est utilisée. Un clic sur le bouton lune/soleil (.theme-toggle) fixe le thème pour
   la session de navigation ; sinon il est réévalué chaque minute. */
(() => {
  const root = document.documentElement;
  const KEY = "pelca-theme";
  const THEME_COLOR = { light: "#7f82bc", dark: "#2c2c48" };

  // Coordonnées approximatives par fuseau horaire IANA (ville de référence)
  const ZONES = {
    "Europe/Paris": [48.86, 2.35], "Europe/London": [51.51, -0.13], "Europe/Dublin": [53.35, -6.26],
    "Europe/Lisbon": [38.72, -9.14], "Europe/Madrid": [40.42, -3.70], "Europe/Brussels": [50.85, 4.35],
    "Europe/Amsterdam": [52.37, 4.90], "Europe/Luxembourg": [49.61, 6.13], "Europe/Berlin": [52.52, 13.40],
    "Europe/Zurich": [47.38, 8.54], "Europe/Vienna": [48.21, 16.37], "Europe/Rome": [41.90, 12.50],
    "Europe/Monaco": [43.74, 7.42], "Europe/Andorra": [42.51, 1.52], "Europe/Prague": [50.08, 14.44],
    "Europe/Warsaw": [52.23, 21.01], "Europe/Budapest": [47.50, 19.04], "Europe/Copenhagen": [55.68, 12.57],
    "Europe/Stockholm": [59.33, 18.07], "Europe/Oslo": [59.91, 10.75], "Europe/Helsinki": [60.17, 24.94],
    "Europe/Athens": [37.98, 23.73], "Europe/Bucharest": [44.43, 26.10], "Europe/Sofia": [42.70, 23.32],
    "Europe/Istanbul": [41.01, 28.98], "Europe/Kiev": [50.45, 30.52], "Europe/Kyiv": [50.45, 30.52],
    "Europe/Moscow": [55.76, 37.62], "Europe/Belgrade": [44.79, 20.45], "Europe/Zagreb": [45.81, 15.98],
    "Europe/Ljubljana": [46.06, 14.51], "Europe/Bratislava": [48.15, 17.11], "Europe/Vilnius": [54.69, 25.28],
    "Europe/Riga": [56.95, 24.11], "Europe/Tallinn": [59.44, 24.75], "Atlantic/Reykjavik": [64.15, -21.94],
    "Atlantic/Canary": [28.12, -15.43], "Atlantic/Azores": [37.74, -25.67],
    "Africa/Casablanca": [33.57, -7.59], "Africa/Algiers": [36.75, 3.06], "Africa/Tunis": [36.81, 10.18],
    "Africa/Cairo": [30.04, 31.24], "Africa/Dakar": [14.72, -17.47], "Africa/Abidjan": [5.36, -4.01],
    "Africa/Lagos": [6.52, 3.38], "Africa/Nairobi": [-1.29, 36.82], "Africa/Johannesburg": [-26.20, 28.05],
    "Asia/Dubai": [25.20, 55.27], "Asia/Kolkata": [22.57, 88.36], "Asia/Calcutta": [22.57, 88.36],
    "Asia/Singapore": [1.35, 103.82], "Asia/Shanghai": [31.23, 121.47], "Asia/Hong_Kong": [22.32, 114.17],
    "Asia/Tokyo": [35.68, 139.69], "Asia/Seoul": [37.57, 126.98], "Asia/Bangkok": [13.76, 100.50],
    "Asia/Jakarta": [-6.21, 106.85], "Asia/Taipei": [25.03, 121.57], "Asia/Jerusalem": [31.77, 35.21],
    "Asia/Riyadh": [24.71, 46.68], "Asia/Tehran": [35.69, 51.39], "Asia/Karachi": [24.86, 67.01],
    "Australia/Sydney": [-33.87, 151.21], "Australia/Melbourne": [-37.81, 144.96], "Australia/Brisbane": [-27.47, 153.03],
    "Australia/Perth": [-31.95, 115.86], "Australia/Adelaide": [-34.93, 138.60], "Pacific/Auckland": [-36.85, 174.76],
    "Pacific/Noumea": [-22.28, 166.46], "Pacific/Tahiti": [-17.54, -149.57], "Indian/Reunion": [-20.88, 55.45],
    "America/New_York": [40.71, -74.01], "America/Toronto": [43.65, -79.38], "America/Montreal": [45.50, -73.57],
    "America/Chicago": [41.88, -87.63], "America/Denver": [39.74, -104.99], "America/Phoenix": [33.45, -112.07],
    "America/Los_Angeles": [34.05, -118.24], "America/Vancouver": [49.28, -123.12], "America/Mexico_City": [19.43, -99.13],
    "America/Bogota": [4.71, -74.07], "America/Lima": [-12.05, -77.04], "America/Santiago": [-33.45, -70.67],
    "America/Sao_Paulo": [-23.55, -46.63], "America/Argentina/Buenos_Aires": [-34.60, -58.38],
    "America/Guadeloupe": [16.24, -61.53], "America/Martinique": [14.64, -61.02], "America/Cayenne": [4.92, -52.31],
  };
  // À défaut : latitude typique de la région, longitude tirée du décalage horaire
  const REGION_LAT = { Europe: 48, Africa: 5, Asia: 30, America: 35, Australia: -30, Pacific: -15, Atlantic: 40, Indian: -10, Antarctica: -75, Arctic: 78 };
  function zonePosition() {
    let tz = "";
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    if (ZONES[tz]) return ZONES[tz];
    const lat = REGION_LAT[tz.split("/")[0]] ?? 45;
    return [lat, -new Date().getTimezoneOffset() / 4];   // 1 h de décalage ≈ 15° de longitude
  }
  let position = zonePosition();

  // Nuit = soleil sous l'horizon (−0,833°, réfraction comprise). Formules NOAA simplifiées.
  function isNight(date, [lat, lon]) {
    const rad = Math.PI / 180;
    const day = (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 0)) / 864e5;
    const g = 2 * Math.PI / 365 * (day - 0.5);
    const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g)
      + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    const cosH = Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl)) - Math.tan(lat * rad) * Math.tan(decl);
    if (cosH >= 1) return true;     // nuit polaire
    if (cosH <= -1) return false;   // soleil de minuit
    const halfDay = 4 * Math.acos(cosH) / rad;           // demi-durée du jour, en minutes
    const noon = 720 - 4 * lon - eqTime;                  // midi solaire, minutes UTC
    const now = date.getUTCHours() * 60 + date.getUTCMinutes();
    const fromNoon = ((now - noon) % 1440 + 2160) % 1440 - 720;   // ramené dans [−720, 720]
    return Math.abs(fromNoon) > halfDay;
  }

  let manual = null;
  try { manual = sessionStorage.getItem(KEY); } catch (e) {}
  const current = () => manual || (isNight(new Date(), position) ? "dark" : "light");

  function apply() {
    const t = current();
    root.dataset.theme = t;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOR[t]);
    document.querySelectorAll(".theme-toggle").forEach(b => {
      const label = t === "dark" ? "Switch to light mode" : "Switch to dark mode";
      b.setAttribute("aria-label", label); b.title = label;
    });
  }
  apply();

  document.addEventListener("DOMContentLoaded", () => {
    apply();
    document.querySelectorAll(".theme-toggle").forEach(b => b.addEventListener("click", () => {
      manual = root.dataset.theme === "dark" ? "light" : "dark";
      try { sessionStorage.setItem(KEY, manual); } catch (e) {}
      apply();
    }));
  });
  setInterval(() => { if (!manual) apply(); }, 60000);

  // Position exacte seulement si déjà autorisée : jamais de demande d'autorisation
  if (navigator.permissions && navigator.geolocation) {
    navigator.permissions.query({ name: "geolocation" }).then(p => {
      if (p.state !== "granted") return;
      navigator.geolocation.getCurrentPosition(pos => {
        position = [pos.coords.latitude, pos.coords.longitude];
        if (!manual) apply();
      }, () => {}, { maximumAge: 36e5, timeout: 10000 });
    }).catch(() => {});
  }
})();
