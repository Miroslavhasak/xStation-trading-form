import { neon } from '@neondatabase/serverless';

// Pripojenie do Neon databázy pomocou premennej prostredia
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Povolenie CORS, aby mohol frontend bez problémov komunikovať s backendom
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. Automaticky vytvoríme tabuľku, ak ešte v Neone neexistuje
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        ticker TEXT NOT NULL,
        quantity NUMERIC NOT NULL,
        limit_price NUMERIC NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `;

    // 2. Spracovanie GET požiadavky (Načítanie pokynov z DB)
    if (req.method === 'GET') {
      const orders = await sql`SELECT * FROM orders ORDER BY created_at DESC`;
      
      // Mapujeme názvy stĺpcov z PostgreSQL (snake_case) späť na tvoj React frontend (camelCase)
      const formattedOrders = orders.map(o => ({
        id: o.id,
        ticker: o.ticker,
        quantity: parseFloat(o.quantity),
        limitPrice: parseFloat(o.limit_price),
        status: o.status,
        createdAt: o.created_at
      }));

      return res.status(200).json(formattedOrders);
    }

    // 3. Spracovanie POST požiadavky (Uloženie nového pokynu do DB)
    if (req.method === 'POST') {
      const { id, ticker, quantity, limitPrice, status, createdAt } = req.body;

      await sql`
        INSERT INTO orders (id, ticker, quantity, limit_price, status, created_at)
        VALUES (${id}, ${ticker}, ${quantity}, ${limitPrice}, ${status}, ${createdAt})
      `;

      return res.status(201).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Chyba databázy: ' + error.message });
  }
}