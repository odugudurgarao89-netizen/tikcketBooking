import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// In-memory data storage
let seats = []
let bookings = [] // Store booking details

function createSeats(rows = 6, cols = 8) {
  const generated = []
  const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const seatNumber = `${rowLetters[r]}${c}`
      generated.push({
        id: r * cols + c,
        seatNumber,
        status: Math.random() < 0.3 ? 'booked' : 'available', // More booked seats for demo
      })
    }
  }
  return generated
}

// Seed with seats on server start
seats = createSeats(6, 8)

app.get('/api/seats', (req, res) => {
  res.json(seats)
})

app.post('/api/book', (req, res) => {
  const { ids, bookingDetails } = req.body || {}

  if (!Array.isArray(ids) || !bookingDetails) {
    return res.status(400).json({ error: 'Expected { ids: [number], bookingDetails: {...} } in request body' })
  }

  // Validate booking details
  const required = ['name', 'email', 'phone', 'cardNumber', 'expiryDate', 'cvv', 'billingAddress']
  for (const field of required) {
    if (!bookingDetails[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` })
    }
  }

  // Check if seats are still available
  const unavailableSeats = ids.filter(id => {
    const seat = seats.find(s => s.id === id)
    return !seat || seat.status !== 'available'
  })

  if (unavailableSeats.length > 0) {
    return res.status(409).json({ error: 'Some seats are no longer available', unavailableSeats })
  }

  // Update seat status
  seats = seats.map((seat) => {
    if (ids.includes(seat.id)) {
      return { ...seat, status: 'booked' }
    }
    return seat
  })

  // Create booking record
  const booking = {
    id: Date.now().toString(),
    seatIds: ids,
    bookingDetails,
    totalAmount: ids.length * 15,
    timestamp: new Date().toISOString(),
    status: 'confirmed'
  }

  bookings.push(booking)

  const bookedSeats = seats.filter((s) => ids.includes(s.id))
  res.json({
    success: true,
    booking: {
      id: booking.id,
      seats: bookedSeats,
      totalAmount: booking.totalAmount,
      status: booking.status
    }
  })
})

app.get('/api/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id)
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' })
  }
  res.json(booking)
})

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '..', 'dist')))

// Catch all handler: send back index.html for client-side routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Seat booking API running on http://localhost:${PORT}`)
})

