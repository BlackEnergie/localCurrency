/* ============================================================
   LocalCurrency — Fonctions utilitaires de formatage/parsing
   Module pur : aucune dépendance, aucun effet de bord DOM.
   ============================================================ */

/** Convertit une chaîne saisie (séparateurs fr/en) en nombre flottant. */
export function parseInput(str) {
  const cleaned = str.replace(/[\u202f\u00a0\s]/g, '').replace(',', '.');
  return parseFloat(cleaned);
}

/** Formate un nombre pour le champ de saisie (séparateurs de milliers, virgule décimale fr). */
export function formatInputValue(n) {
  if (!isFinite(n) || isNaN(n)) return '';
  const str = String(n);
  const [intPart, decPart] = str.split('.');
  const intFormatted = parseInt(intPart, 10).toLocaleString('fr-FR', { useGrouping: true });
  return decPart !== undefined ? intFormatted + ',' + decPart : intFormatted;
}

/** Formate un résultat de conversion (toujours 2 décimales). */
export function formatAmount(n) {
  if (!isFinite(n)) return '—';
  return n.toLocaleString('fr-FR', {
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Formate un taux de change unitaire avec précision adaptée. */
export function formatRate(r) {
  if (!isFinite(r)) return '—';
  if (r >= 100) return r.toLocaleString('fr-FR', { useGrouping: true, maximumFractionDigits: 2 });
  if (r >= 1)   return r.toLocaleString('fr-FR', { useGrouping: true, minimumFractionDigits: 4, maximumFractionDigits: 4 });
  return r.toLocaleString('fr-FR', { useGrouping: true, minimumFractionDigits: 6, maximumFractionDigits: 6 });
}

/** Échappe les caractères spéciaux HTML pour usage dans un attribut. */
export function escapeAttr(s) {
  return s.replace(/[&"<>]/g, c => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' }[c]));
}
