var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b, _c;
var searchInput = document.querySelector("#search-input");
window.searchInput = searchInput;
searchInput.dataset.showAll = "false";
//render -----------
function render() {
    var alphabet = [
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
    var gridContainer = document.createElement("div");
    gridContainer.className = "grid-container";
    var firstCol = document.createElement("div");
    firstCol.className = "first_col";
    var secondCol = document.createElement("div");
    secondCol.className = "second_col";
    for (var i = 0; i < alphabet.length; i += 2) {
        firstCol.appendChild(createGridCell(alphabet[i]));
        secondCol.appendChild(createGridCell(alphabet[i + 1]));
    }
    gridContainer.appendChild(firstCol);
    gridContainer.appendChild(secondCol);
    var contactsContainer = document.querySelector(".contacts");
    if (contactsContainer) {
        contactsContainer.appendChild(gridContainer);
    }
    document.querySelectorAll(".grid-cell").forEach(function (e) {
        var cell = e;
        var localStorageKey = cell.id;
        addCardsCountToHTML(localStorageKey, cell);
        cellClickListner(cell);
    });
}
function createGridCell(letter) {
    var cell = document.createElement("div");
    cell.className = "grid-cell";
    var staticContent = document.createElement("div");
    staticContent.className = "grid-cell_static-content";
    staticContent.id = "static-content";
    var countLink = document.createElement("a");
    var letterLink = document.createElement("a");
    var card = document.createElement("div");
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
function addCardsCountToHTML(localStorageKey, cellHTML) {
    var a = cellHTML.querySelector(".count");
    var data = localStorage.getItem(localStorageKey);
    if (data !== null) {
        var contacts = JSON.parse(data);
        a.innerHTML = contacts.length.toString();
        addCard(localStorageKey, cellHTML);
    }
}
render();
function cellClickListner(cellHTML) {
    var _a;
    (_a = cellHTML
        .querySelector("#static-content")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        cellHTML.classList.toggle("active");
    });
}
var uid = function (firstCharName) {
    return (firstCharName +
        Date.now().toString(36) +
        Math.random().toString(36).substr(2));
};
function addContactLocalStorage(contact) {
    localStorage.setItem(contact.id.charAt(0), createContactsListData(contact.id.charAt(0), contact));
}
function deleteContactLocalStorage(contact) {
    var contactDataKey = contact.id.charAt(0);
    var contactData = localStorage.getItem(contactDataKey);
    if (contactData) {
        var contactDataList = JSON.parse(contactData);
        var newContactDataList = contactDataList.filter(function (obj) { return obj.id !== contact.id; });
        if (newContactDataList.length === 0) {
            localStorage.removeItem(contactDataKey);
        }
        else {
            localStorage.setItem(contactDataKey, JSON.stringify(newContactDataList));
        }
    }
}
(_a = document.getElementById("contact-form")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", function (e) {
    e.preventDefault();
    addContactFromForm();
});
function addContactFromForm() {
    var inputContact = document.querySelectorAll(".contact-form_input");
    var contact = createContactObj(inputContact);
    addContact(contact);
}
function addContact(contact) {
    var contactsDataKey = contact.id.charAt(0);
    var contactsData = localStorage.getItem(contactsDataKey);
    var contactsDataList = contactsData
        ? JSON.parse(contactsData)
        : null;
    //Проверка на наличие объекта в базе данных
    if (isArrIncludeObj(contactsDataList, contact)) {
        alert("Контакт уже существует");
    }
    else {
        addContactLocalStorage(contact);
        //Добавление контакта вниз списка
        var cell = document.querySelector("#".concat(contactsDataKey));
        if (cell) {
            var cardsContainer = cell.querySelector(".cards");
            if (cardsContainer) {
                cardsContainer.appendChild(createCard(contact.id, contact));
            }
            //Обновление количества контактов на букву
            var countHtml = cell.querySelector(".count");
            if (countHtml) {
                incrementCountHTML(countHtml);
            }
        }
    }
}
function incrementCountHTML(countHtml) {
    countHtml.innerHTML = (Number(countHtml.innerHTML) + 1).toString();
}
function decrementCountHTML(countHtml) {
    var count = Number(countHtml.innerHTML);
    if (count - 1 != 0) {
        countHtml.innerHTML = (count - 1).toString();
    }
    else
        countHtml.innerHTML = "";
}
function isArrIncludeObj(arr, obj) {
    if (arr && obj) {
        return arr.some(function (el) { return isObjEqual(el, obj); });
    }
    return false;
}
function isObjEqual(obj1, obj2) {
    var newObj1 = __assign(__assign({}, obj1), { id: "" });
    var newObj2 = __assign(__assign({}, obj2), { id: "" });
    return JSON.stringify(newObj1) === JSON.stringify(newObj2);
}
function createContactObj(inputData) {
    var contact = {};
    var contactKeys = ["Name", "Vacancy", "Phone"];
    inputData.forEach(function (inputData, index) {
        contact[contactKeys[index]] = inputData.value;
    });
    var name = contact.Name || "";
    contact["id"] = uid(name.charAt(0).toUpperCase());
    return contact;
}
function createContactsListData(contactsId, contact) {
    var existingData = localStorage.getItem(contactsId);
    if (existingData !== null) {
        var contactsDataList = JSON.parse(existingData);
        contactsDataList.push(contact);
        return JSON.stringify(contactsDataList);
    }
    return JSON.stringify([contact]);
}
function clearContacts() {
    var countsHtml = document.querySelectorAll(".count");
    countsHtml.forEach(function (el) { return el.replaceChildren(); });
    var cardsHtml = document.querySelectorAll(".cards");
    cardsHtml.forEach(function (el) { return el.replaceChildren(); });
    localStorage.clear();
}
function addCard(key, el) {
    var data = localStorage.getItem(key);
    if (!data)
        return;
    var localStorageData = JSON.parse(data);
    var cardsContainer = el.querySelector(".cards");
    if (cardsContainer) {
        localStorageData.forEach(function (obj) {
            cardsContainer.appendChild(createCard(obj.id, obj));
        });
    }
}
document.addEventListener("click", function (e) {
    var _a;
    var target = e.target;
    if (target.closest("#edit-contact-btn")) {
        e.preventDefault();
        editContact(target.parentElement);
    }
    if (target.closest("#delete-contact-btn")) {
        e.preventDefault();
        var contact = findContactDataLocalStorage((_a = document.getElementById("delete-contact-btn")) === null || _a === void 0 ? void 0 : _a.parentElement.id);
        deleteContact(contact);
    }
    if (target.closest("#clear-contacts-btn")) {
        e.preventDefault();
        clearContacts();
    }
});
function createCard(id, obj) {
    var div = document.createElement("div");
    div.className = "card";
    div.id = id;
    div.innerHTML = "\n    Name: ".concat(obj.Name, " </br> \n    Vacancy: ").concat(obj.Vacancy, " </br>\n    Phone: ").concat(obj.Phone, " </br>\n    <input type=\"button\" id=\"delete-contact-btn\" class=\"btn\" value=\"x\"> </br>\n    <input type=\"button\" id=\"edit-contact-btn\" class=\"btn\" value=\"edit\">\n");
    return div;
}
function findContactDataLocalStorage(contactId) {
    var contactDataKey = contactId.charAt(0);
    var contactData = localStorage.getItem(contactDataKey);
    if (contactData) {
        var contactDataList = JSON.parse(contactData);
        var found = contactDataList.filter(function (obj) {
            return obj.id === contactId;
        })[0] || null;
        return found || null;
    }
    return null;
}
function deleteContact(contact) {
    deleteContactLocalStorage(contact);
    deleteContactHTML(contact.id);
}
function deleteContactHTML(contactId) {
    var elId = contactId.charAt(0);
    var elIdHTML = document.querySelector("#".concat(elId));
    if (elIdHTML) {
        var countHtml = elIdHTML.querySelector(".count");
        var contactHtml = document.querySelectorAll("#".concat(contactId));
        contactHtml.forEach(function (el) { return el.remove(); });
        decrementCountHTML(countHtml);
    }
}
function editContact(el) {
    var modal = document.querySelector("#modal_edit");
    if (!modal)
        return;
    modal.style.display = "block";
    var name = modal.querySelector("#name-input");
    var vacancy = modal.querySelector("#vacancy-input");
    var phone = modal.querySelector("#phone-input");
    var contactId = el.id;
    var contact = findContactDataLocalStorage(contactId);
    if (name && vacancy && phone && contact) {
        name.value = contact.Name;
        vacancy.value = contact.Vacancy;
        phone.value = contact.Phone;
    }
    var form = modal.querySelector("#contact-form");
    if (form) {
        form.replaceWith(form.cloneNode(true));
        var freshForm_1 = modal.querySelector("#contact-form");
        if (freshForm_1) {
            freshForm_1.addEventListener("submit", function (event) {
                event.preventDefault();
                var nameInput = freshForm_1.querySelector("#name-input");
                var vacancyInput = freshForm_1.querySelector("#vacancy-input");
                var phoneInput = freshForm_1.querySelector("#phone-input");
                if (nameInput && vacancyInput && phoneInput && contact)
                    saveEditContact(nameInput, vacancyInput, phoneInput, contact, modal);
            });
        }
    }
    var closeButton = modal.querySelector("#close");
    if (closeButton && form) {
        closeButton.onclick = function () {
            form.replaceWith(form.cloneNode(true));
            modal.style.display = "none";
        };
    }
}
function saveEditContact(name, vacancy, phone, contact, modal) {
    var newContact = {
        Name: name.value,
        Vacancy: vacancy.value,
        Phone: phone.value,
        id: contact.id.replace(/^./, name.value.charAt(0).toUpperCase()),
    };
    deleteContact(contact);
    addContact(newContact);
    if (searchInput.dataset.showAll === "true") {
        showAllContacts();
    }
    else {
        search(searchInput.value);
    }
    modal.style.display = "none";
}
function editContactHtml(contact, newContact) {
    var oldCards = document.querySelectorAll("#".concat(contact.id));
    oldCards.forEach(function (el) {
        el.innerHTML = createCard(newContact.id, newContact).innerHTML;
    });
}
(_b = document
    .getElementById("show-all-contacts-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function (e) {
    e.preventDefault();
    showAllContacts();
});
function showAllContacts() {
    searchInput.value = "";
    searchInput.dataset.showAll = "true";
    var searchHtml = document.querySelector(".search");
    if (!searchHtml)
        return;
    var cardsHtml = searchHtml.querySelector(".cards");
    if (!cardsHtml)
        return;
    cardsHtml.replaceChildren();
    cardsHtml.style.display = "block";
    if (!searchHtml)
        return;
    Object.keys(localStorage).forEach(function (key) {
        addCard(key, searchHtml);
    });
}
//Поиск
var searchInputElement = document.querySelector(".modal_search-input");
searchInputElement === null || searchInputElement === void 0 ? void 0 : searchInputElement.addEventListener("input", function (event) {
    var target = event.target;
    search(target.value);
});
function search(inputValue) {
    searchInput.dataset.showAll = "false";
    var searchContainer = document.querySelector(".search");
    if (!searchContainer)
        return;
    var div = searchContainer.querySelector(".cards");
    if (!div)
        return;
    div.replaceChildren();
    var contactsDataListJSON = localStorage.getItem(inputValue.charAt(0).toUpperCase());
    if (contactsDataListJSON !== null) {
        JSON.parse(contactsDataListJSON).map(function (obj) {
            if (obj.Name.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1) {
                div.appendChild(createCard(obj.id, obj));
            }
        });
    }
}
(_c = document
    .getElementById("search-contacts-btn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function (e) {
    e.preventDefault();
    searchContacts();
});
function searchContacts() {
    var modal = document.querySelector("#modal_search");
    modal.style.display = "block";
    var close = modal.querySelector("#close");
    close.onclick = function () {
        modal.style.display = "none";
    };
}
window.onclick = function (event) {
    var _a;
    var modal_edit = document.querySelector("#modal_edit");
    var modal_search = document.querySelector("#modal_search");
    if (event.target == modal_search) {
        modal_search.style.display = "none";
        (_a = modal_search.querySelector(".cards")) === null || _a === void 0 ? void 0 : _a.replaceChildren();
        var searchInput_1 = modal_search.querySelector(".modal_search-input");
        if (searchInput_1)
            searchInput_1.value = "";
    }
    if (event.target == modal_edit) {
        modal_edit.style.display = "none";
    }
};
//Проверка ввода в input form
function setupValidation(inputId) {
    var inputs = document.querySelectorAll("#".concat(inputId));
    inputs.forEach(function (input) {
        input.title = "Please enter at least 3 Latin characters";
        input.addEventListener("input", function () {
            var value = this.value.trim();
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
export {};
