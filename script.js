document.addEventListener('DOMContentLoaded', function() {
    let expenses = [];
    let totalAmount = 0;

    const categorySelect = document.getElementById('category-select');
    const amountInput = document.getElementById('amount-input');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.getElementById('add-btn');
    const expenseTableBody = document.getElementById('expense-table-body');
    const totalAmountCell = document.getElementById('total-amount');
    let editingIndex = -1;

    // Load expenses from local storage on page load
    loadExpenses();

    addBtn.addEventListener('click', function() {
        const category = categorySelect.value;
        const amount = Number(amountInput.value);
        const date = dateInput.value;

        if (category === '') {
            alert('Please select a category');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        if (date === '') {
            alert('Please select a date');
            return;
        }

        if (editingIndex > -1) {
            // If editing an existing expense
            const editedExpense = { category, amount, date };
            totalAmount -= expenses[editingIndex].amount; // Subtract old amount
            totalAmount += amount; // Add new amount
            expenses[editingIndex] = editedExpense;
            saveExpenses();
            renderExpense(editingIndex, editedExpense);
            editingIndex = -1;
            addBtn.textContent = 'Add';
        } else {
            // If adding a new expense
            const newExpense = { category, amount, date };
            expenses.push(newExpense);
            totalAmount += amount;
            saveExpenses();
            renderExpense(expenses.length - 1, newExpense);
        }

        totalAmountCell.textContent = totalAmount;
        resetForm();
    });

    function renderExpense(index, expense) {
        let row;
        if (index < expenseTableBody.rows.length) {
            // If editing an existing expense, update the existing row
            row = expenseTableBody.rows[index];
        } else {
            // If adding a new expense, create a new row
            row = expenseTableBody.insertRow();
        }

        row.innerHTML = `
            <td>${expense.category}</td>
            <td>${expense.amount}</td>
            <td>${expense.date}</td>
            <td>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        const editBtn = row.querySelector('.edit-btn');
        editBtn.addEventListener('click', function() {
            editingIndex = index;
            populateForm(expense);
            addBtn.textContent = 'Update';
        });

        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            totalAmount -= expense.amount;
            totalAmountCell.textContent = totalAmount;
            expenses.splice(index, 1);
            saveExpenses();
            expenseTableBody.removeChild(row);
        });
    }

    function populateForm(expense) {
        categorySelect.value = expense.category;
        amountInput.value = expense.amount;
        dateInput.value = expense.date;
    }

    function resetForm() {
        categorySelect.value = '';
        amountInput.value = '';
        dateInput.value = '';
    }

    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function loadExpenses() {
        const storedExpenses = localStorage.getItem('expenses');
        if (storedExpenses) {
            expenses = JSON.parse(storedExpenses);
            expenses.forEach((expense, index) => {
                totalAmount += expense.amount;
                renderExpense(index, expense);
            });
            totalAmountCell.textContent = totalAmount;
        }
    }
});
