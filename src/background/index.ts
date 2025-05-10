// Check for updates and set badge when an update is available
chrome.runtime.onUpdateAvailable.addListener((details) => {
  // Store update information
  chrome.storage.local.set({ 
    updateAvailable: true, 
    newVersion: details.version 
  });
  
  // Trigger notification to user
  chrome.action.setBadgeText({ text: "!" });
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
});

// Listen for installation and update events
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First time installation
    // Open onboarding page
    chrome.tabs.create({
      url: chrome.runtime.getURL('dashboard.html')
    });
  } else if (details.reason === 'update') {
    // Extension was updated
    const previousVersion = details.previousVersion;
    const currentVersion = chrome.runtime.getManifest().version;
    
    console.log(`Updated from ${previousVersion} to ${currentVersion}`);
    
    // If needed, show update notification
    if (previousVersion !== currentVersion) {
      chrome.storage.local.set({ 
        updateNotification: true,
        updateInfo: {
          previousVersion,
          currentVersion
        }
      });
    }
  }
});