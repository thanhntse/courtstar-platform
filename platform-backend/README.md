# Badminton Court Booking Platform Backend

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
- [Material UI](https://mui.com/core/)

**Backend:**
- [Spring Boot](https://spring.io/projects/spring-boot)

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Java (>=11)
- Maven (>=3.6.3)

### Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/Court-Star/courtstar-platform-backend.git
    cd courtstar-platform-backend
    ./mvnw spring-boot:run
    ```

The backend application will be available at `http://localhost:8080`.
