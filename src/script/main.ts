import { Contact, ContactKeys } from "./types";

declare global {
  interface Window {
    searchInput: HTMLInputElement;
  }
}
const searchInput = document.querySelector("#search-input") as HTMLInputElement;
window.searchInput = searchInput;
searchInput.dataset.showAll = "false";

//render -----------
function render(): void {
  const alphabet: string[] = [
    "A",
    "N",
    "B",
    "O",
    "C",
    "P",
    "D",
    "Q",
    "E",
    "R",
    "F",
    "S",
    "G",
    "T",
    "H",
    "U",
    "I",
    "V",
    "J",
    "W",
    "K",
    "X",
    "L",
    "Y",
    "M",
    "Z",
  ];

  const gridContainer = document.createElement("div");
  gridContainer.className = "grid-container";
  const firstCol = document.createElement("div");
  firstCol.className = "first_col";
  const secondCol = document.createElement("div");
  secondCol.className = "second_col";

  for (let i = 0; i < alphabet.length; i += 2) {
    firstCol.appendChild(createGridCell(alphabet[i]));
    secondCol.appendChild(createGridCell(alphabet[i + 1]));
  }
  gridContainer.appendChild(firstCol);
  gridContainer.appendChild(secondCol);

  const contactsContainer = document.querySelector(".contacts");
  if (contactsContainer) {
    contactsContainer.appendChild(gridContainer);
  }

  document.querySelectorAll(".grid-cell").forEach((e: Element) => {
    const cell = e as HTMLElement;
    const localStorageKey = cell.id;
    addCardsCountToHTML(localStorageKey, cell);
    cellClickListner(cell);
  });
}

function createGridCell(letter: string): HTMLElement {
  const cell = document.createElement("div");
  cell.className = "grid-cell";
  const staticContent = document.createElement("div");
  staticContent.className = "grid-cell_static-content";
  staticContent.id = "static-content";
  const countLink = document.createElement("a");
  const letterLink = document.createElement("a");
  const card = document.createElement("div");

  countLink.className = "count";
  letterLink.className = "letter";
  card.className = "cards";

  letterLink.textContent = letter;
  cell.id = letter;

  staticContent.appendChild(letterLink);
  staticContent.appendChild(countLink);

  cell.appendChild(staticContent);
  cell.appendChild(card);

  return cell;
}

//Добавление количества контактов на данную букву и карточек в div
function addCardsCountToHTML(
  localStorageKey: string,
  cellHTML: HTMLElement
): void {
  const a = cellHTML.querySelector(".count") as HTMLAnchorElement;
  const data = localStorage.getItem(localStorageKey);
  if (data !== null) {
    const contacts: Contact[] = JSON.parse(data);
    a.innerHTML = contacts.length.toString();
    addCard(localStorageKey, cellHTML);
  }
}

render();

function cellClickListner(cellHTML: HTMLElement): void {
  cellHTML
    .querySelector("#static-content")
    ?.addEventListener("click", function () {
      cellHTML.classList.toggle("active");
    });
}

const uid = function (firstCharName: string): string {
  return (
    firstCharName +
    Date.now().toString(36) +
    Math.random().toString(36).substr(2)
  );
};

function addContactLocalStorage(contact: Contact): void {
  localStorage.setItem(
    contact.id.charAt(0),
    createContactsListData(contact.id.charAt(0), contact)
  );
}

function deleteContactLocalStorage(contact: Contact): void {
  const contactDataKey = contact.id.charAt(0);
  const contactData = localStorage.getItem(contactDataKey);
  if (contactData) {
    const contactDataList: Contact[] = JSON.parse(contactData);
    const newContactDataList = contactDataList.filter(
      (obj) => obj.id !== contact.id
    );

    if (newContactDataList.length === 0) {
      localStorage.removeItem(contactDataKey);
    } else {
      localStorage.setItem(contactDataKey, JSON.stringify(newContactDataList));
    }
  }
}
document.getElementById("contact-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  addContactFromForm();
});

function addContactFromForm(): void {
  const inputContact = document.querySelectorAll(
    ".contact-form_input"
  ) as NodeListOf<HTMLInputElement>;
  const contact = createContactObj(inputContact);
  addContact(contact);
}

function addContact(contact: Contact): void {
  const contactsDataKey = contact.id.charAt(0);
  const contactsData = localStorage.getItem(contactsDataKey);
  const contactsDataList: Contact[] = contactsData
    ? JSON.parse(contactsData)
    : null;
  //Проверка на наличие объекта в базе данных
  if (isArrIncludeObj(contactsDataList, contact)) {
    alert("Контакт уже существует");
  } else {
    addContactLocalStorage(contact);
    //Добавление контакта вниз списка
    const cell = document.querySelector(`#${contactsDataKey}`);

    if (cell) {
      const cardsContainer = cell.querySelector(".cards");
      if (cardsContainer) {
        cardsContainer.appendChild(createCard(contact.id, contact));
      }
      //Обновление количества контактов на букву
      const countHtml = cell.querySelector(".count");
      if (countHtml) {
        incrementCountHTML(countHtml as HTMLElement);
      }
    }
  }
}

