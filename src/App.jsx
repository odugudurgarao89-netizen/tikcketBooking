import { useEffect, useState, useCallback } from 'react'
import SeatGrid from './components/SeatGrid'
import BookingWizard from './components/BookingWizard'
import BookingConfirmation from './components/BookingConfirmation'
import './App.css'

const API_BASE = 'http://localhost:5000'
const STORAGE_KEY = 'bookedSeatIds'
const BOOKINGS_STORAGE_KEY = 'bookingDetails'

function App() {
  const [seats, setSeats] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState(null)
  const [currentView, setCurrentView] = useState('seats') // 'seats', 'booking', 'confirmation', 'history'
  const [bookingResult, setBookingResult] = useState(null)
  const [bookingHistory, setBookingHistory] = useState([])

  const loadStoredBookedIds = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [])

  const saveStoredBookedIds = useCallback((ids) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {
      // ignore storage errors
    }
  }, [])

  const loadStoredBookings = useCallback(() => {
    try {
      const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }, [])

  const saveStoredBookings = useCallback((bookings) => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings))
    } catch {
      // ignore storage errors
    }
  }, [])

  const fetchSeats = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/seats`)
      if (!res.ok) throw new Error(`Failed to load seats (${res.status})`)
      const data = await res.json()
      const storedBookedIds = loadStoredBookedIds()
      const merged = data.map((seat) =>
        storedBookedIds.includes(seat.id) ? { ...seat, status: 'booked' } : seat,
      )

      setSeats(merged)
      setSelectedIds([])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [loadStoredBookedIds])

  useEffect(() => {
    fetchSeats()
    // Load booking history from localStorage
    const storedBookings = loadStoredBookings()
    setBookingHistory(storedBookings)
  }, [fetchSeats, loadStoredBookings])

  const toggleSeat = (seatId) => {
    if (currentView !== 'seats') return
    setSelectedIds((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId],
    )
  }

  const handleBookClick = () => {
    if (!selectedIds.length) return
    setCurrentView('booking')
  }

  const handleBookingComplete = async (bookingData) => {
    setBooking(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, bookingDetails: bookingData }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || `Booking failed (${res.status})`)
      }

      const result = await res.json()

      // Update local storage with new booked seats
      const storedBookedIds = loadStoredBookedIds()
      const newBookedIds = result.booking.seats.map(seat => seat.id)
      const mergedBookedIds = Array.from(new Set([...storedBookedIds, ...newBookedIds]))
      saveStoredBookedIds(mergedBookedIds)

      // Save complete booking details to localStorage
      const storedBookings = loadStoredBookings()
      const completeBooking = {
        ...result.booking,
        bookingDetails: bookingData,
        timestamp: new Date().toISOString()
      }
      storedBookings.push(completeBooking)
      saveStoredBookings(storedBookings)

      // Update seats state
      setSeats((prev) =>
        prev.map((seat) =>
          newBookedIds.includes(seat.id) ? { ...seat, status: 'booked' } : seat,
        ),
      )

      // Set booking result for confirmation
      setBookingResult(completeBooking)

      setCurrentView('confirmation')
      setSelectedIds([])
    } catch (err) {
      setError(err.message)
      setCurrentView('seats')
    } finally {
      setBooking(false)
    }
  }

  const handleBookingCancel = () => {
    setCurrentView('seats')
  }

  const handleNewBooking = () => {
    setCurrentView('seats')
    setBookingResult(null)
    fetchSeats()
  }

  const selectedSeats = seats.filter((s) => selectedIds.includes(s.id))
  const totalAmount = selectedSeats.length * 15

  return (
    <div className="app">
      <header className="app__header">
        <h1>🎭 Premium Theater Booking</h1>
        <p>Experience world-class entertainment with our premium seating</p>
      </header>

      <div className="app__legend">
        <div className="legend-item">
          <div className="legend-color legend--available"></div>
          <span>Available - $15</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend--booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend--selected"></div>
          <span>Selected</span>
        </div>
      </div>

      {error && (
        <div className="app__error">
          ⚠️ {error}
          <button
            className="error-close"
            onClick={() => setError(null)}
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}

      {currentView === 'seats' && (
        <>
          {loading ? (
            <div className="app__loading">
              <div className="spinner"></div>
              <p>Loading premium seats...</p>
            </div>
          ) : (
            <>
              <SeatGrid seats={seats} selectedIds={selectedIds} onToggleSeat={toggleSeat} />

              {selectedIds.length > 0 && (
                <div className="app__summary">
                  <h3>Selected Seats ({selectedIds.length})</h3>
                  <div className="selected-seats">
                    {selectedSeats.map(seat => (
                      <span key={seat.id} className="seat-tag">{seat.seatNumber}</span>
                    ))}
                  </div>
                  <div className="summary-total">
                    <span>Total: </span>
                    <strong>${totalAmount}</strong>
                  </div>
                </div>
              )}

              <div className="app__actions">
                <button
                  className="button button--primary"
                  onClick={handleBookClick}
                  disabled={!selectedIds.length || booking}
                >
                  Proceed to Booking →
                </button>
                <button
                  className="button button--secondary"
                  onClick={() => setSelectedIds([])}
                  disabled={!selectedIds.length}
                >
                  Clear Selection
                </button>
                <button
                  className="button button--outline"
                  onClick={fetchSeats}
                  disabled={loading}
                >
                  Refresh Seats
                </button>
                <button
                  className="button button--outline"
                  onClick={() => setCurrentView('history')}
                >
                  View Bookings
                </button>
              </div>
            </>
          )}
        </>
      )}

      {currentView === 'booking' && (
        <BookingWizard
          selectedSeats={selectedSeats}
          totalAmount={totalAmount}
          onCancel={handleBookingCancel}
          onComplete={handleBookingComplete}
        />
      )}

      {currentView === 'confirmation' && bookingResult && (
        <BookingConfirmation
          booking={bookingResult}
          onNewBooking={handleNewBooking}
        />
      )}

      {currentView === 'history' && (
        <div className="booking-history">
          <div className="booking-history__header">
            <h2>Your Booking History</h2>
            <button
              className="button button--outline"
              onClick={() => setCurrentView('seats')}
            >
              ← Back to Seats
            </button>
          </div>

          {bookingHistory.length === 0 ? (
            <div className="booking-history__empty">
              <p>No bookings found. Your booking history will appear here after you make a reservation.</p>
            </div>
          ) : (
            <div className="booking-history__list">
              {bookingHistory.map((booking) => (
                <div key={booking.id} className="booking-history__item">
                  <div className="booking-history__item-header">
                    <h3>Booking #{booking.id}</h3>
                    <span className="booking-history__status">{booking.status}</span>
                  </div>
                  <div className="booking-history__details">
                    <div className="booking-history__seats">
                      <strong>Seats:</strong> {booking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                    </div>
                    <div className="booking-history__amount">
                      <strong>Total:</strong> ${booking.totalAmount}
                    </div>
                    <div className="booking-history__date">
                      <strong>Date:</strong> {new Date(booking.timestamp).toLocaleString()}
                    </div>
                    <div className="booking-history__customer">
                      <strong>Customer:</strong> {booking.bookingDetails.name}
                    </div>
                    <div className="booking-history__email">
                      <strong>Email:</strong> {booking.bookingDetails.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <footer className="app__footer">
        <small>
          🎭 Premium Theater Experience - December 25, 2026
          <br />
          Bookings are secured and stored safely. Server data resets on restart.
        </small>
      </footer>
    </div>
  )
}

export default App

