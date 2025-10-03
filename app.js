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

document
    .getElementById("seatViewForm")
    .addEventListener("submit", function (event) {
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

        // 3. Construct the query string parameters
        const params = new URLSearchParams({
            flightNumber: flightNumber,
            departureMonth: departureMonth,
            departureDay: departureDay,
            originAirport: originAirport,
            destinationAirport: destinationAirport,
        });

        // 4. Combine base URL and parameters
        const finalUrl = `${baseUrl}?${params.toString()}`;

        console.log("Redirecting to:", finalUrl);

        // 5. Perform the redirection
        window.location.href = finalUrl;
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
