# Übergabe: Stand der Entwicklung

Stand: 10.11.2026 · Branch `claude/zen-ramanujan-10znq6` · `main` unverändert (`0b44d9c`)

Diese Datei zuerst lesen, wenn ein neuer Chat weitermacht. Einrichtung Schritt für Schritt:
[cloudflare-einrichten.md](cloudflare-einrichten.md).

## Regeln vom Auftraggeber (Abdul)

- **Nichts auf `main` pushen**, solange er es nicht freigibt. `main` ist die Version, die online ist.
  Alles auf diesem Branch entwickeln.
- **Ziel-Hosting: Cloudflare Pages, kostenloser Tarif („Workers Free“)**. Keine Kreditkarte, kein
  „Workers Paid“, kein R2 (verlangt eine Zahlungsart). Grund: Es darf nie Geld abgebucht werden.
- Die Cloudflare-Seite ist noch nicht öffentlich verlinkt (nicht auf Instagram). **Testen direkt auf
  Cloudflare ist erlaubt.**
- Die alte Seite liegt bei Strato (Starter-Paket) mit Appwrite. Sie läuft parallel weiter, bis
  umgezogen ist.
- Kommunikation auf Deutsch, Shop-Inhalte Arabisch (Standard), Englisch, Deutsch.
- **Handy-Ansicht hat Vorrang.** Ab 270 px Breite darf nichts überlappen, und der Schriftzug
  „MAIS BEAUTY“ bleibt sichtbar (lieber kleiner als versteckt).

## Fertig (auf dem Branch, gepusht)

| Commit | Was |
|---|---|
| `2a66799` | Neues Shop-Design, mobil zuerst: Laufband, Menü (Sprache, Hell/Dunkel), Suche, Kategorie-Kacheln, Sortierung, „Alle anzeigen“, kompakte Karten, Produktseite als Vollbild mit Kaufleiste und „Das könnte dir gefallen“, Warenkorb in 3 Schritten mit Bestätigungsseite, Zurück-Taste schließt Fenster, FAQ. Fix: Die WhatsApp-Bestellung hat den Shop-Tab nicht mehr wegnavigiert. |
| `8d68ac5` | Rabatt in % pro Produkt im Admin. Produkte mit Rabatt erscheinen unter „Angebote“ mit -X%-Badge und durchgestrichenem Preis, „Du sparst“ im Warenkorb, Rabatt-Hinweis in der Bestellnachricht. |
| `8b566dd`, `b58e34d` | Kopfzeile und untere Leiste auf schmalen Handys ohne Überlappung. Name wird kleiner statt versteckt (15 px bei 270 px). |
| `2d9ff07` | **Appwrite ersetzt durch Cloudflare Pages Functions + D1** (`functions/api/[[path]].js`). Neuer Admin (`admin.html/.css/.js`): Anmeldung nur mit Passwort (`PASSWORD_<NAME>`-Secrets), Produkte mit Foto-Upload, Rabatt, Einstellungen, Import aus Appwrite, Sicherung/Wiederherstellung, Änderungsprotokoll. Der Shop lädt alles von `/api/catalog`. Lokal mit `wrangler pages dev` getestet (28/28 Prüfungen). |
| `fdf71ec`, `0612e7c` | Anleitung `docs/cloudflare-einrichten.md`, inkl. Parallelbetrieb mit Appwrite. |

Warum D1 statt KV: KV braucht bis zu 60 s, bis Änderungen überall sichtbar sind, und zwei schnelle
Admin-Speicherungen könnten sich überschreiben. Fotos liegen ebenfalls in D1, maximal 1,9 MB pro Foto,
weil eine D1-Zeile höchstens 2 MB fassen darf.

## Offen (in dieser Reihenfolge)

