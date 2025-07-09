// Function to extract project name from ClickUp breadcrumbs
function extractProjectNameFromDOM() {
  // Look for the breadcrumbs container
  const breadcrumbs = document.querySelector('cu-task-view-breadcrumbs');
  if (!breadcrumbs) {
    return null;
  }
  
  // Get all the text elements in the breadcrumbs
  const textElements = breadcrumbs.querySelectorAll('.cu-task-view-breadcrumbs__text');
  
  if (textElements.length >= 2) {
    // The project name is typically the second element (after the space name)
    const projectElement = textElements[1];
    const projectName = projectElement.textContent.trim();
    return projectName;
  }
  
  return null;
}

// Function to handle Harvest dialog detection
function handleHarvestDialog() {
  // Extract project name from DOM
  const projectName = extractProjectNameFromDOM();
  
  if (projectName) {
    alert(`Project: ${projectName}\n\nPlease verify the project name before starting the timer.`);
  } else {
    alert("Please verify the project name before starting the timer.");
  }
}

// Function to attach listener to Harvest dialog
function attachDialogListener() {
  // Try multiple selectors for the Harvest dialog
  const dialogSelectors = [
    'dialog.harvest-dialog',
    'dialog[class*="harvest"]',
    'div[class*="harvest"]',
    'div[class*="dialog"]',
    'iframe[id*="harvest"]',
    'iframe[src*="harvest"]'
  ];
  
  let harvestDialog = null;
  let harvestIframe = null;
  
  for (const selector of dialogSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      if (element.tagName === 'DIALOG' || element.classList.contains('dialog')) {
        harvestDialog = element;
      } else if (element.tagName === 'IFRAME') {
        harvestIframe = element;
      }
    }
  }
  
  if (harvestDialog || harvestIframe) {
    if (harvestDialog && !harvestDialog.hasAttribute('data-listener-attached')) {
      harvestDialog.setAttribute('data-listener-attached', 'true');
      
      // Add a small delay to ensure the dialog is fully loaded
      setTimeout(() => {
        handleHarvestDialog();
      }, 500);
    }
  }
}

// Observe DOM changes to detect when the dialog appears
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added node is a Harvest dialog or iframe
          if (node.tagName === 'DIALOG' && (node.classList.contains('harvest-dialog') || node.className.includes('harvest'))) {
            setTimeout(() => attachDialogListener(), 100);
          } else if (node.tagName === 'IFRAME' && (node.src.includes('harvest') || node.id.includes('harvest'))) {
            setTimeout(() => attachDialogListener(), 100);
          } else if (node.querySelector) {
            // Check if the added node contains Harvest elements
            const harvestDialog = node.querySelector('dialog.harvest-dialog, dialog[class*="harvest"]');
            const harvestIframe = node.querySelector('iframe[src*="harvest"], iframe[id*="harvest"]');
            
            if (harvestDialog || harvestIframe) {
              setTimeout(() => attachDialogListener(), 100);
            }
          }
        }
      });
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial attempt
attachDialogListener();

// Periodic check for Harvest dialog (in case it loads after initial check)
let checkCount = 0;
const maxChecks = 10;
const checkInterval = setInterval(() => {
  checkCount++;
  
  const harvestDialog = document.querySelector('dialog.harvest-dialog, dialog[class*="harvest"]');
  const harvestIframe = document.querySelector('iframe[src*="harvest"], iframe[id*="harvest"]');
  
  if (harvestDialog || harvestIframe) {
    attachDialogListener();
    clearInterval(checkInterval);
  } else if (checkCount >= maxChecks) {
    clearInterval(checkInterval);
  }
}, 1000);
