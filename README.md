# Crypto Market

Welcome to the documentation for the Crypto Market project. This repository contains the source code, technologies, features, and explanations to help you understand its functionality and architecture.

<p align="center">
  <img src="https://github.com/user-attachments/assets/c302eb42-ebcc-4a6d-855d-5eb344ce61ba" alt="crypto-logo-coin" width="200" height="200"/>
</p>

## Introduction

**Crypto Market** Crypto Market is a web application designed to be a fast and reliable source for cryptocurrency market analysis and global trends, providing a simple, easy-to-use interface. It enables users to track individual coins, monitor market sentiment, and stay updated on trending cryptocurrencies.

## Technologies

- **Node.js**: JavaScript runtime used for backend development, handling server logic and API integration.
- **MongoDB**: NoSQL database used for persistent data storage, including user authentication and application data.
- **Pug**: Template engine for rendering HTML with dynamic data, facilitating server-side rendering for a streamlined frontend experience.
- **Parcel**: JavaScript bundler used to compile and optimize frontend assets, ensuring efficient loading and performance.
- **Tailwind CSS**: Utility-first CSS framework used for styling, providing a flexible, responsive design for the application's interface.
- **Chart.js**: Library for creating interactive charts and visualizations, used to display cryptocurrency market data.
- **CoinGecko API**: External API providing real-time cryptocurrency data, including prices, volume, and market trends.

## Implemented Features

Crypto Market includes the following features:

- User Authentication: Allows users to register and log in to access and manage their preferences within the app, with session-based user authentication checks.

- Cryptocurrency Data Lookup: Enables users to view data on individual cryptocurrencies or a complete list, including detailed information on price, name, exchanges, and other key indicators.

- Favorite Cryptocurrency Portfolio: Users can save their favorite cryptocurrencies to a personalized portfolio, making it easy to track and monitor them in real time.

- Fear and Greed Index: Displays the market's Fear and Greed Index, providing an overview of the current sentiment in the cryptocurrency market.

- Trending Coins: Shows the top-trending cryptocurrencies of the moment, allowing users to stay updated on the latest market trends.

- Market Cap and Volume: Provides a detailed view of market capitalization and trading volume, helping users better understand the liquidity and relevance of different cryptocurrencies.

- Dark/Light Theme Toggle: Offers an option to switch between dark and light themes, allowing users to customize the app's appearance for a more comfortable viewing experience.

## Architecture

The project is using the architecture **MVC** (Model-View-Controller):

- **Model**: Handles the data and business logic, integrating with MongoDB for data management and user authentication.

- **View**: consists of server-rendered HTML views and client-side interactivity.

- **Controller**: Acts as an intermediary between the Model and the View, processing user inputs and updating the View with data from the Model.

## Directory Structure

```plaintext

Crypto Tracker/

├── .vscode/
├── controllers/                # Controller layer responsible for handling API calls and user interactions
├── models/                     # Model layer for data structure definitions and database interactions
├── public/                     # Public assets, including styles, images, and client-side JavaScript files
├── routes/                     # Routing definitions, managing application endpoints
├── utils/                      # Utility functions for formatting, error handling, and other reusable code
├── views/                      # View templates, using Pug for server-rendered HTML
├── .gitignore                  # Configuration to exclude specific files and directories from version control
├── .prettierrc                 # Prettier configuration for consistent code formatting, with Tailwind plugin
├── README.md                   # Project documentation, including setup instructions and usage details
├── app.js                      # Main application file
├── package.json                # Project metadata and dependencies
├── postcss.config.js           # PostCSS configuration, including custom color support in Tailwind CSS
├── server.js                   # Server setup and database connection
└── tailwind.config.js          # Tailwind CSS configuration file
```

## How can i access it ?

The project is deployed on Render and you can try it on the following link:

- https://crypto-currency-pgqa.onrender.com/overview

## Contact

In case of questions or some info, reach me out on:

- GitHub: KaiqueFj
- E-mail: kaiqueferraz.dev@gmail.com

**That´s all folks ;)**

<img src="https://github.com/user-attachments/assets/c302eb42-ebcc-4a6d-855d-5eb344ce61ba" alt="crypto-logo-coin" width="200" height="200"/>
