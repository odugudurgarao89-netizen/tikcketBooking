import React from 'react'
import './Seat.css'

export default function Seat({ seat, isSelected, onToggle }) {
  const isBooked = seat.status === 'booked'
  const isAvailable = seat.status === 'available'

  const className = [
    'seat',
    isBooked ? 'seat--booked' : 'seat--available',
    isSelected ? 'seat--selected' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (isAvailable) onToggle(seat.id)
      }}
      disabled={!isAvailable}
      aria-pressed={isSelected}
      aria-label={`${seat.seatNumber} - ${seat.status}`}
    >
      <span className="seat__label">{seat.seatNumber}</span>
      <span className="seat__status">{seat.status}</span>
    </button>
  )
}
