// demo/custom-card.ts
// Demo showcasing custom card overlays with dropdown menus

import '../src/mosaic-grid';
import { MosaicItem, ImageItem } from '../src/types';

// Helper function to create a dropdown menu overlay
function createDropdownMenu(item: MosaicItem, cardElement: HTMLElement): HTMLElement {
  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'custom-dropdown-container';
  
  // Create the menu icon button (three dots)
  const menuButton = document.createElement('button');
  menuButton.className = 'dropdown-menu-button';
  menuButton.innerHTML = '⋮';
  menuButton.setAttribute('aria-label', 'Open menu');
  menuButton.setAttribute('aria-haspopup', 'true');
  menuButton.setAttribute('aria-expanded', 'false');
  
  // Create the dropdown menu
  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'dropdown-menu';
  dropdownMenu.setAttribute('role', 'menu');
  dropdownMenu.style.display = 'none'; // Ensure it's hidden initially
  
  // Menu items
  const menuItems = [
    { label: 'View Details', action: () => handleViewDetails(item) },
    { label: 'Edit', action: () => handleEdit(item) },
    { label: 'Share', action: () => handleShare(item) },
    { label: 'Download', action: () => handleDownload(item) },
    { label: 'Delete', action: () => handleDelete(item) },
  ];
  
  menuItems.forEach((menuItem, index) => {
    const menuItemElement = document.createElement('button');
    menuItemElement.className = 'dropdown-menu-item';
    menuItemElement.setAttribute('role', 'menuitem');
    menuItemElement.textContent = menuItem.label;
    menuItemElement.addEventListener('click', (e) => {
      e.stopPropagation();
      menuItem.action();
      closeDropdown();
    });
    dropdownMenu.appendChild(menuItemElement);
  });
  
  // Toggle dropdown on button click
  let isOpen = false;
  menuButton.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent card expansion
    e.preventDefault();
    isOpen = !isOpen;
    menuButton.setAttribute('aria-expanded', isOpen.toString());
    if (isOpen) {
      dropdownMenu.classList.add('show');
      // Close when clicking outside
      setTimeout(() => {
        document.addEventListener('click', closeOnOutsideClick, true);
      }, 0);
    } else {
      closeDropdown();
    }
  });
  
  function closeDropdown() {
    isOpen = false;
    menuButton.setAttribute('aria-expanded', 'false');
    dropdownMenu.classList.remove('show');
    document.removeEventListener('click', closeOnOutsideClick, true);
  }
  
  function closeOnOutsideClick(e: MouseEvent) {
    if (!dropdownContainer.contains(e.target as Node)) {
      closeDropdown();
    }
  }
  
  dropdownContainer.appendChild(menuButton);
  dropdownContainer.appendChild(dropdownMenu);
  
  return dropdownContainer;
}

// Action handlers
function handleViewDetails(item: MosaicItem) {
  alert(`Viewing details for: ${item.title || item.id}`);
  console.log('View details:', item);
}

function handleEdit(item: MosaicItem) {
  alert(`Editing: ${item.title || item.id}`);
  console.log('Edit:', item);
}

function handleShare(item: MosaicItem) {
  if (navigator.share && item.type === 'image') {
    const imageItem = item as ImageItem;
    navigator.share({
      title: item.title || 'Shared Image',
      text: 'Check out this image!',
      url: imageItem.full || imageItem.preview
    }).catch(err => {
      console.log('Error sharing:', err);
      copyToClipboard(imageItem.full || imageItem.preview);
    });
  } else if (item.type === 'image') {
    const imageItem = item as ImageItem;
    copyToClipboard(imageItem.full || imageItem.preview);
  }
}

function handleDownload(item: MosaicItem) {
  if (item.type === 'image') {
    const imageItem = item as ImageItem;
    const link = document.createElement('a');
    link.href = imageItem.full;
    link.download = `${item.id}.jpg`;
    link.click();
    console.log('Downloading:', imageItem.full);
  }
}

