chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.data) {
        console.log("Data received");
    }
});