function incrementCountHTML(countHtml: HTMLElement): void {
  countHtml.innerHTML = (Number(countHtml.innerHTML) + 1).toString();
}

function decrementCountHTML(countHtml: HTMLElement): void {
  const count = Number(countHtml.innerHTML);
  if (count - 1 != 0) {
    countHtml.innerHTML = (count - 1).toString();
  } else countHtml.innerHTML = "";
}
function isArrIncludeObj(arr: Contact[] | null, obj: Contact | null): boolean {
  if (arr && obj) {
    return arr.some((el) => isObjEqual(el, obj));
  }
  return false;
}

function isObjEqual(obj1: Contact, obj2: Contact): boolean {
  const newObj1 = { ...obj1, id: "" };
  const newObj2 = { ...obj2, id: "" };
  return JSON.stringify(newObj1) === JSON.stringify(newObj2);
}

function createContactObj(inputData: NodeListOf<HTMLInputElement>): Contact {
  const contact: Partial<Contact> = {};
  const contactKeys: ContactKeys[] = ["Name", "Vacancy", "Phone"];

  inputData.forEach((inputData, index) => {
    contact[contactKeys[index]] = inputData.value;
  });

  const name = contact.Name || "";
  contact["id"] = uid(name.charAt(0).toUpperCase());

  return contact as Contact;
}

function createContactsListData(contactsId: string, contact: Contact): string {
  const existingData = localStorage.getItem(contactsId);

  if (existingData !== null) {
    const contactsDataList: Contact[] = JSON.parse(existingData);
    contactsDataList.push(contact);
    return JSON.stringify(contactsDataList);
  }
  return JSON.stringify([contact]);
}

function clearContacts(): void {
  const countsHtml = document.querySelectorAll(".count");
  countsHtml.forEach((el) => el.replaceChildren());

  const cardsHtml = document.querySelectorAll(".cards");
  cardsHtml.forEach((el) => el.replaceChildren());

  localStorage.clear();
}

function addCard(key: string, el: HTMLElement): void {
  const data = localStorage.getItem(key);

  if (!data) return;

  const localStorageData: Contact[] = JSON.parse(data);
  const cardsContainer = el.querySelector(".cards");
  if (cardsContainer) {
    localStorageData.forEach((obj) => {
      cardsContainer.appendChild(createCard(obj.id, obj));
    });
  }
}

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.closest("#edit-contact-btn")) {
    e.preventDefault();
    editContact(target.parentElement);
  }
  if (target.closest("#delete-contact-btn")) {
    e.preventDefault();
    const contact = findContactDataLocalStorage(
      document.getElementById("delete-contact-btn")?.parentElement.id
    );
    deleteContact(contact);
  }
  if (target.closest("#clear-contacts-btn")) {
    e.preventDefault();
    clearContacts();
  }
});

function createCard(id: string, obj: Contact): HTMLDivElement {
  let div = document.createElement("div");
  div.className = "card";
  div.id = id;
  div.innerHTML = `
    Name: ${obj.Name} </br> 
    Vacancy: ${obj.Vacancy} </br>
    Phone: ${obj.Phone} </br>
    <input type="button" id="delete-contact-btn" class="btn" value="x"> </br>
    <input type="button" id="edit-contact-btn" class="btn" value="edit">
`;
  return div;
}

function findContactDataLocalStorage(contactId: string): Contact | null {
  const contactDataKey = contactId.charAt(0);
  const contactData = localStorage.getItem(contactDataKey);
  if (contactData) {
    const contactDataList: Contact[] = JSON.parse(contactData);
    const found =
      contactDataList.filter(function (obj) {
        return obj.id === contactId;
      })[0] || null;
    return found || null;
  }
  return null;
}

function deleteContact(contact: Contact): void {
  deleteContactLocalStorage(contact);
  deleteContactHTML(contact.id);
}

function deleteContactHTML(contactId: string): void {
  const elId = contactId.charAt(0);
  const elIdHTML = document.querySelector(`#${elId}`);
  if (elIdHTML) {
    const countHtml = elIdHTML.querySelector(".count") as HTMLElement;
    const contactHtml = document.querySelectorAll(`#${contactId}`);
    contactHtml.forEach((el) => el.remove());
    decrementCountHTML(countHtml);
  }
}

