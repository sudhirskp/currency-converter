const API_KEY = "yourApikey"; // Replace with your actual API key
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest`;

// Select elements
const dropdowns = document.querySelectorAll(".dropdown select");
const exchangeBtn = document.querySelector(".btn button");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const amountInput = document.querySelector(".amount input");
const exchangeRateText = document.querySelector(".exchangerate p");
const swapBtn = document.querySelector(".fa-arrow-right-arrow-left");

// Populate currency dropdowns
for (let select of dropdowns) {
    for (let currencyCode in countryList) {
        let option = document.createElement("option");
        option.innerText = currencyCode;
        option.value = currencyCode;

        // Default selection
        if (select.name === "from" && currencyCode === "USD") {
            option.selected = true;
        } else if (select.name === "to" && currencyCode === "INR") {
            option.selected = true;
        }

        select.appendChild(option);
    }

    // Update flag when currency selection changes
    select.addEventListener("change", function () {
        updateFlag(this);
    });
}

// Function to fetch and update exchange rate
const updateExchangeRate = async () => {
    let amount = amountInput.value;

    // Ensure the amount is valid
    if (!amount || Number(amount) < 1) {
        amount = 1;
        amountInput.value = "1";
    }

    const fromCurr = fromCurrency.value;
    const toCurr = toCurrency.value;
    const url = `${BASE_URL}/${fromCurr}`; // Fetch rates for 'from' currency

    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        let data = await response.json();

        if (!data.conversion_rates[toCurr]) throw new Error("Exchange rate not found!");

        let rate = data.conversion_rates[toCurr];
        let convertedAmount = (amount * rate).toFixed(2);
        exchangeRateText.innerText = `${amount} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        exchangeRateText.innerText = "Error fetching exchange rate. Try again!";
    }
};

// Function to update country flag based on currency selection
const updateFlag = (element) => {
    let currencyCode = element.value;
    let countryCode = countryList[currencyCode];

    if (countryCode) {
        let flagUrl = `https://flagsapi.com/${countryCode}/flat/64.png`;

        if (element.name === "from") {
            document.querySelector(".from img").src = flagUrl;
        } else if (element.name === "to") {
            document.querySelector(".to img").src = flagUrl;
        }
    }
};

// Event listener for Exchange button
exchangeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    updateExchangeRate();
});

// Swap button functionality
swapBtn.addEventListener("click", () => {
    let tempCurrency = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCurrency;

    updateFlag(fromCurrency);
    updateFlag(toCurrency);
    updateExchangeRate();
});

// Initialize exchange rate and flags on page load
window.addEventListener("load", () => {
    updateExchangeRate();
    updateFlag(fromCurrency);
    updateFlag(toCurrency);
});
