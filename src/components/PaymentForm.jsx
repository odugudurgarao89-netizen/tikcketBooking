import React, { useState } from 'react'
import './PaymentForm.css'

export default function PaymentForm({ onBack, onConfirm, bookingData, selectedSeats, totalAmount }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US'
  })
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      setFormData(prev => ({ ...prev, [name]: formatted }))
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2')
      setFormData(prev => ({ ...prev, [name]: formatted }))
    }
    // Limit CVV to 4 digits
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').slice(0, 4)
      setFormData(prev => ({ ...prev, [name]: formatted }))
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Card number validation (basic)
    const cardNumber = formData.cardNumber.replace(/\s/g, '')
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required'
    } else if (!/^\d{13,19}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Invalid card number'
    }

    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required'
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)'
    } else {
      const [month, year] = formData.expiryDate.split('/')
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month'
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired'
      }
    }

    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required'
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV'
    }

    // Card name validation
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Name on card is required'
    }

    // Billing address validation
    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const completeBookingData = {
      ...bookingData,
      ...formData,
      cardNumber: formData.cardNumber.replace(/\s/g, '').slice(-4) // Only store last 4 digits
    }

    onConfirm(completeBookingData)
    setProcessing(false)
  }

  const getCardType = (number) => {
    const num = number.replace(/\s/g, '')
    if (/^4/.test(num)) return 'Visa'
    if (/^5[1-5]/.test(num)) return 'Mastercard'
    if (/^3[47]/.test(num)) return 'American Express'
    if (/^6(?:011|5)/.test(num)) return 'Discover'
    return ''
  }

  return (
    <div className="payment-form">
      <div className="form-header">
        <h2>💳 Payment Details</h2>
        <p>Secure payment processing</p>
      </div>

      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <div className="summary-details">
          <div className="summary-row">
            <span>Seats:</span>
            <span>{selectedSeats.map(s => s.seatNumber).join(', ')}</span>
          </div>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${totalAmount}</span>
          </div>
          <div className="summary-row">
            <span>Processing Fee:</span>
            <span>$2.99</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${(totalAmount + 2.99).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-section">
          <h3>Card Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number *</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className={errors.cardNumber ? 'error' : ''}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {getCardType(formData.cardNumber) && (
                  <span className="card-type">{getCardType(formData.cardNumber)}</span>
                )}
              </div>
              {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date *</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className={errors.expiryDate ? 'error' : ''}
                placeholder="MM/YY"
                maxLength="5"
              />
              {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV *</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                className={errors.cvv ? 'error' : ''}
                placeholder="123"
                maxLength="4"
              />
              {errors.cvv && <span className="error-message">{errors.cvv}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cardName">Name on Card *</label>
            <input
              type="text"
              id="cardName"
              name="cardName"
              value={formData.cardName}
              onChange={handleChange}
              className={errors.cardName ? 'error' : ''}
              placeholder="John Doe"
            />
            {errors.cardName && <span className="error-message">{errors.cardName}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Billing Address</h3>
          <div className="form-group">
            <label htmlFor="billingAddress">Street Address *</label>
            <input
              type="text"
              id="billingAddress"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              className={errors.billingAddress ? 'error' : ''}
              placeholder="123 Main Street"
            />
            {errors.billingAddress && <span className="error-message">{errors.billingAddress}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={errors.city ? 'error' : ''}
                placeholder="New York"
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">ZIP Code *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={errors.zipCode ? 'error' : ''}
                placeholder="10001"
              />
              {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country *</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>

        <div className="security-notice">
          <div className="security-icon">🔒</div>
          <p>Your payment information is encrypted and secure. We never store your full card details.</p>
        </div>

        <div className="form-actions">
          <button type="button" className="button button--outline" onClick={onBack} disabled={processing}>
            ← Back to Details
          </button>
          <button type="submit" className="button button--primary" disabled={processing}>
            {processing ? (
              <>
                <div className="spinner-small"></div>
                Processing...
              </>
            ) : (
              `Pay $${(totalAmount + 2.99).toFixed(2)}`
            )}
          </button>
        </div>
      </form>
    </div>
  )
}