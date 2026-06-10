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

// Definícia typu pre náš pokyn
interface TradingOrder {
  id: string
  ticker: string
  quantity: number
  limitPrice: number
  status: string
  createdAt: string
}

export default function TradingForm() {
  // Stavy pre formulár
  const [ticker, setTicker] = useState('')
  const [quantity, setQuantity] = useState('')
  const [limitPrice, setLimitPrice] = useState('')
  
  // Stav pre zoznam pokynov (databázu)
  const [orders, setOrders] = useState<TradingOrder[]>([])
  
  // Stav pre zobrazenie úspešného uloženia
  const [successMessage, setSuccessMessage] = useState('')

  // Načítanie pokynov z "databázy" (localStorage) pri prvom otvorení stránky
  useEffect(() => {
    const savedOrders = localStorage.getItem('trading_orders')
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  // Funkcia na odoslanie formulára a uloženie do databázy
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validácia vstupov
    if (!ticker || !quantity || !limitPrice) return

    // Vytvorenie nového pokynu
    const newOrder: TradingOrder = {
      id: crypto.randomUUID(), // Generuje unikátne ID pokynu
      ticker: ticker.toUpperCase(),
      quantity: Number(parseFloat(quantity).toFixed(3)),
      limitPrice: parseFloat(limitPrice),
      status: 'PENDING',
      createdAt: new Date().toLocaleString('sk-SK')
    }

    // Aktualizácia stavu a uloženie do localStorage (lokálna DB)
    const updatedOrders = [newOrder, ...orders]
    setOrders(updatedOrders)
    localStorage.setItem('trading_orders', JSON.stringify(updatedOrders))

    // Vyčistenie formulára
    setTicker('')
    setQuantity('')
    setLimitPrice('')

    // Zobrazenie hlášky o úspechu
    setSuccessMessage('Pokyn bol úspešne vytvorený a uložený do databázy')
    setTimeout(() => setSuccessMessage(''), 4000)
  }

  // Pomocná funkcia na vymazanie databázy (pre testovanie)
  const handleClearDatabase = () => {
    localStorage.removeItem('trading_orders')
    setOrders([])
  }

  return (
    <Box sx={{ backgroundColor: '#13161c', minHeight: '100vh', py: 5, color: '#ffffff' }}>
      <Container maxWidth="md">
        {/* Hlavný nadpis */}
        <Typography 
          variant="h5" 
          component="h1" 
          gutterBottom 
          align="center" 
          sx={{ fontWeight: 700, letterSpacing: '0.5px', mb: 4, color: '#ffffff' }}
        >
          xStation – Zadanie Pokynu
        </Typography>

        {/* Upozornenie o úspešnom uložení */}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, backgroundColor: '#1e291b', color: '#81c784' }}>
            {successMessage}
          </Alert>
        )}

        {/* Formulár pre nový pokyn */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 5, 
            backgroundColor: '#1c202a', 
            border: '1px solid #2c3242', 
            borderRadius: '4px' 
          }}
        >
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
            slotProps={{
              inputLabel: { style: { color: '#9aa0b2' } }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#13161c',
                '& fieldset': { borderColor: '#2c3242', borderRadius: '4px' },
                '&:hover fieldset': { borderColor: '#404960' },
                '&.Mui-focused fieldset': { borderColor: '#ffde00' },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#ffde00',
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#555f76',
                opacity: 1,
              }
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#13161c',
                '& fieldset': { borderColor: '#2c3242', borderRadius: '4px' },
                '&:hover fieldset': { borderColor: '#404960' },
                '&.Mui-focused fieldset': { borderColor: '#ffde00' },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#ffde00',
              }
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                backgroundColor: '#13161c',
                '& fieldset': { borderColor: '#2c3242', borderRadius: '4px' },
                '&:hover fieldset': { borderColor: '#404960' },
                '&.Mui-focused fieldset': { borderColor: '#ffde00' },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#ffde00',
              }
            }}
          />

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              fullWidth
              sx={{
                backgroundColor: '#26a69a',
                color: '#ffffff',
                fontWeight: 700,
                py: 1.5,
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#2bbbad',
                }
              }}
            >
              BUY (Nákup)
            </Button>
          </Box>
        </Paper>

        {/* Tabuľka s uloženými pokynmi z databázy */}
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#9aa0b2' }}>
          ULOŽENÉ POKYNY V DATABÁZE ({orders.length})
        </Typography>
        
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            backgroundColor: '#1c202a', 
            border: '1px solid #2c3242',
            borderRadius: '4px'
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: '#13161c' }}>
              <TableRow>
                <TableCell sx={{ color: '#9aa0b2', borderColor: '#2c3242', fontWeight: 600 }}>Čas otvorenia</TableCell>
                <TableCell sx={{ color: '#9aa0b2', borderColor: '#2c3242', fontWeight: 600 }}>Inštrument</TableCell>
                <TableCell align="right" sx={{ color: '#9aa0b2', borderColor: '#2c3242', fontWeight: 600 }}>Objem</TableCell>
                <TableCell align="right" sx={{ color: '#9aa0b2', borderColor: '#2c3242', fontWeight: 600 }}>Otváracia cena</TableCell>
                <TableCell align="center" sx={{ color: '#9aa0b2', borderColor: '#2c3242', fontWeight: 600 }}>Stav</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#555f76', borderColor: '#2c3242' }}>
                    Žiadne aktívne pozície v histórii
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: '#222733' } }}>
                    <TableCell sx={{ color: '#ffffff', borderColor: '#2c3242', fontSize: '0.9rem' }}>{order.createdAt}</TableCell>
                    <TableCell sx={{ color: '#ffffff', borderColor: '#2c3242', fontWeight: 700, fontSize: '0.9rem' }}>{order.ticker}</TableCell>
                    <TableCell align="right" sx={{ color: '#ffffff', borderColor: '#2c3242', fontSize: '0.9rem' }}>{order.quantity.toFixed(3)} ks</TableCell>
                    <TableCell align="right" sx={{ color: '#ffffff', borderColor: '#2c3242', fontSize: '0.9rem' }}>{order.limitPrice.toFixed(2)} USD</TableCell>
                    <TableCell align="center" sx={{ borderColor: '#2c3242' }}>
                      <Box 
                        component="span" 
                        sx={{ 
                          backgroundColor: '#1e291b', 
                          color: '#26a69a', 
                          px: 1.5, 
                          py: 0.3, 
                          borderRadius: '2px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          letterSpacing: '0.5px'
                        }}
                      >
                        {order.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pomocné tlačidlo pod tabuľkou */}
        {orders.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button 
              size="small" 
              sx={{ color: '#ff5252', '&:hover': { backgroundColor: 'rgba(255,82,82,0.1)' } }} 
              onClick={handleClearDatabase}
            >
              Zatvoriť všetky pozície (Vymazať DB)
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}
