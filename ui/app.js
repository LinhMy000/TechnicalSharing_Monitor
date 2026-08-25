const API_BASE_URL = '';

// DOM Elements
const btnApi1 = document.getElementById('btn-api1');
const btnApi2 = document.getElementById('btn-api2');
const btnApi3 = document.getElementById('btn-api3');

const statusElement = document.getElementById('status-display');

// API Endpoints
const endpoints = {
    api1: '/api1',
    api2: '/api2',
    api3: '/api3'
};

// Initialize the application
function init() {
    console.log('API Testing Frontend initialized');

    // Add click event listeners
    if (btnApi1) {
        btnApi1.addEventListener('click', () => testApi('api1'));
    }

    if (btnApi2) {
        btnApi2.addEventListener('click', () => testApi('api2'));
    }

    if (btnApi3) {
        btnApi3.addEventListener('click', () => testApi('api3'));
    }

    // Log initial status
    updateStatus('pending', '', 'Ready to test');
}

// Test API endpoint
async function testApi(apiKey) {
    const endpoint = endpoints[apiKey];

    if (!endpoint) {
        console.error(`Endpoint not found for ${apiKey}`);
        updateStatus(
            'error',
            'Error',
            `Unknown API key: ${apiKey}`
        );
        return;
    }

    try {
        updateStatus(
            'loading',
            'Loading...',
            `Testing ${apiKey}...`
        );

        const url = `${API_BASE_URL}${endpoint}`;

        console.log(`Calling API: ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(10000)
        });

        const responseText = await response.text();

        let parsedData;

        try {
            parsedData = JSON.parse(responseText);
        } catch {
            parsedData = responseText;
        }

        if (!response.ok) {
            updateStatus(
                'error',
                `Status: ${response.status}`,
                `Response: ${formatResponse(parsedData)}`
            );

            return;
        }

        updateStatus(
            'success',
            `Status: ${response.status}`,
            `Response: ${formatResponse(parsedData)}`
        );

    } catch (error) {
        console.error(`API ${apiKey} error:`, error);

        let errorMessage = 'Network error';

        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            errorMessage = 'Request timeout';
        } else if (error instanceof TypeError) {
            errorMessage =
                'Cannot connect to backend. Check that demo-service is running.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        updateStatus(
            'error',
            'Error',
            `Error: ${errorMessage}`
        );
    }
}

// Format API response
function formatResponse(data) {
    if (typeof data === 'string') {
        return data;
    }

    try {
        return JSON.stringify(data, null, 2);
    } catch {
        return String(data);
    }
}

// Update status display
function updateStatus(
    status,
    statusCode,
    responseContent
) {
    if (!statusElement) {
        return;
    }

    statusElement.classList.remove(
        'status-success',
        'status-error',
        'status-pending'
    );

    if (status === 'success') {
        statusElement.classList.add('status-success');
    } else if (status === 'error') {
        statusElement.classList.add('status-error');
    } else if (status === 'loading') {
        statusElement.classList.add('status-pending');
    }

    const indicator = statusElement.querySelector('.status-indicator');

    if (indicator) {
        if (status === 'loading') {
            indicator.innerHTML = '⏳ <div class="loading"></div>';
        } else if (status === 'success') {
            indicator.textContent = '✅';
        } else if (status === 'error') {
            indicator.textContent = '❌';
        } else {
            indicator.textContent = '';
        }
    }

    const statusCodeElement = statusElement.querySelector('.status-code');

    if (statusCodeElement) {
        statusCodeElement.textContent = statusCode;
    }

    const responseContentElement = statusElement.querySelector('.response-content');

    if (responseContentElement && responseContent) {
        responseContentElement.textContent = responseContent;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');

    notification.className = `error-message ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Check backend health
async function checkBackendHealth() {
    try {
        // Same-origin request. Node server proxies this to: http://demo-service:8080/
        const response = await fetch('/', {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
            console.log('Backend/UI server is healthy');
            return true;
        }

        console.warn(`Backend health check returned status ${response.status}`);
        return false;

    } catch (error) {
        console.error(
            'Backend health check failed:',
            error
        );

        return false;
    }
}

// Add keyboard shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '3') {
            e.preventDefault();

            const apiKey = `api${e.key}`;

            testApi(apiKey);
        }
    });
}

// Initialize everything when DOM is loaded
function initializeApplication() {
    init();

    // Check backend health on startup
    checkBackendHealth().then((isHealthy) => {
        if (!isHealthy) {
            showNotification(
                'Warning: UI server may not be running correctly.',
                'warning'
            );
        }
    });

    addKeyboardShortcuts();

    console.log(
        'API Testing Frontend fully loaded'
    );
}

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        initializeApplication
    );
} else {
    initializeApplication();
}