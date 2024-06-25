# Badminton Court Booking Platform

## Overview

This project is a platform for booking badminton courts. The frontend is built using Vite with React, TypeScript, and styled using TailwindCSS, while the backend is powered by Spring Boot.

## Features


- User registration and authentication (platform account or with Google)
- Register as a manager or customer
- Managers can add new courts
- Customers and guests can book available courts
- QR code check-in for customers and guests
- Statistics and analytics on court usage
- Manage bookings and user profiles
- Admin panel for managing user, court, dashboard


## Tech Stack

**Frontend:**
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [SWC](https://swc.rs/)
- [TailwindCSS](https://tailwindcss.com/)

**Backend:**
- [Spring Boot](https://spring.io/projects/spring-boot)

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (>=14.x)
- npm (>=6.x) or yarn (>=1.x)
- Java (>=11)
- Maven (>=3.6.3)

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/thanhntse/courtstar-platform.git
    cd courtstar-platform
    ```

2. **Backend Setup:**
    ```sh
    cd Backend
    ./mvnw spring-boot:run
    ```

3. **Frontend Setup:**
    ```sh
    cd Frontend
    npm install
    npm run dev
    ```

The frontend application will be available at `http://localhost:3000` and the backend at `http://localhost:8080`.

## Project Structure

```plaintext
courtstar-platform/
├── Backend/                # Spring Boot backend code
│   ├── src/
│   ├── pom.xml
│   └── ...
└── Frontend/               # React frontend code
    ├── src/
    ├── public/
    ├── package.json
    └── ...
