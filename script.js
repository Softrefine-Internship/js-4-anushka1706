const allExpenses = JSON.parse(localStorage.getItem("allExpenses")) || [];
const categories = JSON.parse(localStorage.getItem("categories")) || [];
const totalExp = JSON.parse(localStorage.getItem("total")) || 0;
const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.querySelector(".expenses_table tbody");
const categorySelect = document.getElementById("category");
const categoryInput = document.querySelector(".category-input");
const no_data = document.querySelector(".no-data-message");
const table = document.querySelector(".table-div");
// console.log(totalExp);
document.addEventListener("DOMContentLoaded", () => {
  allExpenses.forEach(addExpenseToTable);
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
      mostSpentTag.textContent = "Most Spent On";
      div.appendChild(mostSpentTag);
      div.style.background =
        "linear-gradient(to bottom right,rgb(166, 115, 210), black)";
    }
  }

}

function calculateTotal() {
  const data = JSON.parse(localStorage.getItem("allExpenses")) || [];
  let total = 0;
console.log(data)
  for (let i = 0; i < data.length; i++) {
    if (data[i].amount) {
      total += Number(data[i].amount);
    }
  }
  const summary = document.querySelector(".span-amount");
  localStorage.setItem("total", total);
  summary.textContent = total;
}

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
    const amount = document.getElementById("amount").value.trim();
    const category = categorySelect.value;

    if (validateForm(name, date, amount, category)) {
      const expense = { id: Date.now(), name, date, amount, category };
      allExpenses.push(expense);
      addExpenseToTable(expense);
      saveToLocalStorage();
      expenseForm.reset();
      no_data.style.display = "none";
      table.style.display = "block";
      // categorySelect.value = " ";
    }
  }

  if (event.target.classList.contains("add-category-btn")) {
    saveCategory();
  }

  if (event.target.classList.contains("delete-btn")) {
    const expenseId = Number(event.target.dataset.id);
    const index = allExpenses.findIndex((exp) => exp.id === expenseId);
    if (index !== -1) {
      allExpenses.splice(index, 1);
      event.target.closest("tr").remove();
      saveToLocalStorage();
      calculateTotal();
      if (allExpenses.length === 0) {
        table.style.display = "none";
        no_data.style.display = "block";
      }
      updateBorderRadius()
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
    <td><button class="delete-btn" data-id="${expense.id}"><ion-icon name="trash-outline"></ion-icon></button></td>
  `;
  expenseTableBody.appendChild(row);
  updateBorderRadius();
}

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

  if (isNaN(amount) || amount <= 0) {
    alert("Amount should be a valid positive number!");
    return false;
  }

  return true;
}

function saveCategory() {
  const newCategory = categoryInput.value.trim();

  if (!newCategory || categories.includes(newCategory)) {
    alert("Please enter a unique category name!");
    return;
  }
  if (!isNaN(newCategory)) {
    alert("Pleese dont enter number");
  }
  categories.push(newCategory);
  console.log(categories);
  localStorage.setItem("categories", JSON.stringify(categories));
  updateCategoryDropdown(newCategory);
  showPopup("New category added!");
  categoryInput.value = "";
}

function updateCategoryDropdown(newCategory) {
  const option = document.createElement("option");
  option.value = newCategory;
  option.textContent = newCategory;
  categorySelect.appendChild(option);
}
function loadCategory() {
  const c = JSON.parse(localStorage.getItem("categories"));
  if (c)
    for (let i = 0; i < c.length; i++) {
      const option = document.createElement("option");
      option.value = c[i];
      option.textContent = c[i];
      categorySelect.appendChild(option);
    }
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
  const rows = expenseTableBody.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td');
    cells.forEach(cell => {
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

