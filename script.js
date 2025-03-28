const allExpenses = localStorage.getItem("allExpenses")
  ? JSON.parse(localStorage.getItem("allExpenses"))
  : [];
const totalExp = localStorage.getItem("total")
  ? JSON.parse(localStorage.getItem("total"))
  : 0;
const categories = localStorage.getItem("categories")
  ? JSON.parse(localStorage.getItem("categories"))
  : [];
const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.querySelector(".expenses_table tbody");
const categorySelect = document.getElementById("category");
const categoryInput = document.querySelector(".category-input");
const no_data = document.querySelector(".no-data-message");
const table = document.querySelector(".table-div");
const category_section = document.querySelector(".add-category");
let existingOptions = [];
// console.log(totalExp);
console.log(categories);
document.addEventListener("DOMContentLoaded", () => {
  allExpenses.forEach(addExpenseToTable);
  // // const existingOptions = categorySelect.options.map((option) => option.value);
  // console.log(categorySelect.options);return
  loadDefaultOptions();
  loadCategory();
  calculateTotal();
  calculateCategory();
  if (allExpenses.length === 0) {
    table.style.display = "none";
    no_data.style.display = "block";
  } else {
    no_data.style.display = "none";
  }
});
function loadDefaultOptions() {
  console.log("anushka");
  Array.from(categorySelect.options).forEach((option) => {
    if (
      !option.value == " " &&
      !categories.includes(option.value.toLowerCase())
    )
      categories.push(option.value.toLowerCase());
    existingOptions.push(option.value.toLowerCase());
  });
  localStorage.setItem("categories", JSON.stringify(categories));
  console.log(existingOptions, "exsisting");
}
function calculateCategory() {
  const data = JSON.parse(localStorage.getItem("allExpenses")) || [];
  const cat_obj = {};

  for (let i = 0; i < data.length; i++) {
    const category = data[i].category;
    const amount = Number(data[i].amount);

    if (cat_obj[category]) {
      cat_obj[category] += amount;
    } else {
      cat_obj[category] = amount;
    }
  }
  const summary_container = document.querySelector(".category-summary");
  summary_container.innerHTML = "";
  let maxCategory = "";
  let maxAmount = 0;

  for (const key in cat_obj) {
    if (cat_obj[key] > maxAmount) {
      maxAmount = cat_obj[key];
      maxCategory = key;
    }
  }
  for (const key in cat_obj) {
    const div = document.createElement("div");
    div.className = `${key}-summary-amount category-sum`;
    const p = document.createElement("p");
    p.className = "cat-heading";
    p.textContent = key.toUpperCase();
    div.appendChild(p);
    const span = document.createElement("span");
    span.className = "cat-amount";
    span.textContent = `₹${cat_obj[key]}`;
    div.appendChild(span);
    summary_container.appendChild(div);

    if (key === maxCategory) {
      const mostSpentTag = document.createElement("span");
      mostSpentTag.className = "most-spent-tag";
      const icon = document.createElement("ion-icon");
      icon.setAttribute("name", "star");
      icon.className = "star-icon";
      mostSpentTag.appendChild(icon);
      mostSpentTag.appendChild(document.createTextNode(" Most Spent On"));

      div.appendChild(mostSpentTag);
      div.style.background =
        "linear-gradient(to bottom right, #a5caf2, #3f80d8)";
    }
  }
}

function calculateTotal() {
  const data = JSON.parse(localStorage.getItem("allExpenses")) || [];
  let total = 0;
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    if (data[i].amount) {
      total += Number(data[i].amount);
    }
  }
  const summary = document.querySelector(".span-amount");
  localStorage.setItem("total", total);
  summary.textContent = total;
}
category_section.addEventListener("click", function (e) {
  console.log("sdfghjkl;'");
  if (e.target.closest(".add-category-btn")) {
    saveCategory();
  }
});
document.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("add-expense-btn") ||
    event.target.classList.contains("add-category-btn") ||
    event.target.classList.contains("delete-btn")
  )
    event.preventDefault();

  if (event.target.classList.contains("add-expense-btn")) {
    const name = document.getElementById("name").value.trim();
    const date = document.getElementById("date").value;
    const amount = Number(
      parseFloat(document.getElementById("amount").value.trim()).toFixed(2)
    );

    const category = categorySelect.value;

    if (validateForm(name, date, amount, category)) {
      const formattedDate = formatDate(date);
      console.log(formattedDate);
      const expense = {
        id: Date.now(),
        name,
        date: formattedDate,
        amount,
        category,
      };
      allExpenses.push(expense);
      saveToLocalStorage();
      addExpenseToTable(expense);
      expenseForm.reset();
      no_data.style.display = "none";
      table.style.display = "block";
      // categorySelect.value = " ";
    }
  }
});

