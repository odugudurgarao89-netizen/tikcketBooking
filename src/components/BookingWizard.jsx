import React, { useState } from 'react'
import BookingForm from './BookingForm'
import PaymentForm from './PaymentForm'
import './BookingWizard.css'

export default function BookingWizard({ selectedSeats, totalAmount, onCancel, onComplete }) {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState({})

  const handlePersonalDetailsNext = (data) => {
    setBookingData(data)
    setStep(2)
  }

  const handlePaymentBack = () => {
    setStep(1)
  }

  const handlePaymentConfirm = (completeData) => {
    onComplete({ ...bookingData, ...completeData })
  }

  return (
    <div className="booking-wizard">
      <div className="wizard-header">
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Details</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
        </div>
      </div>

      <div className="wizard-content">
        {step === 1 && (
          <BookingForm
            onNext={handlePersonalDetailsNext}
            onCancel={onCancel}
            selectedSeats={selectedSeats}
            totalAmount={totalAmount}
          />
        )}

        {step === 2 && (
          <PaymentForm
            onBack={handlePaymentBack}
            onConfirm={handlePaymentConfirm}
            bookingData={bookingData}
            selectedSeats={selectedSeats}
            totalAmount={totalAmount}
          />
        )}
      </div>
    </div>
  )
}