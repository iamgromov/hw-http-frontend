import "./TicketView.css";
import moment from "moment";

/**
 *  Класс для отображения тикетов на странице.
 *  Он содержит методы для генерации разметки тикета.
 * */
export default class TicketView {
  constructor(ticketData) {
    this.ticketData = ticketData;

    this.getTicketElement = this.getTicketElement.bind(this);
  }

  static get addTicket() {
    return `
		<div class="ticket__card">
			<label class="ticket__card-check-label">
				<input class="ticket__card-checkbox visually-hidden" type="checkbox" name="done" id="check-done">
				<span class="ticket__card-custom-check"></span>
			</label>
			<span class="ticket__card-name"></span>
			<span class="ticket__card-date"></span>
			<div class="ticket__card-btn-block">
				<span class="ticket__card-edit"></span>
				<span class="ticket__card-delete"></span>
			</div>
		</div>
		<div class="ticket__description">
			<div class="ticket__description-text" style="min-height: 0;"></div>
		</div>
		`;
  }

  getTicketElement(elem) {
    this.element = document.createElement("li");
    this.element.classList.add("ticket");
    this.element.dataset.id = this.ticketData.id;
    this.element.innerHTML = TicketView.addTicket;

    const checkbox = this.element.querySelector(".ticket__card-checkbox");
    checkbox.checked = this.ticketData.status;

    const ticketName = this.element.querySelector(".ticket__card-name");
    ticketName.textContent = this.ticketData.name;

    const ticketDate = this.element.querySelector(".ticket__card-date");
    ticketDate.textContent = moment().format("DD.MM.YY hh:mm A");

    const ticketText = this.element.querySelector(".ticket__description-text");
    const description = this.ticketData.description.split("\n").join("<br>");
    ticketText.innerHTML = description;

    const checkLabel = this.element.querySelector(".ticket__card-check-label");
    checkLabel.addEventListener("click", elem.onTicketDone);

    const ticketCard = this.element.querySelector(".ticket__card");
    ticketCard.addEventListener("click", elem.onShowDescription);

    const editBtn = this.element.querySelector(".ticket__card-edit");
    editBtn.addEventListener("click", elem.onEdit);

    const deleteBtn = this.element.querySelector(".ticket__card-delete");
    deleteBtn.addEventListener("click", elem.onDelete);

    return this.element;
  }
}
