import { showAlert } from '../handleAlertPage/alert';
import { setTheme } from './themeToggle';

const {
  iconsInfo,
  optionsContainerDownloads,
  saveAsButtonDropdown,
  sentimentProfitBarUp,
  profitBar,
  sentimentProfitBarDown,
  lostBar,
  navItems,
  buttonMobile,
  menu,
  starSvgIcon,
  linkCoinBtn,
  themeToggleButton,
} = require('./handleElements');

export function handleUserClicks() {
  //handle the infoContainer for each stats of the coin
  iconsInfo.each(function (e) {
    $(this).on('click', function (e) {
      e.preventDefault();

      // Get the data-info attribute of the clicked icon
      const infoType = $(this).data('info');

      // Get the corresponding message container
      const marketCapInfo = $(`.coinMessage[data-info='${infoType}']`);

      // Get the position of the clicked element
      const offset = $(this).offset();
      const height = $(this).outerHeight();
      const width = $(this).outerWidth();

      // Position the popup next to the clicked element
      marketCapInfo.css({
        top: offset.top + height + 5, // 5px below the clicked element
        left: offset.left + width / 2 - marketCapInfo.outerWidth() / 2, // Centered horizontally
      });

      // Show the corresponding popup
      marketCapInfo.toggleClass('hidden');
    });
  });

  //handle aside navigation
  if (navItems) {
    navItems.forEach((item) => {
      item.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // Handle save chart as image
  saveAsButtonDropdown.on('click', function (e) {
    var containerPosition = $(this).offset();

    optionsContainerDownloads.css({
      top: containerPosition.top + $(this).outerHeight() + 'px',
      left: containerPosition.left + 'px',
      position: 'absolute',
    });

    // Toggle the dropdown visibility
    optionsContainerDownloads.toggleClass('show');
  });

  // get the percent on the sentiment up
  if (sentimentProfitBarUp && sentimentProfitBarDown && profitBar && lostBar) {
    const sentimentPercentageUp = parseFloat(
      sentimentProfitBarUp.textContent.replace('%', '')
    );

    // get the percent on the sentiment down
    const sentimentPercentageDown = parseFloat(
      sentimentProfitBarDown.textContent.replace('%', '')
    );

    // Set the width of the bars for sentiment up or down
    profitBar.style.width = `${sentimentPercentageUp}%`;
    lostBar.style.width = `${sentimentPercentageDown}%`;
  }

  buttonMobile.addEventListener('click', (e) => {
    e.preventDefault();
    menu.classList.toggle('translate-x-full'); // Slide-in transition
    menu.classList.toggle('opacity-0'); // Fade-in effect
    menu.classList.toggle('pointer-events-none'); // Enable interactions
  });

  // Handle the click on the star for portfolio
  starSvgIcon.forEach((star) => {
    star.addEventListener('click', function (e) {
      e.preventDefault();

      star.classList.toggle('fa-solid');
      star.classList.toggle('fa-regular');

      star.classList.contains('fa-solid')
        ? star.classList.replace('text-primary-text-color', 'text-star-color')
        : star.classList.replace('text-star-color', 'text-primary-text-color');
    });
  });

  if (linkCoinBtn) {
    // Handle copy current coin url
    linkCoinBtn.addEventListener('click', (e) => {
      e.preventDefault();

      navigator.clipboard.writeText(window.location.href).then(() => {
        showAlert('success', 'link copied!');
      });
    });
  }

  // Handle theme toggle
  themeToggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    const newTheme = document.body.classList.contains('light')
      ? 'dark'
      : 'light';
    setTheme(newTheme);
  });
}