function editContact(el: HTMLElement): void {
  const modal: HTMLElement | null = document.querySelector("#modal_edit");

  if (!modal) return;

  modal.style.display = "block";

  const name: HTMLInputElement | null = modal.querySelector("#name-input");
  const vacancy: HTMLInputElement | null =
    modal.querySelector("#vacancy-input");
  const phone: HTMLInputElement | null = modal.querySelector("#phone-input");

  const contactId: string = el.id;
  const contact: Contact | null = findContactDataLocalStorage(contactId);

  if (name && vacancy && phone && contact) {
    name.value = contact.Name;
    vacancy.value = contact.Vacancy;
    phone.value = contact.Phone;
  }

  const form: HTMLFormElement | null = modal.querySelector("#contact-form");
  if (form) {
    form.replaceWith(form.cloneNode(true));
    const freshForm: HTMLFormElement | null =
      modal.querySelector("#contact-form");

    if (freshForm) {
      freshForm.addEventListener(
        "submit",
        function (this: HTMLFormElement, event: SubmitEvent) {
          event.preventDefault();

          const nameInput: HTMLInputElement | null =
            freshForm.querySelector("#name-input");
          const vacancyInput: HTMLInputElement | null =
            freshForm.querySelector("#vacancy-input");
          const phoneInput: HTMLInputElement | null =
            freshForm.querySelector("#phone-input");
          if (nameInput && vacancyInput && phoneInput && contact)
            saveEditContact(
              nameInput,
              vacancyInput,
              phoneInput,
              contact,
              modal
            );
        }
      );
    }
  }

  const closeButton: HTMLButtonElement | null = modal.querySelector("#close");
  if (closeButton && form) {
    closeButton.onclick = function () {
      form.replaceWith(form.cloneNode(true));
      modal.style.display = "none";
    };
  }
}

function saveEditContact(
  name: HTMLInputElement,
  vacancy: HTMLInputElement,
  phone: HTMLInputElement,
  contact: Contact,
  modal: HTMLElement
): void {
  const newContact: Contact = {
    Name: name.value,
    Vacancy: vacancy.value,
    Phone: phone.value,
    id: contact.id.replace(/^./, name.value.charAt(0).toUpperCase()),
  };

  deleteContact(contact);
  addContact(newContact);

  if (searchInput.dataset.showAll === "true") {
    showAllContacts();
  } else {
    search(searchInput.value);
  }

  modal.style.display = "none";
}

function editContactHtml(contact: Contact, newContact: Contact): void {
  const oldCards: NodeListOf<HTMLElement> = document.querySelectorAll(
    `#${contact.id}`
  );
  oldCards.forEach((el: HTMLElement) => {
    el.innerHTML = createCard(newContact.id, newContact).innerHTML;
  });
}

document
  .getElementById("show-all-contacts-btn")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    showAllContacts();
  });

function showAllContacts(): void {
  searchInput.value = "";
  searchInput.dataset.showAll = "true";
  const searchHtml = document.querySelector(".search") as HTMLElement;

  if (!searchHtml) return;

  const cardsHtml = searchHtml.querySelector(".cards") as HTMLElement;

  if (!cardsHtml) return;

  cardsHtml.replaceChildren();
  cardsHtml.style.display = "block";

  if (!searchHtml) return;

  Object.keys(localStorage).forEach((key: string) => {
    addCard(key, searchHtml);
  });
}

//Поиск
const searchInputElement = document.querySelector(
  ".modal_search-input"
) as HTMLInputElement;
searchInputElement?.addEventListener("input", function (event: Event) {
  const target = event.target as HTMLInputElement;
  search(target.value);
});

function search(inputValue: string): void {
  searchInput.dataset.showAll = "false";
  const searchContainer = document.querySelector(".search");
  if (!searchContainer) return;
  const div = searchContainer.querySelector(".cards");
  if (!div) return;
  div.replaceChildren();
  const contactsDataListJSON = localStorage.getItem(
    inputValue.charAt(0).toUpperCase()
  );
  if (contactsDataListJSON !== null) {
    JSON.parse(contactsDataListJSON).map((obj: Contact) => {
      if (obj.Name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1) {
        div.appendChild(createCard(obj.id, obj));
      }
    });
  }
}

document
  .getElementById("search-contacts-btn")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    searchContacts();
  });

function searchContacts(): void {
  const modal = document.querySelector("#modal_search") as HTMLElement;
  modal.style.display = "block";
  const close = modal.querySelector("#close") as HTMLButtonElement;
  close.onclick = function () {
    modal.style.display = "none";
  };
}

window.onclick = function (event: MouseEvent): void {
  const modal_edit = document.querySelector("#modal_edit") as HTMLElement;
  const modal_search = document.querySelector("#modal_search") as HTMLElement;
  if (event.target == modal_search) {
    modal_search.style.display = "none";
    modal_search.querySelector(".cards")?.replaceChildren();
    const searchInput = modal_search.querySelector(
      ".modal_search-input"
    ) as HTMLInputElement;
    if (searchInput) searchInput.value = "";
  }
  if (event.target == modal_edit) {
    modal_edit.style.display = "none";
  }
};

//Проверка ввода в input form
function setupValidation(inputId: string): void {
  const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(
    `#${inputId}`
  );

  inputs.forEach((input: HTMLInputElement) => {
    input.title = "Please enter at least 3 Latin characters";
    input.addEventListener("input", function (this: HTMLInputElement) {
      const value = this.value.trim();

      if (value === "") {
        this.title = "Empty input";
        return;
      }

      if (value.length < 3) {
        this.title = "Please enter at least 3 characters";
        return;
      }

      if (!/^[A-Za-z]+$/.test(value)) {
        this.title = "Invalid value: Only English letters allowed";
        return;
      }
    });
  });
}

setupValidation("vacancy-input");
setupValidation("name-input");
