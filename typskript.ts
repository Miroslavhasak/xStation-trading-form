<<<<<<< HEAD
import express, { Request, Response } from 'express'
import { Pool } from 'pg'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors()) // Aby ti FE mohol bez problémov posielať requesty

// Pripojenie na PostgreSQL - uprav si údaje podľa svojej lokálnej DB
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'trading_db',
    password: 'password',
    port: 5432,
})

// TypeScript interface pre náš pokyn
interface Order {
    id: number
    ticker: string
    quantity: number
    limit_price: number
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
    idempotency_key: string
    version: number
}

// 1 ENDPOINT: Vytvorenie pokynu s Idempotenciou
app.post('/api/orders', async (req: Request, res: Response): Promise<void> => {
    const idempotencyKey = req.headers['x-idempotency-key'] as string
    const { ticker, quantity, limitPrice } = req.body

    if (!idempotencyKey) {
        res.status(400).json({ error: 'X-Idempotency-Key header is required' })
        return
    }

    try {
        // Krok A: Pozrieme sa, či už pokyn s týmto kľúčom existuje
        const existingOrderCheck = await pool.query<Order>(
            'SELECT * FROM orders WHERE idempotency_key = $1',
            [idempotencyKey]
        )

        if (existingOrderCheck.rows.length > 0) {
            // Akceptačné kritérium: Opakovaný request vráti existujúci pokyn bez duplicity
            res.status(200).json(existingOrderCheck.rows[0])
            return
        }

        // Krok B: Pokyn neexistuje, skúsime ho vytvoriť
        const newOrder = await pool.query<Order>(
            `INSERT INTO orders (ticker, quantity, limit_price, idempotency_key, status, version) 
             VALUES ($1, $2, $3, $4, 'PENDING', 0) 
             RETURNING *`,
            [ticker, quantity, limitPrice, idempotencyKey]
        )

        res.status(201).json(newOrder.rows[0])
    } catch (error: any) {
        // Krok C: Ochrana pre prípad, že by dva identické requesty prešli SELECT kontrolou v rovnakú milisekundu
        // Postgres kód '23505' znamená unique_violation (porušenie unikátneho indexu)
        if (error.code === '23505') {
            const retryOrderCheck = await pool.query<Order>(
                'SELECT * FROM orders WHERE idempotency_key = $1',
                [idempotencyKey]
            )
            res.status(200).json(retryOrderCheck.rows[0])
            return
        }
        
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// 2 ENDPOINT: Úprava pokynu s Optimistic Lockom a kontrolou stavu
app.put('/api/orders/:id', async (req: Request, res: Response): Promise<void> => {
    const orderId = parseInt(req.params.id)
    const { quantity, limitPrice, version } = req.body // FE musí poslať verziu, ktorú má momentálne načítanú

    try {
        // Krok A: Načítame aktuálny stav pokynu priamo z DB
        const currentOrderCheck = await pool.query<Order>(
            'SELECT * FROM orders WHERE id = $1',
            [orderId]
        )

        if (currentOrderCheck.rows.length === 0) {
            res.status(404).json({ error: 'Order not found' })
            return
        }

        const currentOrder = currentOrderCheck.rows[0]

        // Akceptačné kritérium: Pokyn je možné upraviť iba pred PROCESSING
        if (currentOrder.status !== 'PENDING') {
            res.status(400).json({ error: 'Order cannot be edited because it is already ' + currentOrder.status })
            return
        }

        // Krok B: Vykonáme update s kontrolou verzie (Optimistic Lock)
        const updateResult = await pool.query(
            `UPDATE orders 
             SET quantity = $1, limit_price = $2, version = version + 1 
             WHERE id = $3 AND version = $4`,
            [quantity, limitPrice, orderId, version]
        )

        // Akceptačné kritérium: Pri neaktuálnej verzii sa update odmietne (paralelný update)
        if (updateResult.rowCount === 0) {
            res.status(409).json({ 
                error: 'Conflict: The order was updated or modified by another process Please refresh your data' 
            })
            return
        }

        res.status(200).json({ message: 'Order updated successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// 3 POMOCNÉ ENDPOINTY PRE FE (Uľahčia ti testovanie a simuláciu stavov)

// Zoznam všetkých pokynov pre FE tabuľku
app.get('/api/orders', async (req: Request, res: Response) => {
    const allOrders = await pool.query<Order>('SELECT * FROM orders ORDER BY id DESC')
    res.json(allOrders.rows)
})

// Pomocný endpoint na simuláciu zmeny stavu (napr. že worker začal spracovanie)
app.patch('/api/orders/:id/process', async (req: Request, res: Response) => {
    const orderId = req.params.id
    await pool.query('UPDATE orders SET status = \'PROCESSING\', version = version + 1 WHERE id = $1', [orderId])
    res.json({ message: 'Order status simulation changed to PROCESSING' })
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Trading BE running on port ${PORT}`)
=======
import express, { Request, Response } from 'express'
import { Pool } from 'pg'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors()) // Aby ti FE mohol bez problémov posielať requesty

// Pripojenie na PostgreSQL - uprav si údaje podľa svojej lokálnej DB
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'trading_db',
    password: 'password',
    port: 5432,
})

// TypeScript interface pre náš pokyn
interface Order {
    id: number
    ticker: string
    quantity: number
    limit_price: number
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
    idempotency_key: string
    version: number
}

// 1 ENDPOINT: Vytvorenie pokynu s Idempotenciou
app.post('/api/orders', async (req: Request, res: Response): Promise<void> => {
    const idempotencyKey = req.headers['x-idempotency-key'] as string
    const { ticker, quantity, limitPrice } = req.body

    if (!idempotencyKey) {
        res.status(400).json({ error: 'X-Idempotency-Key header is required' })
        return
    }

    try {
        // Krok A: Pozrieme sa, či už pokyn s týmto kľúčom existuje
        const existingOrderCheck = await pool.query<Order>(
            'SELECT * FROM orders WHERE idempotency_key = $1',
            [idempotencyKey]
        )

        if (existingOrderCheck.rows.length > 0) {
            // Akceptačné kritérium: Opakovaný request vráti existujúci pokyn bez duplicity
            res.status(200).json(existingOrderCheck.rows[0])
            return
        }

        // Krok B: Pokyn neexistuje, skúsime ho vytvoriť
        const newOrder = await pool.query<Order>(
            `INSERT INTO orders (ticker, quantity, limit_price, idempotency_key, status, version) 
             VALUES ($1, $2, $3, $4, 'PENDING', 0) 
             RETURNING *`,
            [ticker, quantity, limitPrice, idempotencyKey]
        )

        res.status(201).json(newOrder.rows[0])
    } catch (error: any) {
        // Krok C: Ochrana pre prípad, že by dva identické requesty prešli SELECT kontrolou v rovnakú milisekundu
        // Postgres kód '23505' znamená unique_violation (porušenie unikátneho indexu)
        if (error.code === '23505') {
            const retryOrderCheck = await pool.query<Order>(
                'SELECT * FROM orders WHERE idempotency_key = $1',
                [idempotencyKey]
            )
            res.status(200).json(retryOrderCheck.rows[0])
            return
        }
        
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// 2 ENDPOINT: Úprava pokynu s Optimistic Lockom a kontrolou stavu
app.put('/api/orders/:id', async (req: Request, res: Response): Promise<void> => {
    const orderId = parseInt(req.params.id)
    const { quantity, limitPrice, version } = req.body // FE musí poslať verziu, ktorú má momentálne načítanú

    try {
        // Krok A: Načítame aktuálny stav pokynu priamo z DB
        const currentOrderCheck = await pool.query<Order>(
            'SELECT * FROM orders WHERE id = $1',
            [orderId]
        )

        if (currentOrderCheck.rows.length === 0) {
            res.status(404).json({ error: 'Order not found' })
            return
        }

        const currentOrder = currentOrderCheck.rows[0]

        // Akceptačné kritérium: Pokyn je možné upraviť iba pred PROCESSING
        if (currentOrder.status !== 'PENDING') {
            res.status(400).json({ error: 'Order cannot be edited because it is already ' + currentOrder.status })
            return
        }

        // Krok B: Vykonáme update s kontrolou verzie (Optimistic Lock)
        const updateResult = await pool.query(
            `UPDATE orders 
             SET quantity = $1, limit_price = $2, version = version + 1 
             WHERE id = $3 AND version = $4`,
            [quantity, limitPrice, orderId, version]
        )

        // Akceptačné kritérium: Pri neaktuálnej verzii sa update odmietne (paralelný update)
        if (updateResult.rowCount === 0) {
            res.status(409).json({ 
                error: 'Conflict: The order was updated or modified by another process Please refresh your data' 
            })
            return
        }

        res.status(200).json({ message: 'Order updated successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// 3 POMOCNÉ ENDPOINTY PRE FE (Uľahčia ti testovanie a simuláciu stavov)

// Zoznam všetkých pokynov pre FE tabuľku
app.get('/api/orders', async (req: Request, res: Response) => {
    const allOrders = await pool.query<Order>('SELECT * FROM orders ORDER BY id DESC')
    res.json(allOrders.rows)
})

// Pomocný endpoint na simuláciu zmeny stavu (napr. že worker začal spracovanie)
app.patch('/api/orders/:id/process', async (req: Request, res: Response) => {
    const orderId = req.params.id
    await pool.query('UPDATE orders SET status = \'PROCESSING\', version = version + 1 WHERE id = $1', [orderId])
    res.json({ message: 'Order status simulation changed to PROCESSING' })
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Trading BE running on port ${PORT}`)
>>>>>>> de8e149c05c5746aeb8f332529654fd1dceee462
})