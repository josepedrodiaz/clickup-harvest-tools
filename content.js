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
  // Look for Harvest dialog
  const harvestDialog = document.querySelector('dialog.harvest-dialog, dialog[class*="harvest"]');
  
  if (harvestDialog && !harvestDialog.hasAttribute('data-listener-attached')) {
    harvestDialog.setAttribute('data-listener-attached', 'true');
    
    // Add a small delay to ensure the dialog is fully loaded
    setTimeout(() => {
      handleHarvestDialog();
    }, 500);
  }
}

// Observe DOM changes to detect when the dialog appears
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added node is a Harvest dialog
          if (node.tagName === 'DIALOG' && (node.classList.contains('harvest-dialog') || node.className.includes('harvest'))) {
            setTimeout(() => attachDialogListener(), 100);
          } else if (node.querySelector) {
            // Check if the added node contains Harvest dialog
            const harvestDialog = node.querySelector('dialog.harvest-dialog, dialog[class*="harvest"]');
            
            if (harvestDialog) {
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