function handleDelete(item: MosaicItem) {
  if (confirm(`Are you sure you want to delete "${item.title || item.id}"?`)) {
    console.log('Deleting:', item);
    // In a real app, you'd remove the item from the grid here
    alert('Item deleted (demo only - not actually removed)');
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Link copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('Link copied to clipboard!');
  });
}

// Sample items with custom dropdown overlays
const demoItems: MosaicItem[] = [
  {
    id: 'custom-1',
    type: 'image',
    layout: 'big',
    preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    full: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000&q=80',
    title: 'Mountain Landscape',
    cardOverlays: {
      topRight: createDropdownMenu
    }
  },
  {
    id: 'custom-2',
    type: 'image',
    layout: 'wide',
    preview: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    full: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2000&q=80',
    title: 'Forest Path',
    cardOverlays: {
      topRight: createDropdownMenu
    }
  },
  {
    id: 'custom-3',
    type: 'image',
    layout: 'tall',
    preview: 'https://images.unsplash.com/photo-1464822759844-d150ad279bfd?w=600&q=80',
    full: 'https://images.unsplash.com/photo-1464822759844-d150ad279bfd?w=2000&q=80',
    title: 'Ocean Waves',
    cardOverlays: {
      topRight: createDropdownMenu
    }
  },
  {
    id: 'custom-4',
    type: 'image',
    layout: 'normal',
    preview: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
    full: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=2000&q=80',
    title: 'Sunset Sky',
    cardOverlays: {
      topRight: createDropdownMenu
    }
  },
  {
    id: 'custom-5',
    type: 'image',
    layout: 'normal',
    preview: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
    full: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=2000&q=80',
    title: 'Desert Dunes',
    cardOverlays: {
      topRight: createDropdownMenu
    }
  },
  {
    id: 'custom-6',
    type: 'image',
    layout: 'wide',
    preview: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
    full: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=2000&q=80',
    title: 'Mountain Range',
    cardOverlays: {
      topRight: createDropdownMenu
    }
  },
  {
    id: 'custom-7',
    type: 'image',
    layout: 'tall',
    preview: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80',
    full: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=2000&q=80',
    title: 'Forest Canopy',
    cardOverlays: {
      topRight: createDropdownMenu
    }
  },
  {
    id: 'custom-8',
    type: 'image',
    layout: 'normal',
    preview: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80',
    full: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=2000&q=80',
    title: 'City Skyline',
    cardOverlays: {
      topRight: createDropdownMenu
    }
  },
  {
    id: 'custom-9',
    type: 'image',
    layout: 'big',
    preview: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    full: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=2000&q=80',
    title: 'Lakeside View',
    cardOverlays: {
      topRight: createDropdownMenu
    }
  },
  {
    id: 'custom-10',
    type: 'image',
    layout: 'normal',
    preview: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
    full: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=2000&q=80',
    title: 'Meadow Field',
    cardOverlays: {
      topRight: createDropdownMenu
    }
  },
];

// Add styles for the dropdown - inject into shadow DOM if possible, otherwise document head
const style = document.createElement('style');
style.textContent = `
  /* Override overlay container to align content to the right */
  .card-overlay-top-right {
    display: flex !important;
    justify-content: flex-end !important;
    align-items: flex-start !important;
    flex-direction: row !important;
  }
  
  .custom-dropdown-container {
    position: relative;
    display: inline-block;
  }
  
  .dropdown-menu-button {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px) saturate(180%);
    -webkit-backdrop-filter: blur(10px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.95);
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    line-height: 1;
    padding: 0;
    flex-shrink: 0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  .dropdown-menu-button:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  }
  
  .dropdown-menu-button:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.2);
  }
  
  .dropdown-menu {
    display: none !important;
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset;
    min-width: 180px;
    max-width: 250px;
    padding: 6px;
    z-index: 1000;
    flex-direction: column;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
  
  .dropdown-menu.show {
    display: flex !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: auto !important;
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dropdown-menu-item {
    width: 100%;
    display: flex !important;
    flex-direction: row !important;
    align-items: center;
    justify-content: flex-start;
    padding: 12px 16px;
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.95);
    white-space: nowrap;
    box-sizing: border-box;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  
  .dropdown-menu-item:hover {
    background: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 1);
  }
  
  .dropdown-menu-item:active {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(0.98);
  }
  
  .dropdown-menu-item:last-child {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin-top: 4px;
    padding-top: 12px;
  }
  
  .dropdown-menu-item:last-child:hover {
    background: rgba(220, 53, 69, 0.3);
    color: rgba(255, 255, 255, 1);
  }
`;
document.head.appendChild(style);

