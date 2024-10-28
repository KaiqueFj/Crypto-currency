import { tableHeaders } from './handleElements';

export function handleSortData() {
  tableHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const column = header.dataset.sort;
      const isAscending = header.classList.contains('asc');

      sortTable(column, !isAscending);
      // Toggle sorting direction class
      header.classList.toggle('asc', !isAscending);
      header.classList.toggle('desc', isAscending);

      // Remove existing icons from all headers
      tableHeaders.forEach((hdr) => {
        const icon = hdr.querySelector('.sort-icon');
        if (icon) {
          icon.remove();
        }
      });

      // Append new icon to the clicked header
      const icon = document.createElement('i');
      icon.className = `sort-icon fa-solid  align-middle mr-1 fa-${
        isAscending ? 'caret-down' : 'caret-up'
      }`;

      const iconContainer = header.querySelector('span.icon');
      if (iconContainer) {
        iconContainer.appendChild(icon);
      }
    });
  });
}

function sortTable(column, ascending) {
  const rows = Array.from(document.querySelectorAll('tbody tr'));
  const columnIndex = Array.from(
    document.querySelectorAll('th[data-sort]')
  ).findIndex((th) => th.dataset.sort === column);

  rows.sort((a, b) => {
    const aCell = a.children[columnIndex];
    const bCell = b.children[columnIndex];

    let aValue, bValue;

    if (column === 'Name') {
      //  handling for name column
      aValue = aCell.querySelector('.text-gray-700').textContent.trim();
      bValue = bCell.querySelector('.text-gray-700').textContent.trim();
    } else {
      aValue = aCell.textContent.trim().replace(/[^0-9.-]/g, '');
      bValue = bCell.textContent.trim().replace(/[^0-9.-]/g, '');
    }

    // Check if the column is for names (string comparison) or numbers
    const isNumericColumn =
      !isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue));

    aValue = isNumericColumn ? parseFloat(aValue) : aValue;
    bValue = isNumericColumn ? parseFloat(bValue) : bValue;

    if (isNumericColumn) {
      return ascending ? aValue - bValue : bValue - aValue;
    } else {
      return ascending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
  });

  const tbody = document.querySelector('tbody');
  rows.forEach((row) => tbody.appendChild(row));
}
