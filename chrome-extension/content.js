(() => {
    let extractedData = document.body.innerText; // Extract text content
    console.log("Extracted Data:", extractedData);

    // Send extracted data to popup.js
    chrome.runtime.sendMessage({ data: extractedData });
})();