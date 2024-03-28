import fetch from 'node-fetch';

// Sentry API endpoint for fetching issues
const apiUrl = '';

// Sentry API token
const apiToken = '';

// Function to fetch errors from Sentry API
async function fetchErrors() {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch errors: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching errors:', error);
        return null;
    }
}

// Function to get top URLs where fetch issues occur
function getTopFetchUrls(errors) {
    const fetchErrors = errors.filter(error => error.culprit && error.culprit.startsWith('fetch'));
    const urlOccurrences = {};

    fetchErrors.forEach(error => {
        const url = error.request.url;
        urlOccurrences[url] = (urlOccurrences[url] || 0) + 1;
    });

    const sortedUrls = Object.keys(urlOccurrences).sort((a, b) => urlOccurrences[b] - urlOccurrences[a]);
    return sortedUrls.slice(0, 5).map(url => ({url, occurrences: urlOccurrences[url]}));
}

// Main function to orchestrate fetching and processing
async function main() {
    const errors = await fetchErrors();
    if (errors) {
        const topUrls = getTopFetchUrls(errors);
        console.log('Top 5 URLs where fetch issues occur:');
        topUrls.forEach((url, index) => {
            console.log(`${index + 1}. URL: ${url.url}, Occurrences: ${url.occurrences}`);
        });
    }
}

// Run main function
(async () => {
    try {
        await main();
    } catch (e) {
        console.error('Error:', e);
    }
})();
