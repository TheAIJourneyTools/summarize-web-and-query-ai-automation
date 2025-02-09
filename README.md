# summarize-web-and-query-ai-automation

## Overview

This project is an automation system that leverages a Chrome extension and a server with AI capabilities to summarize web content and handle queries.

## Components

1. **Chrome Extension**: Captures web content and sends it to the server for processing.
2. **Server with AI**: Processes the captured content using AI models to generate summaries and respond to queries.

## Features

- **Web Content Summarization**: Automatically summarizes the content of web pages.
- **Query Handling**: Responds to AI queries based on the summarized content.
- **Seamless Integration**: The Chrome extension seamlessly integrates with the server to provide real-time summarization and query responses.

## Workflow

1. **Given**: I am on a webpage in my browser.
2. **When**: I press a button in the Chrome extension.
3. **Then**: The extension extracts the data.
4. **And**: The extension sends it to the server.
5. **And**: The server processes it to generate a query.
6. **And**: The extension uses that query to perform a search.
7. **And**: The extension selects a result.
8. **And**: The extension extracts the data.
9. **And**: The extension sends it back for AI summarization.
10. **And**: The server responds with the AI summarized data.
11. **And**: The extension displays the result.

## Installation

1. Clone the repository.
   ```bash
   git clone <repository-url>
   ```
2. Install the Chrome extension.

   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension folder

3. Set up the server.
   - Navigate to the server directory
   - Install dependencies
     ```bash
     pip install -r requirements.txt
     ```
   - Start the server
     ```bash
     python app.py
     ```

## Usage

1. Open a web page in Chrome.
2. Use the Chrome extension to capture the content.
3. The server processes the content and provides a summary or responds to queries.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
