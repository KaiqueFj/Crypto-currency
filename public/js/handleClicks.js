const {
  iconsInfo,
  marketCapInfo,
  optionsContainerDownloads,
  saveAsButtonDropdown,
} = require("./handleElements");

export function handleUserClicks() {
  iconsInfo.each(function (e) {
    $(this).on("click", function (e) {
      e.preventDefault(); // Get the position of the clicked element
      const offset = $(this).offset();
      const height = $(this).outerHeight();
      const width = $(this).outerWidth();

      // Position the popup next to the clicked element
      marketCapInfo.css({
        top: offset.top + height + 5, // 5px below the clicked element
        left: offset.left + width / 2 - marketCapInfo.outerWidth() / 2, // Centered horizontally
      });

      // Show the popup
      marketCapInfo.toggleClass("hidden");
    });
  });

  saveAsButtonDropdown.on("click", function (e) {
    var containerPosition = $(this).offset();

    optionsContainerDownloads.css({
      top: containerPosition.top + $(this).outerHeight() + "px",
      left: containerPosition.left + "px",
      position: "absolute",
    });

    // Toggle the dropdown visibility
    optionsContainerDownloads.toggleClass("show");
  });
}
