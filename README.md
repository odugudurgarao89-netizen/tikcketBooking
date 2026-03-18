# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Running the Premium Theater Booking App

This project includes a **complete full-stack theater booking application** with advanced UI and payment simulation.

### Features ✨
- 🎭 **Premium Theater Experience** - December 25, 2026
- 🎫 **Interactive Seat Selection** - Visual grid with real-time updates
- 📝 **Multi-Step Booking Flow** - Personal details → Payment → Confirmation
- 💳 **Payment Simulation** - Secure form validation with card processing
- 📧 **Booking Confirmation** - Detailed receipt with all booking info
- 🔄 **Persistent Bookings** - Saved in browser localStorage
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Advanced UI** - Glassmorphism, animations, and modern design

### Tech Stack
- **Frontend**: React 19 + Vite + Modern CSS
- **Backend**: Node.js + Express + CORS
- **Styling**: Advanced CSS with animations and responsive design

### Quick Start

1. **Start the backend API** (provides seat data and booking endpoints):
```bash
npm run server
```

2. **Start the React frontend** (in a separate terminal):
```bash
npm run dev
```

3. **Open your browser** to [http://localhost:5174](http://localhost:5174)

### How to Use

1. **Select Seats**: Click on available seats (green) to select them
2. **Review Selection**: See your selected seats and total price
3. **Proceed to Booking**: Click "Proceed to Booking" button
4. **Enter Details**: Fill in your personal information
5. **Payment**: Enter card details and billing information
6. **Confirm**: Review and complete your booking
7. **Get Confirmation**: Receive detailed booking receipt

### API Endpoints

- `GET /seats` - Fetch all seats with availability status
- `POST /book` - Book seats with personal and payment details
- `GET /bookings/:id` - Get booking details by ID

### Sample Booking Data

```json
{
  "ids": [1, 2, 3],
  "bookingDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "cardNumber": "4111111111111111",
    "expiryDate": "12/26",
    "cvv": "123",
    "billingAddress": "123 Main St",
    "city": "New York",
    "zipCode": "10001",
    "country": "US"
  }
}
```

### Features in Detail

#### 🎭 Seat Selection
- Visual grid layout with 6 rows × 8 seats
- Color-coded status: Available (green), Booked (red), Selected (blue)
- Real-time updates and smooth animations

#### 📝 Booking Flow
- **Step 1**: Personal Details (name, email, phone)
- **Step 2**: Payment Information (card details, billing address)
- **Step 3**: Booking Confirmation with detailed receipt

#### 💳 Payment Simulation
- Form validation for all fields
- Card type detection (Visa, Mastercard, etc.)
- Secure input handling (only last 4 digits stored)
- Processing simulation with loading states

#### 🎨 Advanced UI
- Glassmorphism design with backdrop blur
- Smooth animations and transitions
- Responsive layout for all screen sizes
- Modern typography and color schemes
- Interactive elements with hover effects

### Data Storage

- **Backend**: In-memory storage (resets on server restart)
- **Frontend**: localStorage for persistent bookings across sessions
- **Security**: Card details are masked and only last 4 digits stored

### Development Notes

- Built with modern React hooks and functional components
- CSS Grid and Flexbox for responsive layouts
- Form validation with real-time feedback
- Error handling for API failures
- Accessibility features (ARIA labels, keyboard navigation)

---

Enjoy your premium theater booking experience! 🎭✨
