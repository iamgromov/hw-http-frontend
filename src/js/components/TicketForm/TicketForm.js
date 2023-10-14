import "./TicketForm.css";

/**
 *  Класс для создания формы создания нового тикета
 * */
export default class TicketForm {
  constructor(helpDesk, dataForEdit = null) {
    this.helpDesk = helpDesk;
    this.parentEl = helpDesk.element;
    this.element = null;
    this.dataForEdit = dataForEdit;

    this.draw = this.draw.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  static get ticketForm() {
    return `
			<form class="ticket-form">
				<h2 class="ticket-form__title">Добавить тикет</h2>
				
				<label class="ticket-form__label">
					<span class="ticket-form__input-name">Краткое описание</span>
					<input class="ticket-form__input" type="text" name="name" required>
				</label>
				<label class="ticket-form__label">
					<span class="ticket-form__input-name">Подробное описание</span>
					<textarea class="ticket-form__input ticket-form__textarea" name="description" rows="4"></textarea>
				</label>
				<div class="ticket-form__btn-block">
					<button class="ticket-form__btn-cancel btn" type="reset">Отмена</button>
					<button class="ticket-form__btn-submit btn" type="submit">Ок</button>
				</div>
			</form>
		`;
  }

  draw() {
    this.element = document.createElement("div");
    this.element.classList.add("modal");
    this.element.innerHTML = TicketForm.ticketForm;

    this.parentEl.insertAdjacentElement("beforeend", this.element);

    const cancelBtn = this.element.querySelector(".ticket-form__btn-cancel");
    cancelBtn.addEventListener("click", this.closeModal);

    const ticketForm = this.element.querySelector(".ticket-form");

    if (!this.dataForEdit) {
      ticketForm.addEventListener("submit", this.helpDesk.onNewTicketSubmit);
    } else {
      const formTitle = ticketForm.querySelector(".ticket-form__title");
      formTitle.textContent = "Изменить тикет";

      const inputId = document.createElement("input");
      inputId.type = "hidden";
      inputId.name = "id";
      inputId.value = `${this.dataForEdit.id}`;

      formTitle.insertAdjacentElement("afterend", inputId);

      const inputName = ticketForm.querySelector(".ticket-form__input");
      inputName.value = this.dataForEdit.name;

      const description = ticketForm.querySelector(".ticket-form__textarea");
      description.value = this.dataForEdit.description;

      ticketForm.addEventListener("submit", this.helpDesk.onEditSubmit);
    }
  }

  closeModal() {
    this.element.remove();
  }
}
