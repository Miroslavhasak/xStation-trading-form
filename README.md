# Technická Dokumentácia: xStation – Trading Platforma

Jednostránková webová aplikácia slúžiaca na simuláciu zadávania nákupných trading pokynov[cite: 1, 2]. [cite_start]Ponúka moderné používateľské rozhranie inšpirované platformou XTB s plnou podporou perzistencie dát na strane klienta[cite: 3].

---

## 1. Použité Technológie
* [cite_start]**Frontend Core:** React 18+ [cite: 5]
* [cite_start]**Typový systém:** TypeScript [cite: 6]
* [cite_start]**Používateľské rozhranie:** Material UI s vlastným CSS stylovaním pre tmavý režim [cite: 7]
* [cite_start]**Zostavenie projektu:** Webpack & Babel [cite: 8]

---

## 2. Architektúra a Štruktúra Projektu
[cite_start]Projekt je organizovaný do modulárnej štruktúry s jasne oddeleným vstupným bodom a UI komponentmi[cite: 9, 10].

---

## 3. Dátový Model
[cite_start]Aplikácia pracuje s jedným hlavným typom dát reprezentujúcim tradingový pokyn, ktorý je striktne typovaný pomocou TypeScript interface[cite: 11, 12]:

typescript
interface TradingOrder {
  id: string         // Unikátny identifikátor
  ticker: string     // Ticker symbol akcie
  quantity: number   // Celé číslo reprezentujúce množstvo nakúpených kusov
  limitPrice: number // Desatinné číslo určujúce limitnú nákupnú cenu v USD
  status: string     // Stav pokynu (predvolene nastavený na 'PENDING')
  createdAt: string  // Dátum a čas vytvorenia pokynu formátovaný pre sk lokalizáciu
}
---

## 4. Funkčná Špecifikácia

### A. Správa stavu
[cite_start]Komponent `TradingForm` interne spravuje stav formulára pomocou React hooku `useState` pre ticker, quantity, limitPrice a pole uložených pokynov[cite: 22, 23].

### B. Lokálna Databáza
[cite_start]Aplikácia nevyžaduje externý backend[cite: 24, 25]. [cite_start]Využíva natívne API prehliadača `localStorage`[cite: 25]:
* [cite_start]Pri prvom vykreslení stránky aplikácia skontroluje kľúč `trading_orders` a naplní tabuľku uloženými dátami[cite: 26].
* [cite_start]Pri úspešnom odoslaní formulára sa nové pole pokynov serializuje do formátu JSON a prepíše hodnotu v `localStorage`[cite: 27].
* [cite_start]Funkcia `handleClearDatabase` kompletne vymaže kľúč z pamäte prehliadača a vyčistí stav aplikácie[cite: 28].

---

## 5. Používateľské Rozhranie
[cite_start]Vzhľad verne replikuje profesionálnu platformu xStation[cite: 29, 30]:
* [cite_start]**Farebná paleta:** Hlboká tmavosivá `#13161c` pre pozadie a antracitová `#1c202a` pre panely[cite: 31].
* [cite_start]**MUI Inputy:** Plne interaktívne polia, ktorých popisy sa plynule animujú a pri aktívnom stave sa orámovanie aj text rozsvietia na charakteristickú žltú farbu (`#ffde00`)[cite: 32].
* [cite_start]**Akčné prvky:** Výrazné tyrkysovo-zelené BUY tlačidlo pre jasnú vizuálnu odozvu nákupnej operácie[cite: 33].

---

## 6. Príručka pre Spustenie
[cite_start]Pre lokálny vývoj a spustenie aplikácie na adrese `http://localhost:3000/` slúžia nasledujúce príkazy spustené z koreňového priečinka projektu[cite: 34, 35]:

[cite_start]Inštalácia všetkých potrebných balíčkov a typových definícií[cite: 36]:
bash
npm install
