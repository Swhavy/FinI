# FinI — Financial Identity

> **An honest financial companion built for a cash-first economy.**

FinI is an intelligent financial companion designed to help everyday Nigerians better understand their money. Unlike traditional finance apps that assume all spending is digital, FinI recognizes that cash transactions are often invisible once money leaves the bank.

By combining bank transaction synchronization, a custom **Cash Pool** confidence model, and an AI-powered financial companion, FinI helps users gain meaningful insights into their spending without pretending to know what it can't.

---

## ✨ Features

- 🏦 Bank transaction synchronization (Mono-ready architecture)
- 💵 Cash Pool model for tracking withdrawn cash with honest uncertainty
- 🤖 AI financial companion powered by Fireworks AI (Qwen)
- 📊 Spending insights and behavioural analysis
- 📈 Smart financial guidance based on spending patterns
- 🔒 Privacy-first approach with minimal financial data storage
- ⚡ Fast, responsive web experience

---

## 🛠 Tech Stack

### Frontend
- React (v18+)
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- Local `database.json` storage *(development)*
- Firebase *(planned production backend)*

### AI
- Fireworks AI
- Qwen 2.5 / 3.7 Plus
- MiniMax M3 (fallback)

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/fini.git

cd fini
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000
NODE_ENV=development
FIREWORKS_API_KEY=your_fireworks_api_key
```

---

## 4. Start the Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# 🐳 Running with Docker

Build and start the application:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

The application will be available at:

```
http://localhost:3000
```

---

# 🏦 Bank Integration

FinI is designed to integrate with **Mono** for secure bank transaction synchronization.

For this hackathon submission, the banking layer uses realistic mocked responses that mirror Mono's API structure. This allows the application to be easily connected to live banking data when production credentials become available.

---

# 🔒 Privacy

FinI is built with a privacy-first mindset.

The application stores only the information necessary to generate financial insights, such as:

- Transaction date
- Transaction amount
- Merchant information
- Transaction direction (Inflow / Outflow)
- AI-generated insights

Sensitive banking information such as account balances, full account numbers, and authentication credentials are **never stored**.

---

# 🎯 Vision

FinI (Financial Identity) exists to solve a simple but overlooked problem:

> **People don't struggle with money because they lack discipline—they struggle because they lack visibility.**

Instead of pretending to know everything about a user's finances, FinI is honest about uncertainty and helps users make smarter financial decisions through clear insights and conversational AI.

---

Unauthorized copying, modification, distribution, or commercial use is prohibited without prior written permission.
