const dataExtracted = []
let currentTab

// < UTILS FUNCTIONS > //////////////////////////////////////////////////////////////////////////
function displayMessage(message) {
    const outputElement = document.getElementById("output");
    outputElement.textContent += `\n\n${message}`;
}

function displaySearchQuery(processedData) {
    displayMessage("Query to use\n\n" + processedData["processed_data"]);
    openSearchInSameTab(processedData["processed_data"].replace(/"/g, ''));
}

// < ACTIONS FUNCTIONS > //////////////////////////////////////////////////////////////////////////
async function sendToServerAPI(url, data, callback) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain', // Set content type to plain text
            },
            body: data, // Send data as plain text
        });
        const processedData = await response.json();
        callback(processedData);
    } catch (error) {
        console.error("Error sending data to API:", error);
        displayMessage("\n\nError processing data.");
    }
}

// **************** [CONTEXT EXTENSION] ****************
function openSearchInSameTab(searchQuery) {
    displayMessage("\n\nNavigating to search results: " + searchQuery);

    // Navigate the current tab to the search page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.onUpdated.addListener(function listener(tabId, _) {
            if (tabId === tabs[0].id) {
                goToTheFirstLink();

                chrome.tabs.onUpdated.removeListener(listener);
            }
        });

        chrome.tabs.update(tabs[0].id, {
            url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
        });
    });
}

// **************** [CONTEXT EXTENSION] ****************
function goToTheFirstLink() {
    displayMessage("\n\nSelecting result...");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        currentTab = tabs[0].id;
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => {
                // **************** [CONTEXT DOCUMENT] ****************
                function selectFirstLink() {
                    const firstLink = document.getElementById("search")?.querySelectorAll("a")[0];
                    if (!firstLink) {
                        const allLinks = document.body?.querySelectorAll("block-component span a[data-ved] h3");
                        firstLink = allLinks[allLinks.length - 1]?.parentElement;
                    }
                    return firstLink;
                }

                const firstLink = selectFirstLink();
                if (firstLink) {
                    // Send the click event to the content script
                    chrome.runtime.sendMessage({ action: "EXTRACT_SECOND_DATA" }); // -->
                    firstLink.click();
                } else {
                    chrome.runtime.sendMessage({ action: "NO_LINK_FOUND" }); // -->
                }
            }
        })
    });
}

// **************** [CONTEXT EXTENSION] ****************
async function getSummary(data) {
    displayMessage("\n\nProcessing all the data...");
    await sendToServerAPI('http://localhost:5000/process-data', data, (processedData) => {
        // Display the processed data in anoter tab in the document
        displayMessage("\n\nDisplaying summary...");
        chrome.tabs.create({
            url: `data:text/html,<pre>${encodeURIComponent(processedData["processed_data"])}</pre>`
        });
    });
}

// < EVENT LISTENERS > //////////////////////////////////////////////////////////////////////////
// **************** [CONTEXT EXTENSION] ****************
document.getElementById("EXTRACTDATA_BUTTON").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => {
                // **************** [CONTEXT DOCUMENT] ****************
                const extractedData = document.body.innerText;
                chrome.runtime.sendMessage({ data: extractedData, action: "EXTRACT_FIRST_DATA" }); // -->
            }
        });
    });
});

// **************** [CONTEXT EXTENSION] ****************
chrome.runtime.onMessage.addListener(async (message, _, __) => { // <--
    if (message.action === "EXTRACT_FIRST_DATA") {
        displayMessage("First Data extracted\n\nProcessing data...");
        dataExtracted.push(message.data);
        await sendToServerAPI('http://localhost:5000/query-generator', message.data, displaySearchQuery);
    }

    if (message.action === "EXTRACT_SECOND_DATA") {
        setTimeout(() => {
            chrome.scripting.executeScript({
                target: { tabId: currentTab },
                function: () => {
                    // **************** [CONTEXT DOCUMENT] ****************
                    const extractedData = document.body.innerText;
                    chrome.runtime.sendMessage({ data: extractedData, action: 'FINAL_PROCESS' }); // -->
                }
            })
        }, 3000);

    }

    if (message.action === "FINAL_PROCESS") {
        const allData = "Data from first website:\n" + dataExtracted[0] + "\n\nData from second website:\n" + message.data;
        displayMessage("\n\nProcessing all data...");
        console.log("All data:", allData);
        getSummary(allData);
    }

    if (message.action === "NO_LINK_FOUND") {
        displayMessage("\n\nNo link found");
    }
});
