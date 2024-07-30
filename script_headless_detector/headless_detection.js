function detectRenderingAnomalies() {
    const counterElement = document.querySelector('.counter');
    if (!counterElement) {
        console.error('Counter element not found or not loaded yet!');
        return false; // Handle gracefully or return false if element not found
    }

    let computedStyle;
    try {
        computedStyle = window.getComputedStyle(counterElement, ':before').getPropertyValue('content');
    } catch (error) {
        console.error('Error getting computed style:', error);
        return false; // Handle gracefully on error
    }

    const cssAnomaly = computedStyle === 'none';

    const isHeadless = !!navigator.webdriver;
    const start = performance.now();
    for (let i = 0; i < 1000000; i++) {} // Intentional delay
    const end = performance.now();
    const scriptExecutionTime = end - start;
    const isFastExecution = scriptExecutionTime < 50;

    return cssAnomaly || isHeadless || isFastExecution;
}

function detectScreenAndWindowAnomalies() {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const unusualScreenSize = (screenWidth <= 1280 && screenHeight <= 800);

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const unusualWindowSize = (windowWidth <= 1280 && windowHeight <= 800);

    const windowPositionX = window.screenX || window.screenLeft;
    const windowPositionY = window.screenY || window.screenTop;
    const unusualWindowPosition = (windowPositionX === 0 && windowPositionY === 0);

    let resizeDetected = false;
    window.addEventListener('resize', function() {
        resizeDetected = true;
    });

    return unusualScreenSize || unusualWindowSize || unusualWindowPosition || !resizeDetected;
}

function detectTimeBasedAnomalies() {
    const startTime = performance.now();
    let interactionTime;

    const button = document.getElementById('testButton');
    button.addEventListener('click', function() {
        interactionTime = performance.now() - startTime;
    });

    button.click();

    const endTime = performance.now();
    const scriptExecutionTime = endTime - startTime;
    const isFastExecution = scriptExecutionTime < 50;
    const isFastInteraction = interactionTime < 100;

    return isFastExecution || isFastInteraction;
}

function detectHeadlessBrowser() {
    const renderingAnomalies = detectRenderingAnomalies();
    const screenAndWindowAnomalies = detectScreenAndWindowAnomalies();
    const timeBasedAnomalies = detectTimeBasedAnomalies();

    if (renderingAnomalies || screenAndWindowAnomalies || timeBasedAnomalies) {
        console.log("Headless browser detected!");
    } else {
        console.log("Regular browser detected.");
    }
}

// Execute detection function immediately after script loads
detectHeadlessBrowser();