/**
 * Utility function to display a custom error message using the modal.
 * @param {string} title - The title of the message.
 * @param {string} body - The body/content of the message.
 */
function showMessage(title, body) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").textContent = body;
    document.getElementById("messageModal").style.display = "flex";
}

/**
 * Sets the loading state of the submit button
 * @param {boolean} isLoading - Whether the button should show loading state
 */
function setLoadingState(isLoading) {
    const submitBtn = document.getElementById("submitBtn");
    const buttonText = document.getElementById("buttonText");
    const buttonSpinner = document.getElementById("buttonSpinner");

    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.classList.add("opacity-75", "cursor-not-allowed");
        buttonText.textContent = "Validating...";
        buttonSpinner.classList.remove("hidden");
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-75", "cursor-not-allowed");
        buttonText.textContent = "View Seat Map";
        buttonSpinner.classList.add("hidden");
    }
}

document
    .getElementById("seatViewForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault(); // Stop the form from performing its default submission

        // Base URL for the American Airlines seat view
        const baseUrl = "https://www.aa.com/seats/view";

        // 1. Collect and sanitize form values
        const flightNumber = document
            .getElementById("flightNumber")
            .value.trim();
        const departureMonth = document
            .getElementById("departureMonth")
            .value.trim();
        const departureDay = document
            .getElementById("departureDay")
            .value.trim();
        const originAirport = document
            .getElementById("originAirport")
            .value.trim()
            .toUpperCase();
        const destinationAirport = document
            .getElementById("destinationAirport")
            .value.trim()
            .toUpperCase();

        // 2. Simple client-side validation for required fields (though 'required' attribute helps)
        if (
            !flightNumber ||
            !departureMonth ||
            !departureDay ||
            !originAirport ||
            !destinationAirport
        ) {
            showMessage(
                "Missing Information",
                "Please fill in all the required fields before submitting."
            );
            return;
        }

        // 3. Validate the flight using the Flight Service
        setLoadingState(true);

        try {
            const validationResult = await window.FlightService.lookupFlight(
                flightNumber,
                originAirport,
                destinationAirport,
                parseInt(departureMonth, 10),
                parseInt(departureDay, 10)
            );

            setLoadingState(false);

            if (!validationResult.isValid) {
                // Flight not found or invalid
                showMessage("Flight Validation Failed", validationResult.message);
                return;
            }

            // Flight is valid - show success message briefly, then redirect
            showMessage("Flight Found!", validationResult.message);

            // Wait a moment for user to see the success message, then redirect
            setTimeout(() => {
                // 4. Construct the query string parameters
                const params = new URLSearchParams({
                    flightNumber: flightNumber,
                    departureMonth: departureMonth,
                    departureDay: departureDay,
                    originAirport: originAirport,
                    destinationAirport: destinationAirport,
                });

                // 5. Combine base URL and parameters
                const finalUrl = `${baseUrl}?${params.toString()}`;

                console.log("Redirecting to:", finalUrl);

                // 6. Perform the redirection
                window.location.href = finalUrl;
            }, 1500);
        } catch (error) {
            setLoadingState(false);
            showMessage(
                "Validation Error",
                "An error occurred while validating the flight. Please try again."
            );
            console.error("Flight validation error:", error);
        }
    });

// Set the airport code inputs to automatically uppercase as the user types
document.getElementById("originAirport").addEventListener("input", function () {
    this.value = this.value.toUpperCase();
});
document
    .getElementById("destinationAirport")
    .addEventListener("input", function () {
        this.value = this.value.toUpperCase();
    });
