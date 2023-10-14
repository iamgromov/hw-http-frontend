/**
 *  Класс для связи с сервером.
 *  Содержит методы для отправки запросов на сервер и получения ответов
 * */
export default class TicketService {
  async list(callback) {
    try {
      const result = await fetch("http://localhost:3000/?method=allTickets");
      if (result) {
        const data = await result.json();
        callback(data);
      }
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async create(data, callback) {
    try {
      const result = await fetch("http://localhost:3000/?method=createTicket", {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      if (result) {
        const data = await result.json();
        callback(data);
      }
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async update(id, data, callback) {
    try {
      const result = await fetch(
        `http://localhost:3000/?method=updateById&id=${id}`,
        {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=utf-8",
          },
        }
      );
      if (result) {
        const data = await result.json();
        callback(data);
      }
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async delete(id, callback) {
    try {
      const result = await fetch(
        `http://localhost:3000/?method=deleteById&id=${id}`
      );
      if (result.status === 204) {
        callback();
      }
    } catch (ex) {
      throw new Error(ex.message);
    }
  }
}
