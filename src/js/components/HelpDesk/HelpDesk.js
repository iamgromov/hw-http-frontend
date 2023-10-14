import TicketForm from "../TicketForm/TicketForm";
import TicketService from "../../TicketService";
import TicketView from "../TicketView/TicketView";
import Modal from "../Modal/Modal";

import "./HelpDesk.css";

/**
 *  Основной класс приложения
 * */
export default class HelpDesk {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("This is not HTML element!");
    }
    this.container = container;
    this.element = null;

    this.ticketModal = null;
    this.confirmModal = null;
    this.idTicketForDelete = null;
    this.ticketService = new TicketService();

    this.dataList = [];

    this.draw = this.draw.bind(this);
    this.renderOneTicket = this.renderOneTicket.bind(this);
    this.renderTickets = this.renderTickets.bind(this);
    this.reRenderAllList = this.reRenderAllList.bind(this);
    this.onNewTicket = this.onNewTicket.bind(this);
    this.onNewTicketSubmit = this.onNewTicketSubmit.bind(this);
    this.onShowDescription = this.onShowDescription.bind(this);
    this.onTicketDone = this.onTicketDone.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onEditSubmit = this.onEditSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDeleteConfirmation = this.onDeleteConfirmation.bind(this);
  }

  static get helpdesk() {
    return `
			<div class="helpdesk">
        <button class="helpdesk__add-ticket-btn">Add Ticket</button>
        <ul class="helpdesk__list"></ul>
      </div>
		`;
  }

  draw() {
    this.container.innerHTML = HelpDesk.helpdesk;
    this.element = this.container.querySelector(".helpdesk");

    this.ticketService.list((data) => {
      this.dataList = data;

      this.renderTickets();
    });

    const newTicketBtn = this.element.querySelector(
      ".helpdesk__add-ticket-btn"
    );
    newTicketBtn.addEventListener("click", this.onNewTicket);
  }

  renderTickets() {
    this.dataList.forEach((item) => {
      const ticket = new TicketView(item);
      const ticketEl = ticket.getTicketElement(this);

      this.element.lastElementChild.insertAdjacentElement(
        "beforeend",
        ticketEl
      );
    });
  }

  reRenderAllList() {
    const listEl = document.createElement("ul");
    listEl.classList.add("helpdesk__list");
    this.element.lastElementChild.remove();
    this.element.insertAdjacentElement("beforeend", listEl);

    this.renderTickets();
  }

  renderOneTicket(data) {
    const ticket = new TicketView(data);
    const ticketEl = ticket.getTicketElement(this);

    this.element.lastElementChild.insertAdjacentElement("beforeend", ticketEl);
  }

  onNewTicket() {
    this.ticketModal = new TicketForm(this);
    this.ticketModal.draw();
  }

  onNewTicketSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newTicketData = Object.fromEntries(formData.entries());

    this.ticketService.create(JSON.stringify(newTicketData), (data) => {
      this.dataList.push(data);
      this.renderOneTicket(data);
    });

    this.ticketModal.closeModal();
    this.ticketModal = null;
  }

  onTicketDone(e) {
    if (!e.target.classList.contains("ticket__card-custom-check")) {
      return;
    }

    const { id } = e.target.parentElement.parentElement.parentElement.dataset;

    const updateData = this.dataList.find((item) => item.id === id);

    updateData.status = updateData.status === false;

    this.ticketService.update(id, JSON.stringify(updateData), (data) => {
      this.dataList = data;
      this.reRenderAllList();
    });
  }

  onShowDescription(e) {
    if (
      e.target.classList.contains("ticket__card-checkbox") ||
      e.target.classList.contains("ticket__card-custom-check") ||
      e.target.classList.contains("ticket__card-edit") ||
      e.target.classList.contains("ticket__card-delete")
    ) {
      return;
    }

    if (e.currentTarget.classList.contains("ticket__card")) {
      e.currentTarget.nextElementSibling.classList.toggle("open");
    }
  }

  onEdit(e) {
    if (!e.target.classList.contains("ticket__card-edit")) {
      return;
    }

    const { id } = e.target.parentElement.parentElement.parentElement.dataset;

    const ticket = this.dataList.filter((item) => item.id === id)[0];

    this.ticketModal = new TicketForm(this, ticket);
    this.ticketModal.draw();
  }

  onEditSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const editedData = Object.fromEntries(formData.entries());

    const ticket = this.dataList.filter((item) => item.id === editedData.id)[0];

    const editedTicket = { ...ticket, ...editedData };

    this.ticketService.update(
      editedTicket.id,
      JSON.stringify(editedTicket),
      (data) => {
        this.dataList = data;
        this.ticketModal.closeModal();
        this.ticketModal = null;
        this.reRenderAllList();
      }
    );
  }

  onDelete(e) {
    if (!e.target.classList.contains("ticket__card-delete")) {
      return;
    }

    this.idTicketForDelete =
      e.target.parentElement.parentElement.parentElement.dataset.id;

    this.confirmModal = new Modal(this);
    this.confirmModal.draw();
  }

  onDeleteConfirmation(e) {
    e.preventDefault();

    this.ticketService.delete(this.idTicketForDelete, () => {
      this.dataList = this.dataList.filter(
        (item) => item.id !== this.idTicketForDelete
      );

      this.confirmModal.closeModal();
      this.confirmModal = null;
      this.reRenderAllList();
    });
  }
}