// Function to inject styles into shadow DOM
function injectDropdownStyles(shadowRoot: ShadowRoot) {
  if (!shadowRoot.querySelector('style[data-custom-dropdown]')) {
    const shadowStyle = document.createElement('style');
    shadowStyle.setAttribute('data-custom-dropdown', 'true');
    shadowStyle.textContent = `
          /* Override overlay container to align content to the right */
          .card-overlay-top-right {
            display: flex !important;
            justify-content: flex-end !important;
            align-items: flex-start !important;
            flex-direction: row !important;
          }
          
          .custom-dropdown-container {
            position: relative;
            display: inline-block;
          }
          
          .dropdown-menu-button {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px) saturate(180%);
            -webkit-backdrop-filter: blur(10px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
            color: rgba(255, 255, 255, 0.95);
            transition: all 0.3s ease;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
            line-height: 1;
            padding: 0;
            flex-shrink: 0;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          }
          
          .dropdown-menu-button:hover {
            background: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.4);
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
          }
          
          .dropdown-menu-button:active {
            transform: scale(0.95);
            background: rgba(255, 255, 255, 0.2);
          }
          
          .dropdown-menu {
            display: none !important;
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
            min-width: 180px;
            max-width: 250px;
            padding: 6px;
            z-index: 1000;
            flex-direction: column;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
          }
          
          .dropdown-menu.show {
            display: flex !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            animation: slideDown 0.3s ease-out;
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .dropdown-menu-item {
            width: 100%;
            display: flex !important;
            flex-direction: row !important;
            align-items: center;
            justify-content: flex-start;
            padding: 12px 16px;
            border: none;
            background: transparent;
            text-align: left;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s ease;
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.95);
            white-space: nowrap;
            box-sizing: border-box;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          }
          
          .dropdown-menu-item:hover {
            background: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 1);
          }
          
          .dropdown-menu-item:active {
            background: rgba(255, 255, 255, 0.15);
            transform: scale(0.98);
          }
          
          .dropdown-menu-item:last-child {
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            margin-top: 4px;
            padding-top: 12px;
          }
          
          .dropdown-menu-item:last-child:hover {
            background: rgba(220, 53, 69, 0.3);
            color: rgba(255, 255, 255, 1);
          }
        `;
    shadowRoot.appendChild(shadowStyle);
  }
}

// Initialize the grid and inject styles into shadow DOM
document.addEventListener('DOMContentLoaded', () => {
  const gridElement = document.querySelector('mosaic-grid-widget') as any;
  if (gridElement) {
    // Inject styles into shadow DOM
    const injectStyles = () => {
      const shadowRoot = gridElement.shadowRoot;
      if (shadowRoot) {
        injectDropdownStyles(shadowRoot);
      } else {
        // If shadowRoot not ready, wait a bit and try again
        setTimeout(injectStyles, 50);
      }
    };
    
    // Try to inject styles immediately
    injectStyles();
    
    // Set items after a small delay to ensure shadow DOM is ready
    setTimeout(() => {
      gridElement.items = demoItems;
      // Inject styles again after items are set (in case shadow DOM was recreated)
      injectStyles();
    }, 100);
    
    // Also watch for shadow DOM changes
    const observer = new MutationObserver(() => {
      const shadowRoot = gridElement.shadowRoot;
      if (shadowRoot && !shadowRoot.querySelector('style[data-custom-dropdown]')) {
        injectDropdownStyles(shadowRoot);
      }
    });
    
    observer.observe(gridElement, { childList: true, subtree: true });
  }
});
