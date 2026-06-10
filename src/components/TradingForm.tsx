import React, { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Alert
} from '@mui/material'

interface TradingOrder {
  id: string
  ticker: string
  quantity: number
  limitPrice: number
  status: string
  createdAt: string
}

export default function TradingForm() {
  const [ticker, setTicker] = useState('')
  const [quantity, setQuantity] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  const [orders, setOrders] = useState<TradingOrder[]>([])
  const [successMessage, setSuccessMessage] = useState('')

  // Načítanie z databázy pri štarte
  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOrders(data)
      })
      .catch(err => console.error('Chyba pri načítaní:', err))
  }, [])

  // Odoslanie do databázy
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticker || !quantity || !limitPrice) return

    const newOrder: TradingOrder = {
      id: crypto.randomUUID(),
      ticker: ticker.toUpperCase(),
      quantity: Number(parseFloat(quantity).toFixed(3)),
      limitPrice: parseFloat(limitPrice),
      status: 'PENDING',
      createdAt: new Date().toLocaleString('sk-SK')
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      })

      if (response.ok) {
        setOrders([newOrder, ...orders])
        setTicker('')
        setQuantity('')
        setLimitPrice('')
        setSuccessMessage('Pokyn bol úspešne uložený do databázy')
        setTimeout(() => setSuccessMessage(''), 4000)
      }
    } catch (error) {
      console.error('Chyba pri zápise:', error)
    }
  }

  // Funkcia na vymazanie je v tomto momente len pre tvoj lokálny stav
  // (Pre úplné mazanie z DB by sme museli do api/orders.js pridať DELETE metódu)
  const handleClearDatabase = () => {
    setOrders([])
  }

  return (
    <Box sx={{ backgroundColor: '#13161c', minHeight: '100vh', py: 5, color: '#ffffff' }}>
      <Container maxWidth="md">
        <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 4, color: '#ffffff' }}>
          xStation – Zadanie Pokynu
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, backgroundColor: '#1e291b', color: '#81c784' }}>
            {successMessage}
          </Alert>
        )}

        <Paper sx={{ p: 4, mb: 5, backgroundColor: '#1c202a', border: '1px solid #2c3242', borderRadius: '4px' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: '#9aa0b2' }}>
            NOVÝ NÁKUPNÝ POKYN
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Ticker akcie"
              variant="outlined"
              placeholder="Napr. Apple, Tesla"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              required
              fullWidth
              slotProps={{ inputLabel: { style: { color: '#9aa0b2' } } }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#ffffff', backgroundColor: '#13161c', '& fieldset': { borderColor: '#2c3242' } } }}
            />
            
            <TextField
              label="Množstvo (ks)"
              type="number"
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              fullWidth
              slotProps={{ 
                htmlInput: { min: '0.001', step: '0.001', inputMode: 'decimal' },
                inputLabel: { style: { color: '#9aa0b2' } }
              }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#ffffff', backgroundColor: '#13161c', '& fieldset': { borderColor: '#2c3242' } } }}
            />
            
            <TextField
              label="Limitná cena (USD)"
              type="number"
              variant="outlined"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              required
              fullWidth
              slotProps={{ 
                htmlInput: { min: '0.01', step: '0.01', inputMode: 'decimal' },
                inputLabel: { style: { color: '#9aa0b2' } }
              }}
              sx={{ '& .MuiOutlinedInput-root': { color: '#ffffff', backgroundColor: '#13161c', '& fieldset': { borderColor: '#2c3242' } } }}
            />

            <Button type="submit" variant="contained" size="large" fullWidth sx={{ backgroundColor: '#26a69a' }}>
              BUY (Nákup)
            </Button>
          </Box>
        </Paper>

        <TableContainer component={Paper} sx={{ backgroundColor: '#1c202a', border: '1px solid #2c3242' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#13161c' }}>
              <TableRow>
                <TableCell sx={{ color: '#9aa0b2' }}>Čas otvorenia</TableCell>
                <TableCell sx={{ color: '#9aa0b2' }}>Inštrument</TableCell>
                <TableCell align="right" sx={{ color: '#9aa0b2' }}>Objem</TableCell>
                <TableCell align="right" sx={{ color: '#9aa0b2' }}>Otváracia cena</TableCell>
                <TableCell align="center" sx={{ color: '#9aa0b2' }}>Stav</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell sx={{ color: '#ffffff' }}>{order.createdAt}</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 700 }}>{order.ticker}</TableCell>
                  <TableCell align="right" sx={{ color: '#ffffff' }}>{order.quantity.toFixed(3)} ks</TableCell>
                  <TableCell align="right" sx={{ color: '#ffffff' }}>{order.limitPrice.toFixed(2)} USD</TableCell>
                  <TableCell align="center" sx={{ color: '#26a69a' }}>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  )
}