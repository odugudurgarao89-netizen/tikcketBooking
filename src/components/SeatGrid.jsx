import React from 'react'
import Seat from './Seat'
import './SeatGrid.css'

export default function SeatGrid({ seats, selectedIds, onToggleSeat }) {
  return (
    <div className="seat-grid" role="grid" aria-label="Seat selection grid">
      {seats.map((seat) => (
        <Seat
          key={seat.id}
          seat={seat}
          isSelected={selectedIds.includes(seat.id)}
          onToggle={onToggleSeat}
        />
      ))}
    </div>
  )
}