1. **Cloudflare einrichten** nach [cloudflare-einrichten.md](cloudflare-einrichten.md), Schritte 1–4:
   D1 `mais-beauty` anlegen, Binding `DB` für Production **und** Preview setzen, Secrets
   `PASSWORD_MAIS` / `PASSWORD_ABDUL` anlegen, Preview neu bereitstellen.
   **Unbekannt, ob Abdul das schon gemacht hat. Zuerst fragen.**
   Alternativ macht es der Agent per API. Dafür braucht er einen Cloudflare-API-Token für
   `api.cloudflare.com` mit den Rechten *Account: Cloudflare Pages Edit, D1 Edit,
   Account Settings Read*. Die Anfrage dafür wurde zweimal gestellt, aber nie beantwortet
   (die Session wurde neu gestartet). Für den Token gibt es die persönliche Cloud-Umgebung
   **„Mais Beauty (Cloudflare)“**, die nur für dieses Repo gilt. Den Token dort speichern,
   nicht in der Default-Umgebung.
2. **Import aus Appwrite** im Admin der Vorschau
   (`https://claude-zen-ramanujan-10znq6.mais-beauty-shop.pages.dev/admin`), dann den Shop dort prüfen,
   besonders auf dem Handy.
3. Mit Abdul durchgehen. Erst nach seinem ausdrücklichen „merge in main“ den Branch in `main`
   übernehmen.
4. Danach eigene Domain bei Cloudflare verbinden, Strato und Appwrite abschalten (nur mit Freigabe).

## Fallen

- **Keine `wrangler.toml` ins Repo.** Sonst gelten die Bindings aus dem Dashboard nicht mehr.
- Free-Tarif: 10 ms CPU pro Anfrage (deshalb kein PBKDF2, sondern SHA-256-Vergleich) und
  50 Unteranfragen pro Aufruf (deshalb importiert der Admin ein Produkt pro Aufruf).
- Ein erneuter Import überschreibt Änderungen an importierten Produkten, die im neuen Admin gemacht
  wurden (siehe Anleitung, Parallelbetrieb).
- In der Cloud-Session sind `*.pages.dev` und `api.cloudflare.com` ohne Token oder freigegebenen Host
  nicht erreichbar. Lokal testen geht immer:
  `npx wrangler pages dev . --d1 DB=mais-local --binding PASSWORD_MAIS=test1 PASSWORD_ABDUL=test2`
- Die End-to-End-Testskripte aus der D1-Arbeit (28 Prüfungen, falsches Appwrite) wurden **nicht**
  ins Repo gelegt und sind mit dem Neustart verloren. Für die nächste größere Änderung neu schreiben,
  dann unter `dev/tests/` ablegen und von der Bereitstellung ausnehmen.
- Die Klick-Vorschau `https://claude.ai/artifact/TBKSjPXUfL4k1Zrxj2GVC6` zeigt den Design-Stand
  **vor** dem Cloudflare-Umzug (Testprodukte, Appwrite-Attrappe). Für Cloudflare-Funktionen gilt sie
  nicht mehr.

## Anderes Projekt, nicht verwechseln

Die Idee „Admin ohne Datenbankdienst“ stammt aus Barbaras Seite (`Abdul7Kader/Hausbesuche_mit_Hund`,
PHP bei All-Inkl). PHP läuft auf Cloudflare nicht, deshalb wurde dieselbe Idee in JavaScript mit D1
umgesetzt. **Barbaras Repo hat mit diesem Projekt nichts zu tun und wird hier nicht geändert.**

## Prompt für den nächsten Chat

````
Prompt:
Repo Abdul7Kader/Mais-Beauty-shop, Branch claude/zen-ramanujan-10znq6. Lies zuerst
docs/UEBERGABE.md und docs/cloudflare-einrichten.md. Frag mich, ob ich die Cloudflare-Einrichtung
(D1, Binding DB, Secrets PASSWORD_MAIS/PASSWORD_ABDUL) schon gemacht habe. Wenn nicht, hilf mir
Schritt für Schritt oder frag mich nach einem Cloudflare-API-Token für api.cloudflare.com in der
Umgebung "Mais Beauty (Cloudflare)". Danach Import aus Appwrite in der Vorschau und Handy-Prüfung.
Nichts auf main pushen ohne mein ausdrückliches OK.
-----
````
