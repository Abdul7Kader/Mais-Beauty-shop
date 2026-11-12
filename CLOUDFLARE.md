# Mais Beauty auf Cloudflare (ohne Appwrite)

Der Shop läuft komplett auf Cloudflare Pages:

| Teil | Cloudflare-Dienst | Wo im Code |
|---|---|---|
| Webseite (HTML, CSS, JS) | Pages (mit GitHub verbunden, `main` = live) | `index.html`, `script.js`, `admin.html`, `admin.js` |
| Schnittstellen (API) | Pages Functions | `functions/` |
| Produkte und Shop-Einstellungen | D1-Datenbank, Binding `DB` | Tabellen werden automatisch angelegt |
| Produktfotos (übernommen aus Appwrite) | feste Dateien im Repository | `assets/produkte/` |
| Neu hochgeladene Produktfotos | R2-Bucket, Binding `BILDER` | ausgeliefert unter `/bilder/...` |
| Admin-Passwort | Secret `ADMIN_PASSWORD` | Anmeldung per Cookie, 7 Tage gültig |

## Einmalige Einrichtung im Cloudflare-Dashboard (dash.cloudflare.com)

1. **D1-Datenbank anlegen:** *Storage & Databases → D1 SQL Database → Create* → Name `mais-beauty-db`.
2. **R2 aktivieren und Bucket anlegen:** *Storage & Databases → R2 Object Storage* → (beim ersten Mal R2 aktivieren; Cloudflare verlangt dafür eine Zahlungsmethode, der Gratis-Rahmen von 10 GB reicht aber locker) → *Create bucket* → Name `mais-beauty-bilder`.
3. **Mit dem Pages-Projekt verknüpfen:** *Workers & Pages → mais-beauty-shop → Settings → Bindings → Add*
   - *D1 database*: Variable name `DB` → Datenbank `mais-beauty-db`
   - *R2 bucket*: Variable name `BILDER` → Bucket `mais-beauty-bilder`
   - Beides für **Production** und **Preview** (oben auf der Seite umschalten).
4. **Admin-Passwort setzen:** *Settings → Variables and Secrets → Add* → Typ **Secret**, Name `ADMIN_PASSWORD`, Wert = dein neues Admin-Passwort. Ebenfalls für Production **und** Preview.
   Optional `SESSION_SECRET` (beliebige lange Zufallszeichenfolge); ohne wird der Sitzungsschlüssel aus dem Passwort abgeleitet. Wer das Passwort ändert, meldet damit alle Sitzungen ab.
5. **Neu bereitstellen**, damit die Bindings greifen: *Deployments* → beim neuesten Deployment *⋯ → Retry deployment*.

Der Umzug aus Appwrite passiert danach von selbst: Beim ersten Aufruf füllt sich die leere Datenbank mit allen 48 Produkten und den Shop-Einstellungen (Stand 12.11.2026, Daten in `functions/_shared/seed-data.js`, Fotos in `assets/produkte/`). Das passiert nur ein einziges Mal; im Admin gelöschte Produkte kommen nicht zurück.

Ohne R2 läuft der Shop bereits vollständig, nur neue Fotos können im Admin erst nach Schritt 2 hochgeladen werden.

Fehlt etwas davon, zeigt die Admin-Anmeldung einen gelben Hinweis, was noch fehlt.

## Danach

- Das Appwrite-Projekt bleibt bestehen; die alte Appwrite-Version der Webseite läuft parallel weiter. Beide Versionen haben **getrennte Daten**: Was im Appwrite-Admin geändert wird, erscheint nicht in der Cloudflare-Version und umgekehrt. Übernommen wurde einmalig der Stand vom 12.11.2026.
- Datensicherung: *D1 → mais-beauty-db → Time Travel* stellt die Datenbank auf einen früheren Zeitpunkt zurück (Gratis-Plan: letzte 7 Tage, bezahlter Plan: 30 Tage).

## Lokal testen

```bash
printf 'ADMIN_PASSWORD=test\n' > .dev.vars
npx wrangler pages dev . --d1 DB --r2 BILDER
```

Dann http://localhost:8788 und http://localhost:8788/admin.html öffnen.
