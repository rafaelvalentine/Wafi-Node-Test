const fs = require("fs");
class Accounts {
  #FetchAccounts() {
    try {
      const accounts = JSON.parse(fs.readFileSync("accounts.js"));
      return accounts;
    } catch (error) {
      return [];
    }
  }
  #GetAccount(id) {
    try {
      const account = JSON.parse(fs.readFileSync("accounts.js")).filter(
        (value) => value.user_id === id
      );
      return account;
    } catch (error) {
      return [];
    }
  }

  #UpdateAccounts(account) {
    fs.writeFileSync("accounts.js", JSON.stringify(account));
  }
  constructor(user_id = undefined) {
    if (user_id) {
      return this.create(user_id);
    }
    return null;
  }
  create(user_id) {
    const id = Math.random().toString().replace(".", "");
    const newAccount = {
      id,
      user_id,
      available_balance: 0,
    };
    const allAccount = this.#FetchAccounts();
    this.#UpdateAccounts([...allAccount, newAccount]);

    return this.#GetAccount(id);
  }

  fetch(user_id) {
    const account = this.#GetAccount(user_id);
    if (account.length) {
      return { data: account[0], message: "found account" };
    }
    return null;
  }

  fund(user_id, amount) {
    const account = this.#GetAccount(user_id);

    if (account.length) {
      const allAccount = this.#FetchAccounts().filter(
        (result) => result["user_id"] !== user_id
      );
      this.#UpdateAccounts([
        ...allAccount,
        {
          ...account[0],
          available_balance: account[0]["available_balance"] + amount,
        },
      ]);
      return { data: null, message: "account funded!" };
    }
    return null;
  }

  transfer(user_id, amount, recipient_id) {
    const creditor = this.#GetAccount(user_id);
    const recipient = this.#GetAccount(recipient_id);
    if (!creditor.length) {
      throw "creditor account does not exist";
    }
    if (creditor[0]["available_balance"] < amount) {
      throw "Insufficient Funds";
    }
    if (!recipient.length) {
      throw "recipient account does not exist";
    }

    const allAccount = this.#FetchAccounts().filter(
      (result) =>
        result["user_id"] !== `${user_id}` && result["user_id"] !== `${recipient_id}`
    );
    this.#UpdateAccounts([
      ...allAccount,
      {
        ...creditor[0],
        available_balance: creditor[0]["available_balance"] - amount,
      },
      {
        ...recipient[0],
        available_balance: recipient[0]["available_balance"] + amount,
      },
    ]);
    return { data: null, message: "Transfer completed!" };
  }
}

class Users {
  #Users() {
    try {
      const users = JSON.parse(fs.readFileSync("users.js"));
      return users;
    } catch (error) {
      return [];
    }
  }

  #AddUser(user) {
    fs.writeFileSync("users.js", JSON.stringify(user));
  }
  #error = [];
  constructor(user = undefined) {
    if (user && typeof user === "object") {
      return this.create(user);
    }
  }

  create(user = {}) {
    const id = Math.random().toString().replace(".", "");
    const userInfo = Object.keys(user);
    for (const field of userInfo) {
      if (!["email", "password", "name"].includes(field)) {
        if (field !== "email") {
          this.#error = [...this.#error, "email field is required!"];
        }
        if (field !== "password") {
          this.#error = [...this.#error, "password field is required!"];
        }
        if (user[field] !== "name") {
          this.#error = [...this.#error, "name field is required!"];
        }
      }
    }

    if (this.#error.length) {
      throw this.#error[0];
    }
    const DuplicateUser = this.#Users().filter(
      (result) => user.email === result.email
    );
    if (DuplicateUser.length) {
      throw "User Already exist";
    }

    const newUser = { id, ...user };

    this.#AddUser([...this.#Users(), newUser]);
    return { data: newUser, message: "User Created!" };
  }

  fetch({ email, password }) {
    const user = this.#Users()
      .filter((value) => value.email === email)
      .filter((result) => result.password === password);
    if (user.length) {
      return { data: user[0], message: "Welcome back " + email };
    }
    return null;
  }
}

module.exports = { Users, Accounts };
