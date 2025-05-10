import { createRoot } from 'react-dom/client'
import ComposeAssistant from './ComposeAssistant'

// Function to inject our React component into Gmail compose window
const injectComposeAssistant = () => {
  // Check if we're in a compose window
  const composeBoxes = document.querySelectorAll('.Am.Al.editable')
  
  composeBoxes.forEach((composeBox) => {
    // Check if our assistant is already injected
    if (composeBox.parentElement && !composeBox.parentElement.querySelector('.email-assistant-container')) {
      // Create container for our assistant
      const container = document.createElement('div')
      container.className = 'email-assistant-container'
      container.style.padding = '8px'
      container.style.borderBottom = '1px solid #ccc'
      container.style.backgroundColor = '#f8f9fa'
      
      // Insert before the compose box
      composeBox.parentElement.insertBefore(container, composeBox)
      
      // Render our React component in the container
      createRoot(container).render(<ComposeAssistant />)
    }
  })
}

// Start observing DOM changes to detect when compose window appears
const startObserver = () => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        // Check if compose box has been added
        if (document.querySelector('.Am.Al.editable')) {
          injectComposeAssistant()
        }
      }
    }
  })
  
  // Start observing the document body for changes
  observer.observe(document.body, { childList: true, subtree: true })
}

// Initialize our content script
startObserver()