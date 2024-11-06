// Dropdown-related elements
export const dropDownQtdOptions = $('.dropdownOptions'); // Container for dropdown quantity options
export const optionsValue = $('.option'); // Individual option items within the dropdown
export const coinsToShow = $('.coinsToShow'); // Selected quantity of coins to display

// Table row and coin display elements
export const rowValue = $('.rowValue'); // Value within each table row
export const coins = document.querySelectorAll('[data-href]'); // Coin elements with custom data attributes for links
export const rows = document.querySelectorAll('td[data-href]'); // Table row cells with data attributes for links
export const valuesPercentage = $('.changeValue'); // Elements showing percentage change values

// Sorting and icon elements
export const tableHeaders = document.querySelectorAll('th[data-sort]'); // Table headers with data-sort attributes for sorting
export const iconsSpan = document.querySelectorAll('.icon'); // Icons within spans for various purposes
export const iconsInfo = $('.information'); // Information icons next to each item
export const marketCapInfo = $('.coinMessage'); // Market capitalization info message

// Coin name and chart days options
export const coinName = document.querySelectorAll('[data-coin]'); // Elements with data attributes for specific coin names
export const daysInChart = document.querySelectorAll('.optionChartDays'); // Options for selecting days in chart display

// Download chart options
export const saveAsPng = document.querySelector('.saveAsPng'); // Button to save chart as PNG
export const saveAsJpeg = document.querySelector('.saveAsJpeg'); // Button to save chart as JPEG
export const saveAsPdf = document.querySelector('.saveAsPdf'); // Button to save chart as PDF
export const saveAsButtonDropdown = $('.saveAsBtnDropdown'); // Dropdown button for download options
export const optionsContainerDownloads = $('.downloadsDropDownOptions'); // Container for download options dropdown

// Sentiment and profit bar elements
export const sentimentProfitBarUp = document.querySelector('.sentimentUp'); // Positive sentiment/profit bar
export const profitBar = document.querySelector('.profit-bar'); // Bar showing profit percentage
export const sentimentProfitBarDown = document.querySelector('.sentimentDown'); // Negative sentiment/loss bar
export const lostBar = document.querySelector('.lost-bar'); // Bar showing loss percentage

// Fear & Greed indicator elements
export const greed = document.querySelector('.fear-greed-indicator'); // Main fear and greed indicator
export const feedGreedCoinContainer = document.querySelector('.fearGreed'); // Container for the fear and greed coin data
const fearGreedElement = document.querySelector('.fear-greed-value'); // Element for fear & greed value
export const fearGreedValue = fearGreedElement
  ? fearGreedElement.dataset.value
  : null; // Data attribute value for fear & greed

// Speedometer needle for Fear & Greed index
export const needle = document.querySelector('.speedometer-needle'); // SVG needle on speedometer indicator

// Coin price and currency selector elements
export const coinPriceValue = document.getElementById('coinPriceValue'); // Input field for coin price value
export const coinQuantity = document.getElementById('coinQuantity'); // Input field for coin quantity
export const currencySelect = document.getElementById('currencySelect'); // Dropdown for selecting currency

// Currency icons
export const select = document.getElementById('currencySelect'); // Dropdown for currency options
export const cryptoIcon = document.getElementById('cryptoIcon'); // Icon for selected cryptocurrency
export const flagIcon = document.getElementById('flagIcon'); // Icon for selected country's currency flag

// Navigation menu elements
export const buttonMobile = document.querySelector('#menu-button'); // Button to open mobile nav menu
export const menu = document.querySelector('#nav-menu'); // Main navigation menu container
export const navItems = document.querySelectorAll(
  '.asideNavigation [data-target]'
);

// Main table container for displaying coins
export const mainTableOfCoins = document.querySelector('.table-container-main'); // Container for the main table of coins

// Form elements for user authentication
export const signUpForm = document.querySelector('.userSignUp'); // User sign-up form
export const signInForm = document.querySelector('.userSignIn'); // User sign-in form
export const updatePasswordForm = document.querySelector('.form-user-password'); // Form for updating user password
export const updateUserForm = document.querySelector('.form-user-data'); // Form for updating user data

// Overview page and portfolio elements
export const starSvgIcon = document.querySelectorAll('.starIcon'); // Star icon for favorites on overview page
export const getCoinName = document.querySelectorAll('[data-coin-name]'); // Elements for retrieving coin names by data attribute

// Portfolio delete icon
export const deleteIcon = document.querySelectorAll('.deleteIcon'); // Delete/trash icon on portfolio page

// Modal elements for dialogs
export const modal = document.querySelector('.modal'); // Modal dialog container
export const overlay = document.querySelector('.overlay'); // Overlay behind modal
export const btnCloseModal = document.querySelector('.close-modal'); // Button to close the modal
export const btnsOpenModal = document.querySelectorAll('.show-modal'); // Buttons to open the modal
export const btnConfirm = document.querySelector('.confirmBtn'); // Confirmation button within modal

// Button to copy current page URL
export const linkCoinBtn = document.querySelector('.iconLink'); // Button for copying the URL of the current coin page

// Theme toggle elements
export const iconSun = document.getElementById('icon-sun'); // Sun icon for light mode
export const iconMoon = document.getElementById('icon-moon'); // Moon icon for dark mode
export const themeToggleButton = document.getElementById('theme-toggle'); // Button to toggle between themes

// Logout button
export const logoutBtn = document.querySelector('#logoutBtn'); // Button for logging out the user
