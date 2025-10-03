/**
 * Unit Tests for Flight Service
 * Tests flight validation and lookup functionality
 */

// Import the flight service (Node.js environment)
const FlightService = require('./flightService.js');

/**
 * Simple test runner
 */
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('\n=== Running Flight Service Tests ===\n');

        for (const test of this.tests) {
            try {
                await test.fn();
                this.passed++;
                console.log(`✓ ${test.name}`);
            } catch (error) {
                this.failed++;
                console.log(`✗ ${test.name}`);
                console.log(`  Error: ${error.message}`);
            }
        }

        console.log(`\n=== Test Results ===`);
        console.log(`Total: ${this.tests.length}`);
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Success Rate: ${((this.passed / this.tests.length) * 100).toFixed(2)}%\n`);

        // Exit with error code if any tests failed
        if (this.failed > 0) {
            process.exit(1);
        }
    }
}

/**
 * Assertion helper
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

// Create test runner
const runner = new TestRunner();

// Test Suite: Basic Validation

runner.test('validateFlight should return valid result for existing flight', () => {
    const result = FlightService.validateFlight('4416', 'JFK', 'ORD', 4, 18);
    assert(result.isValid === true, 'Flight should be valid');
    assert(result.message.includes('found'), 'Message should indicate flight found');
});

runner.test('validateFlight should reject non-existent flight number', () => {
    const result = FlightService.validateFlight('9999', 'JFK', 'ORD', 4, 18);
    assert(result.isValid === false, 'Flight should be invalid');
    assert(result.message.includes('not found'), 'Message should indicate flight not found');
});

runner.test('validateFlight should reject wrong origin airport', () => {
    const result = FlightService.validateFlight('4416', 'LAX', 'ORD', 4, 18);
    assert(result.isValid === false, 'Flight should be invalid');
});

runner.test('validateFlight should reject wrong destination airport', () => {
    const result = FlightService.validateFlight('4416', 'JFK', 'LAX', 4, 18);
    assert(result.isValid === false, 'Flight should be invalid');
});

runner.test('validateFlight should reject same origin and destination', () => {
    const result = FlightService.validateFlight('4416', 'JFK', 'JFK', 4, 18);
    assert(result.isValid === false, 'Flight should be invalid');
    assert(result.message.includes('cannot be the same'), 'Message should indicate same airports error');
});

// Test Suite: Input Validation

runner.test('validateFlight should reject empty flight number', () => {
    const result = FlightService.validateFlight('', 'JFK', 'ORD', 4, 18);
    assert(result.isValid === false, 'Flight should be invalid');
    assert(result.message.includes('required'), 'Message should indicate flight number required');
});

runner.test('validateFlight should reject invalid airport code length', () => {
    const result = FlightService.validateFlight('4416', 'JF', 'ORD', 4, 18);
    assert(result.isValid === false, 'Flight should be invalid');
    assert(result.message.includes('3 characters'), 'Message should indicate 3 character requirement');
});

runner.test('validateFlight should reject invalid month (0)', () => {
    const result = FlightService.validateFlight('4416', 'JFK', 'ORD', 0, 18);
    assert(result.isValid === false, 'Flight should be invalid');
    assert(result.message.includes('Month'), 'Message should indicate month error');
});

runner.test('validateFlight should reject invalid month (13)', () => {
    const result = FlightService.validateFlight('4416', 'JFK', 'ORD', 13, 18);
    assert(result.isValid === false, 'Flight should be invalid');
});

runner.test('validateFlight should reject invalid day (0)', () => {
    const result = FlightService.validateFlight('4416', 'JFK', 'ORD', 4, 0);
    assert(result.isValid === false, 'Flight should be invalid');
    assert(result.message.includes('Day'), 'Message should indicate day error');
});

runner.test('validateFlight should reject invalid day (32)', () => {
    const result = FlightService.validateFlight('4416', 'JFK', 'ORD', 4, 32);
    assert(result.isValid === false, 'Flight should be invalid');
});

// Test Suite: Input Sanitization

runner.test('validateFlight should handle lowercase airport codes', () => {
    const result = FlightService.validateFlight('4416', 'jfk', 'ord', 4, 18);
    assert(result.isValid === true, 'Flight should be valid with lowercase codes');
});

runner.test('validateFlight should trim whitespace from inputs', () => {
    const result = FlightService.validateFlight(' 4416 ', ' JFK ', ' ORD ', 4, 18);
    assert(result.isValid === true, 'Flight should be valid with whitespace');
});

runner.test('validateFlight should handle string numbers for month and day', () => {
    const result = FlightService.validateFlight('4416', 'JFK', 'ORD', '4', '18');
    assert(result.isValid === true, 'Flight should be valid with string numbers');
});

// Test Suite: Multiple Flights

runner.test('validateFlight should validate different flight in database', () => {
    const result = FlightService.validateFlight('100', 'LAX', 'DFW', 1, 15);
    assert(result.isValid === true, 'Flight 100 should be valid');
});

runner.test('validateFlight should validate another flight in database', () => {
    const result = FlightService.validateFlight('789', 'ORD', 'JFK', 12, 25);
    assert(result.isValid === true, 'Flight 789 should be valid');
});

// Test Suite: Async lookupFlight

runner.test('lookupFlight should resolve with valid result for existing flight', async () => {
    const result = await FlightService.lookupFlight('4416', 'JFK', 'ORD', 4, 18);
    assert(result.isValid === true, 'Flight should be valid');
    assert(result.message.includes('found'), 'Message should indicate flight found');
});

runner.test('lookupFlight should resolve with invalid result for non-existent flight', async () => {
    const result = await FlightService.lookupFlight('9999', 'XXX', 'YYY', 4, 18);
    assert(result.isValid === false, 'Flight should be invalid');
});

runner.test('lookupFlight should handle edge case inputs', async () => {
    const result = await FlightService.lookupFlight('', '', '', 0, 0);
    assert(result.isValid === false, 'Flight should be invalid');
});

// Test Suite: getAllFlights

runner.test('getAllFlights should return array of flights', () => {
    const flights = FlightService.getAllFlights();
    assert(Array.isArray(flights), 'Should return an array');
    assert(flights.length > 0, 'Should have at least one flight');
});

runner.test('getAllFlights should return flights with required properties', () => {
    const flights = FlightService.getAllFlights();
    const flight = flights[0];
    assert(flight.hasOwnProperty('flightNumber'), 'Flight should have flightNumber');
    assert(flight.hasOwnProperty('origin'), 'Flight should have origin');
    assert(flight.hasOwnProperty('destination'), 'Flight should have destination');
    assert(flight.hasOwnProperty('validMonths'), 'Flight should have validMonths');
    assert(flight.hasOwnProperty('validDays'), 'Flight should have validDays');
});

// Run all tests
runner.run();
