# Cloudflare einrichten (einmalig, ca. 10 Minuten)

Der Shop speichert Produkte, Einstellungen, Fotos und das Änderungsprotokoll in einer
Cloudflare-D1-Datenbank. Appwrite wird danach nicht mehr gebraucht.

**Kosten:** Alles läuft im kostenlosen Tarif „Workers Free“. Dafür ist keine Kreditkarte nötig,
und Cloudflare bucht nichts ab. Wird ein Tageslimit erreicht (100.000 Anfragen pro Tag),
zeigt die Seite bis zum nächsten Tag Fehler, es entstehen aber keine Kosten.
**Nicht** „Workers Paid“ buchen und keine Zahlungsart hinterlegen.

## 1. Datenbank anlegen

1. dash.cloudflare.com → links **Storage & Databases** → **D1 SQL Database** → **Create**.
2. Name: `mais-beauty` → **Create**. Mehr ist nicht nötig, die Tabellen legt der Shop selbst an.

## 2. Datenbank mit dem Pages-Projekt verbinden

1. **Workers & Pages** → **mais-beauty-shop** → **Settings** → **Bindings** → **Add** → **D1 database**.
2. Variable name: `DB` (genau so, in Großbuchstaben). Database: `mais-beauty`.
3. Das für **Production** und für **Preview** machen. Oben auf der Seite lässt sich die Umgebung umschalten.
   Beide bekommen dieselbe Datenbank, dann sind die getesteten Daten später sofort live.

## 3. Admin-Passwörter anlegen

1. Im selben Projekt: **Settings** → **Variables and Secrets** → **Add**.
2. Type: **Secret**. Name: `PASSWORD_MAIS`. Value: das Passwort für Mais (mindestens 12 Zeichen).
3. Noch einmal mit Name `PASSWORD_ABDUL` und deinem eigenen Passwort.
4. Ebenfalls für **Production** und **Preview**.

Weitere Personen: einfach ein weiteres Secret `PASSWORD_<NAME>` anlegen. Der Name nach dem
Unterstrich erscheint im Admin und im Änderungsprotokoll.
Ein Passwort ändern oder löschen meldet alle ab. Danach meldet sich jeder mit dem neuen Passwort an.

## 4. Neu bereitstellen

Einstellungen gelten erst für neue Bereitstellungen:
**Deployments** → bei der neuesten Vorschau (Branch `claude/zen-ramanujan-10znq6`) **⋯** → **Retry deployment**.

## 5. Produkte aus Appwrite übernehmen

1. Admin der Vorschau öffnen: https://claude-zen-ramanujan-10znq6.mais-beauty-shop.pages.dev/admin
2. Mit `PASSWORD_ABDUL` anmelden.
3. Unten bei **الاستيراد / Aus Appwrite übernehmen** → **Jetzt importieren**.
   Alle Produkte, Fotos und die Einstellungen (WhatsApp-Nummer, E-Mails) werden kopiert.
   Das darf wiederholt werden, dabei entstehen keine doppelten Produkte.
   Voraussetzung: Das Appwrite-Projekt ist in dem Moment nicht pausiert.
4. Danach den Shop der Vorschau prüfen: https://claude-zen-ramanujan-10znq6.mais-beauty-shop.pages.dev/

## 6. Live schalten

Wenn alles passt, den Branch in `main` übernehmen. Ab dann zeigt `mais-beauty-shop.pages.dev`
die neue Version mit derselben Datenbank. Appwrite kann danach gekündigt oder liegen gelassen werden.

## Hilfe für Mais

- Mit `PASSWORD_ABDUL` im selben Admin anmelden. Unter **Protokoll** steht, wer wann was geändert hat.
- **Sicherung herunterladen** speichert alle Produkte und Einstellungen als Datei.
  **Wiederherstellen** spielt sie zurück. Fotos bleiben in der Datenbank.
- Daten direkt ansehen: Storage & Databases → D1 → `mais-beauty` → **Console**,
  z. B. `SELECT id, updated_by, updated_at FROM products;`
- Kaputte Code-Version: Workers & Pages → mais-beauty-shop → **Deployments** → ältere Version → **Rollback**.

## Technik (für Entwickler)

- `functions/api/[[path]].js`: die ganze API. Die Liste der Adressen steht im Kopf der Datei.
- Lokal testen ohne Konto:
  `npx wrangler pages dev . --d1 DB=mais-local --binding PASSWORD_MAIS=test1 PASSWORD_ABDUL=test2`
- Keine `wrangler.toml` ins Repo legen. Sonst übernimmt die Datei die Bindings aus dem Dashboard.
- Das Repo ist öffentlich, deshalb gehören Passwörter nur in Cloudflare-Secrets.
