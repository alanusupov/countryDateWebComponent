class SearchWidget extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
    <style>
    * {
      font-family: Arial;
      
    }
      .search-wrap{
        display: flex;
        align-items: flex-start;
        gap: 10px;
        box-shadow: 20px 20px 120px 15px rgba(0, 0, 0, 0.05);
        border-radius: 10px;

      }
      .input-wrap{
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 10px;


      }
      .input-wrap2{
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 10px;
        width: 250px;

      }
      select{
        border: none;
        padding: 10px;
        border-radius: 10px;
        background: rgba(224, 224, 224, 1);


      }
      .input-wrap-check{
        display: flex;
        align-items: center;
      }
      button {
        background: rgba(51, 51, 51, 1);
        border-radius: 5px;
        color: white;
        border: none;
        align-self: center;
        padding: 20px;
      }
      </style>

      <h3>Search Widget</h3>
      <div class="search-wrap">
      <div class="input-wrap">
        <label>Departure Country:</label>
        <select id="departureCountry">
          <option value="">Select Departure Country</option>
        </select>

        </div>
        <div class="input-wrap">

        <label>Arrival Country:</label>
        <select id="arrivalCountry">
          <option value="">Select Arrival Country</option>
        </select>
        </div>
        <div class="input-wrap2">

        <label>Date:</label>
        <input type="date" id="departureDate" />
        <input type="date" id="returnDate" />
        <div class="input-wrap-check">

        <label>Departure Date Only:</label>
        <input type="checkbox" id="departureDateOnly" />
        </div>
      </div>
        <button id="searchButton">Найти</button>
      </div>

    `;

    const departureCountrySelect =
      this.shadowRoot.getElementById("departureCountry");
    const arrivalCountrySelect =
      this.shadowRoot.getElementById("arrivalCountry");
    const searchButton = this.shadowRoot.getElementById("searchButton");
    const departureDateInput = this.shadowRoot.getElementById("departureDate");
    const returnDateInput = this.shadowRoot.getElementById("returnDate");

    fetch("https://restcountries.com/v3.1/all")
      .then(response => response.json())
      .then(data => {
        data.forEach(country => {
          const option = document.createElement("option");
          option.value = country.name.common;
          option.textContent = country.name.common;
          departureCountrySelect.appendChild(option);
          arrivalCountrySelect.appendChild(option.cloneNode(true));
        });
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });

    searchButton.addEventListener("click", () => {
      const departureCountry = departureCountrySelect.value;
      const arrivalCountry = arrivalCountrySelect.value;
      const departureDate = departureDateInput.value;
      const returnDate = departureDateOnlyCheckbox.checked
        ? ""
        : returnDateInput.value;

      const searchEvent = new CustomEvent("search", {
        bubbles: true,
        composed: true,
        detail: {
          departureCountry,
          arrivalCountry,
          departureDate,
          returnDate,
        },
      });

      this.dispatchEvent(searchEvent);
    });

    // Prevent choosing past dates for departure and return dates
    const currentDate = new Date().toISOString().split("T")[0];
    departureDateInput.setAttribute("min", currentDate);
    returnDateInput.setAttribute("min", currentDate);

    departureDateInput.addEventListener("input", () => {
      returnDateInput.setAttribute("min", departureDateInput.value);
    });

    returnDateInput.addEventListener("input", () => {
      departureDateInput.setAttribute("max", returnDateInput.value);
    });
  }
}

customElements.define("search-widget", SearchWidget);
