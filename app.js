const apiUrl = "https://open.er-api.com/v6/latest/";
let fromCurrency = "RUB";
let toCurrency = "USD";

const amountFrom = document.getElementById("amountFrom");
const amountTo = document.getElementById("amountTo");
const rateFrom = document.getElementById("rateFrom");
const rateTo = document.getElementById("rateTo");
const fromButtons = document.querySelectorAll(".input-section .currency-select button");
const toButtons = document.querySelectorAll(".output-section .currency-select button");
const container = document.querySelector(".container");
let networkStatusMessage;

const initApp = () => {
  setupEventListeners();
  netStatus();
};

const setupEventListeners = () => {
  fromButtons.forEach((btn) => {
    btn.addEventListener("click", () => handleCurrencyChange("from", btn));
  });

  toButtons.forEach((btn) => {
    btn.addEventListener("click", () => handleCurrencyChange("to", btn));
  });

  amountFrom.addEventListener("input", fetchExchangeRates);
};

const handleCurrencyChange = (type, btn) => {
  const selectedCurrency = btn.dataset.currency;

  if (type === "from") {
    fromCurrency = selectedCurrency;
    updateActiveButton(fromCurrency, fromButtons);
  } else if (type === "to") {
    toCurrency = selectedCurrency;
    updateActiveButton(toCurrency, toButtons);
  }

  fetchExchangeRates();
};

const updateActiveButton = (currency, buttons) => {
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.currency === currency);
  });
};

const netStatus = () => {
  if (navigator.onLine) {
    hideNetworkMessage();
    sessionStorage.setItem("network", "online");
    fetchExchangeRates();
  } else {
    showNetworkMessage();
    sessionStorage.setItem("network", "offline");
  }
};

const showNetworkMessage = () => {
  if (!networkStatusMessage) {
    networkStatusMessage = document.createElement("p");
    networkStatusMessage.textContent = "No internet connection";
    networkStatusMessage.style.color = "red";
    networkStatusMessage.style.textAlign = "center";
    container.appendChild(networkStatusMessage);
  } else {
    networkStatusMessage.style.display = "block";
  }
};

const hideNetworkMessage = () => {
  if (networkStatusMessage) {
    networkStatusMessage.style.display = "none";
  }
};

const fetchExchangeRates = async () => {
  if (fromCurrency === toCurrency) {
    updateExchangeRate(1);  
    return;
  }

  try {
    const response = await fetch(`${apiUrl}${fromCurrency}`);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }
    const data = await response.json();
    const rate = data.rates[toCurrency];
    updateExchangeRate(rate);
  } catch (error) {
    console.error(error.message);
  }
};

const updateExchangeRate = (rate) => {
  rateFrom.textContent = `1 ${fromCurrency} = ${(1 / rate).toFixed(4)} ${toCurrency}`;
  rateTo.textContent = `1 ${toCurrency} = ${(rate).toFixed(4)} ${fromCurrency}`;
  amountTo.value = (amountFrom.value * rate).toFixed(4);
};

window.addEventListener("online", netStatus);
window.addEventListener("offline", netStatus);

initApp();