function addExpenseToTable(expense) {
  const row = document.createElement("tr");
  row.className = "expense-data";
  row.innerHTML = `
    <td>${expense.name}</td>
    <td>₹${expense.amount} </td>
    <td>${expense.date}</td>
    <td>${expense.category}</td>
    <td><button class="delete-btn" data-id="${expense.id}"><svg fill="#e3e3e3" width="64px" class="bin-icon" height="64px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" stroke="#e3e3e3"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 15.7566 49.5476 L 40.2434 49.5476 C 44.8420 49.5476 46.8962 47.4001 47.5731 42.8248 L 51.0511 19.4118 L 51.5645 19.4118 C 54.4358 19.4118 56 17.6144 56 14.7665 L 56 11.2183 C 56 8.3705 54.4358 6.5731 51.5645 6.5731 L 4.4352 6.5731 C 1.7040 6.5731 0 8.3705 0 11.2183 L 0 14.7665 C 0 17.6144 1.5640 19.4118 4.4352 19.4118 L 4.9721 19.4118 L 8.4268 42.8248 C 9.1271 47.4234 11.1579 49.5476 15.7566 49.5476 Z M 5.3922 15.8870 C 4.2251 15.8870 3.7582 15.3968 3.7582 14.2296 L 3.7582 11.7553 C 3.7582 10.5881 4.2251 10.0979 5.3922 10.0979 L 50.6308 10.0979 C 51.7983 10.0979 52.2419 10.5881 52.2419 11.7553 L 52.2419 14.2296 C 52.2419 15.3968 51.7983 15.8870 50.6308 15.8870 Z M 15.8032 46.0228 C 13.7024 46.0228 12.5118 45.0891 12.1617 42.7782 L 8.6836 19.4118 L 47.3164 19.4118 L 43.8380 42.7782 C 43.5115 45.0891 42.2743 46.0228 40.1967 46.0228 Z M 21.2188 41.1441 C 21.7090 41.1441 22.1292 40.9107 22.4560 40.5839 L 27.9883 35.0516 L 33.5206 40.5839 C 33.8474 40.8874 34.2676 41.1441 34.7811 41.1441 C 35.7615 41.1441 36.5552 40.3038 36.5552 39.3234 C 36.5552 38.7865 36.3451 38.4130 36.0183 38.0629 L 30.5093 32.5539 L 36.0416 26.9749 C 36.3918 26.6014 36.5785 26.2513 36.5785 25.7611 C 36.5785 24.7573 35.7849 23.9637 34.7811 23.9637 C 34.3376 23.9637 33.9408 24.1504 33.5673 24.5239 L 27.9883 30.0562 L 22.4326 24.5472 C 22.0825 24.1971 21.7090 24.0104 21.2188 24.0104 C 20.2384 24.0104 19.4214 24.7807 19.4214 25.7611 C 19.4214 26.2746 19.6315 26.6715 19.9583 26.9983 L 25.4673 32.5539 L 19.9583 38.0862 C 19.6315 38.4130 19.4214 38.8098 19.4214 39.3234 C 19.4214 40.3038 20.2150 41.1441 21.2188 41.1441 Z"></path></g></svg></button></td>
  `;
  expenseTableBody.appendChild(row);
  updateBorderRadius();
}
expenseTableBody.addEventListener("click", function (event) {
  if (event.target.closest(".delete-btn")) {
    const button = event.target.closest(".delete-btn");
    const expenseId = Number(button.dataset.id);
    const index = allExpenses.findIndex((exp) => exp.id === expenseId);

    if (index !== -1) {
      allExpenses.splice(index, 1);
      button.closest("tr").remove();
      saveToLocalStorage();
      calculateTotal();

      if (allExpenses.length === 0) {
        table.style.display = "none";
        no_data.style.display = "block";
      }
      updateBorderRadius();
    }
  }
});

function saveToLocalStorage() {
  localStorage.setItem("allExpenses", JSON.stringify(allExpenses));
  calculateTotal();
  calculateCategory();
}

function validateForm(name, date, amount, category) {
  if (!name || !date || !amount || !category) {
    alert("Please fill in all fields!");
    return false;
  }
  if (!isNaN(name)) {
    alert("Expense name should be a string, not a number!");
    return false;
  }
  if (isNaN(amount) || amount <= 0 || amount > 999999) {
    if (amount > 999999) alert("Amount should be less than 1,000,000");
    else alert("Amount should be a valid positive number!");
    return false;
  }
  return true;
}
function saveCategory() {
  const newCategory = categoryInput.value.trim().toLowerCase();
  console.log(newCategory);
  if (!newCategory || categories.includes(newCategory)) {
    alert("Please enter a unique category name!");
    categoryInput.value = "";
    return;
  }
  if (!isNaN(newCategory)) {
    alert("Pleese dont enter number");
    categoryInput.value = "";
    return;
  }
  categories.push(newCategory);
  console.log(categories);
  localStorage.setItem("categories", JSON.stringify(categories));
  updateCategoryDropdown(newCategory);
  showPopup("New category added!");
  categoryInput.value = "";
  // loadCategory();
}

function updateCategoryDropdown(newCategory) {
  const option = document.createElement("option");
  option.value = newCategory;
  option.textContent = newCategory.toLowerCase();
  categorySelect.appendChild(option);
}
function loadCategory() {
  const c = JSON.parse(localStorage.getItem("categories")) || [];
  c.forEach((category) => {
    if (!existingOptions.includes(category.toLowerCase())) {
      // categorySelect.innerHTML = "";
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    }
  });
}

function showPopup(message) {
  const popup = document.querySelector(".popup");
  popup.classList.remove("show", "hide");
  popup.innerHTML = `<img src="check.png" alt="Success"> <span>${message}</span>`;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.add("hide");
  }, 1500);
}
function updateBorderRadius() {
  const rows = expenseTableBody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.style.borderRadius = "0";
    });

    if (rows.length === 1) {
      cells[0].style.borderTopLeftRadius = "20px";
      cells[cells.length - 1].style.borderTopRightRadius = "20px";
      cells[0].style.borderBottomLeftRadius = "20px";
      cells[cells.length - 1].style.borderBottomRightRadius = "20px";
    } else {
      if (index === 0) {
        cells[0].style.borderTopLeftRadius = "20px";
        cells[cells.length - 1].style.borderTopRightRadius = "20px";
      }
      if (index === rows.length - 1) {
        cells[0].style.borderBottomLeftRadius = "20px";
        cells[cells.length - 1].style.borderBottomRightRadius = "20px";
      }
    }
  });
}
function formatDate(inputDate) {
  const dateObj = new Date(inputDate);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}-${month}-${year}`;
}
