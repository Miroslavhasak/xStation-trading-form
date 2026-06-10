# Technická Dokumentácia: xStation – Trading Platforma

Jednostránková webová aplikácia slúžiaca na simuláciu zadávania nákupných trading pokynov. Ponúka moderné používateľské rozhranie inšpirované platformou XTB s plnou podporou perzistencie dát na strane klienta.

---

## 1. Použité Technológie
* **Frontend Core:** React 18+ 
* **Typový systém:** TypeScript 
* **Používateľské rozhranie:** Material UI s vlastným CSS stylovaním pre tmavý režim
* **Zostavenie projektu:** Webpack & Babel 

---

## 2. Architektúra a Štruktúra Projektu
Projekt je organizovaný do modulárnej štruktúry s jasne oddeleným vstupným bodom a UI komponentmi.

---

## 3. Dátový Model
Aplikácia pracuje s jedným hlavným typom dát reprezentujúcim tradingový pokyn, ktorý je striktne typovaný pomocou TypeScript interface:

```typescript
interface TradingOrder {
  id: string         // Unikátny identifikátor  
  ticker: string     // Ticker symbol akcie  
  quantity: number   // Celé číslo reprezentujúce množstvo nakúpených kusov  
  limitPrice: number // Desatinné číslo určujúce limitnú nákupnú cenu v USD  
  status: string     // Stav pokynu (predvolene nastavený na 'PENDING')  
  createdAt: string  // Dátum a čas vytvorenia pokynu formátovaný pre sk lokalizáciu  
}
```
---

## 4. Funkčná Špecifikácia

### A. Správa stavu
Komponent `TradingForm` interne spravuje stav formulára pomocou React hooku `useState` pre ticker, quantity, limitPrice a pole uložených pokynov.

### B. Lokálna Databáza
Aplikácia nevyžaduje externý backend. Využíva natívne API prehliadača `localStorage`:
* Pri prvom vykreslení stránky aplikácia skontroluje kľúč `trading_orders` a naplní tabuľku uloženými dátami.
* Pri úspešnom odoslaní formulára sa nové pole pokynov serializuje do formátu JSON a prepíše hodnotu v `localStorage`.
* Funkcia `handleClearDatabase` kompletne vymaže kľúč z pamäte prehliadača a vyčistí stav aplikácie.

---

## 5. Používateľské Rozhranie
Vzhľad verne replikuje profesionálnu platformu xStation:
* **Farebná paleta:** Hlboká tmavosivá `#13161c` pre pozadie a antracitová `#1c202a` pre panely.
* **MUI Inputy:** Plne interaktívne polia, ktorých popisy sa plynule animujú a pri aktívnom stave sa orámovanie aj text rozsvietia na charakteristickú žltú farbu (`#ffde00`).
* **Akčné prvky:** Výrazné tyrkysovo-zelené BUY tlačidlo pre jasnú vizuálnu odozvu nákupnej operácie.

---

## 6. Príručka pre Spustenie
Pre lokálny vývoj a spustenie aplikácie na adrese `http://localhost:3000/` slúžia nasledujúce príkazy spustené z koreňového priečinka projektu:

Inštalácia všetkých potrebných balíčkov a typových definícií:
bash
npm install
