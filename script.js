async function download() {
    const url = document.getElementById('url').value.trim();
    const resultDiv = document.getElementById('result');

    // Clear previous result
    resultDiv.innerHTML = '';

    // Validate URL
    if (!isValidInstagramUrl(url)) {
        displayError(resultDiv, 'Please enter a valid Instagram URL');
        return;
    }

    try {
        const response = await fetch(`/api/instagram?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid server response');
        }

        const data = await response.json();

        if (data && data.downloadUrl) {
            const downloadLink = createDownloadLink(data.downloadUrl);
            resultDiv.appendChild(downloadLink);
        } else {
            throw new Error('Download URL not found in response');
        }
    } catch (error) {
        displayError(resultDiv, `An error occurred: ${error.message}`);
    }
}

function isValidInstagramUrl(url) {
    // Regular expression for Instagram URL validation (supports both regular posts and reels)
    const instagramUrlRegex = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel\/|p\/|tv\/)[\w-]+\/?(?:\?.*)?$/;
    return instagramUrlRegex.test(url);
}

function createDownloadLink(downloadUrl) {
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.textContent = 'Download Here';
    downloadLink.download = 'instagram_post';
    return downloadLink;
}

function displayError(element, message) {
    const errorElement = document.createElement('p');
    errorElement.className = 'error';
    errorElement.textContent = message;
    element.appendChild(errorElement);
}
