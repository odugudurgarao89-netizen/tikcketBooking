import React from 'react'
import './BookingConfirmation.css'

export default function BookingConfirmation({ booking, onNewBooking }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <div className="success-icon">✅</div>
        <h2>Booking Confirmed!</h2>
        <p>Your tickets have been successfully booked</p>
      </div>

      <div className="confirmation-details">
        <div className="detail-card">
          <h3>📅 Booking Details</h3>
          <div className="detail-row">
            <span>Booking ID:</span>
            <strong>{booking.id}</strong>
          </div>
          <div className="detail-row">
            <span>Booked on:</span>
            <strong>{formatDate(booking.timestamp)}</strong>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <span className="status-badge status--confirmed">{booking.status}</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>🎭 Show Information</h3>
          <div className="detail-row">
            <span>Event:</span>
            <strong>Premium Theater Experience</strong>
          </div>
          <div className="detail-row">
            <span>Date & Time:</span>
            <strong>December 25, 2026 - 8:00 PM</strong>
          </div>
          <div className="detail-row">
            <span>Venue:</span>
            <strong>Grand Theater, Downtown</strong>
          </div>
        </div>

        <div className="detail-card">
          <h3>🎫 Ticket Details</h3>
          <div className="seats-list">
            {booking.seats.map(seat => (
              <div key={seat.id} className="seat-item">
                <span className="seat-number">{seat.seatNumber}</span>
                <span className="seat-type">Standard Seat</span>
                <span className="seat-price">$15.00</span>
              </div>
            ))}
          </div>
          <div className="total-row">
            <span>Total Amount:</span>
            <strong>${booking.totalAmount.toFixed(2)}</strong>
          </div>
        </div>

        <div className="detail-card">
          <h3>👤 Customer Information</h3>
          <div className="detail-row">
            <span>Name:</span>
            <strong>{booking.bookingDetails.name}</strong>
          </div>
          <div className="detail-row">
            <span>Email:</span>
            <strong>{booking.bookingDetails.email}</strong>
          </div>
          <div className="detail-row">
            <span>Phone:</span>
            <strong>{booking.bookingDetails.phone}</strong>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button className="button button--primary" onClick={onNewBooking}>
          Book More Tickets
        </button>
        <button className="button button--outline" onClick={() => window.print()}>
          📄 Print Confirmation
        </button>
      </div>

      <div className="confirmation-notice">
        <p>
          📧 A confirmation email has been sent to <strong>{booking.bookingDetails.email}</strong>
        </p>
        <p>
          📱 Please arrive 30 minutes before showtime. Bring a valid ID for entry.
        </p>
      </div>
    </div>
  )
}