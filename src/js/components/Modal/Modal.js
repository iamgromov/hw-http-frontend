import "./Modal.css";

export default class Modal {
  constructor(helpDesk) {
    this.helpDesk = helpDesk;
    this.parentEl = helpDesk.element;
    this.element = null;

    this.draw = this.draw.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  static get deleteForm() {
    return `
        <div class="confirm">
          <p class="confirm__title">Вы уверены что хотите удалить тикет?</p>
          <div class="confirm__btn-block">
            <button class="confirm__btn-cancel btn">Отмена</button>
            <button class="confirm__btn-ok btn">Ок</button>
          </div>
        </div>
        `;
  }

  draw() {
    this.element = document.createElement("div");
    this.element.classList.add("modal");
    this.element.innerHTML = Modal.deleteForm;

    this.parentEl.insertAdjacentElement("beforeend", this.element);

    const cancelBtn = this.element.querySelector(".confirm__btn-cancel");
    cancelBtn.addEventListener("click", this.closeModal);

    const deleteBtn = this.element.querySelector(".confirm__btn-ok");
    deleteBtn.addEventListener("click", this.helpDesk.onDeleteConfirmation);
  }

  closeModal() {
    this.helpDesk.idTicketForDelete = null;
    this.element.remove();
  }
}
