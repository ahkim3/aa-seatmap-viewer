/**
 * Flight Service Module
 * Handles flight data retrieval and validation for American Airlines flights.
 * Uses mock data for development purposes.
 */

/**
 * Mock flight database - represents a sample of American Airlines flights
 * In production, this would connect to an actual API
 */
const mockFlightDatabase = [
    {
        flightNumber: "4416",
        origin: "JFK",
        destination: "ORD",
        validMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        validDays: Array.from({ length: 31 }, (_, i) => i + 1),
    },
    {
        flightNumber: "100",
        origin: "LAX",
        destination: "DFW",
        validMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        validDays: Array.from({ length: 31 }, (_, i) => i + 1),
    },
    {
        flightNumber: "1234",
        origin: "MIA",
        destination: "ORD",
        validMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        validDays: Array.from({ length: 31 }, (_, i) => i + 1),
    },
    {
        flightNumber: "2567",
        origin: "DFW",
        destination: "LAX",
        validMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        validDays: Array.from({ length: 31 }, (_, i) => i + 1),
    },
    {
        flightNumber: "789",
        origin: "ORD",
        destination: "JFK",
        validMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        validDays: Array.from({ length: 31 }, (_, i) => i + 1),
    },
];

/**
 * Validates flight details against the mock database
 * @param {string} flightNumber - The AA flight number
 * @param {string} origin - Origin airport code (3-letter)
 * @param {string} destination - Destination airport code (3-letter)
 * @param {number} month - Departure month (1-12)
 * @param {number} day - Departure day (1-31)
 * @returns {Object} Validation result with status and message
 */
function validateFlight(flightNumber, origin, destination, month, day) {
    // Input sanitization
    const sanitizedFlightNumber = String(flightNumber).trim();
    const sanitizedOrigin = String(origin).trim().toUpperCase();
    const sanitizedDestination = String(destination).trim().toUpperCase();
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);

    // Basic validation
    if (!sanitizedFlightNumber) {
        return {
            isValid: false,
            message: "Flight number is required.",
        };
    }

    if (sanitizedOrigin.length !== 3 || sanitizedDestination.length !== 3) {
        return {
            isValid: false,
            message: "Airport codes must be exactly 3 characters.",
        };
    }

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return {
            isValid: false,
            message: "Month must be between 1 and 12.",
        };
    }

    if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
        return {
            isValid: false,
            message: "Day must be between 1 and 31.",
        };
    }

    if (sanitizedOrigin === sanitizedDestination) {
        return {
            isValid: false,
            message: "Origin and destination airports cannot be the same.",
        };
    }

    // Search for matching flight in mock database
    const matchingFlight = mockFlightDatabase.find(
        (flight) =>
            flight.flightNumber === sanitizedFlightNumber &&
            flight.origin === sanitizedOrigin &&
            flight.destination === sanitizedDestination
    );

    if (!matchingFlight) {
        return {
            isValid: false,
            message: `Flight AA${sanitizedFlightNumber} from ${sanitizedOrigin} to ${sanitizedDestination} not found in our database. Please verify your flight details.`,
        };
    }

    // Check if date is valid for this flight
    if (!matchingFlight.validMonths.includes(monthNum)) {
        return {
            isValid: false,
            message: `Flight AA${sanitizedFlightNumber} does not operate in month ${monthNum}.`,
        };
    }

    if (!matchingFlight.validDays.includes(dayNum)) {
        return {
            isValid: false,
            message: `Flight AA${sanitizedFlightNumber} does not operate on day ${dayNum}.`,
        };
    }

    // Flight is valid
    return {
        isValid: true,
        message: `Flight AA${sanitizedFlightNumber} from ${sanitizedOrigin} to ${sanitizedDestination} found. Proceeding to seat map...`,
        flight: matchingFlight,
    };
}

/**
 * Simulates an asynchronous flight lookup (e.g., API call)
 * @param {string} flightNumber - The AA flight number
 * @param {string} origin - Origin airport code (3-letter)
 * @param {string} destination - Destination airport code (3-letter)
 * @param {number} month - Departure month (1-12)
 * @param {number} day - Departure day (1-31)
 * @returns {Promise<Object>} Promise resolving to validation result
 */
function lookupFlight(flightNumber, origin, destination, month, day) {
    return new Promise((resolve) => {
        // Simulate network delay (300-800ms)
        const delay = Math.floor(Math.random() * 500) + 300;
        setTimeout(() => {
            const result = validateFlight(
                flightNumber,
                origin,
                destination,
                month,
                day
            );
            resolve(result);
        }, delay);
    });
}

/**
 * Gets a list of all available flights (for development/testing)
 * @returns {Array} Array of flight objects
 */
function getAllFlights() {
    return [...mockFlightDatabase];
}

// Export functions for use in other modules
// Using both module.exports (Node.js) and window (browser) for compatibility
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        validateFlight,
        lookupFlight,
        getAllFlights,
    };
}

// Make available in browser environment
if (typeof window !== "undefined") {
    window.FlightService = {
        validateFlight,
        lookupFlight,
        getAllFlights,
    };
}
