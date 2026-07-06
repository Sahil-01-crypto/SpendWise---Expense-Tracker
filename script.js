const form = document.querySelector("#expense-form");
const title = document.querySelector("#expense-title");
const amount = document.querySelector("#expense-amount");
const category = document.querySelector("#expense-category");
const date = document.querySelector("#expense-date");
const textarea = document.querySelector("#expense-notes");
const editAction = document.querySelector(".edit-actions");
const addtext = document . querySelector(".addtext")

const cancelBtn = document.querySelector(".cancel-btn")
const addBtn = document.querySelector(".primary-btn");

const clearAll = document.querySelector(".clear-btn");

const toastContainer = document.querySelector("#toast-container")



// Food Title Validation Regular Expression
const itemTitleRegex = /^[a-zA-Z0-9\s\x27\-]{2,50}$/;
const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;




let editId = null; 


// Form submission event listener 
form.addEventListener("submit", function (event) {
    event.preventDefault();


  if( editId!= null){
    updateTransaction();
    return ;
  }

    //     safety check for name 
    const itemName = title.value.trim();
    if (!itemTitleRegex.test(itemName)) {
        alert("Please enter a valid item title (2-50 characters, no special symbols).")
        return;
    }


    const expense = {
        id: crypto.randomUUID(),
        item: itemName,
        amount: Number(amount.value.trim()),
        category: category.value,
        date: date.value,
        note: textarea.value.trim()
    };
    console.log(expense)

    saveToLocalStorage(expense);
    toastNotification(
    "Success",
    "Transaction Added Successfully",
    "success"
);
    loadTransactions()

    form.reset();



});


function saveToLocalStorage(expense) {
    let data = localStorage.getItem("transaction")
    if (data === null) {
        const item = [];
        item.push(expense);
        localStorage.setItem("transaction", JSON.stringify(item));

    }
    else {
        data = JSON.parse(data);
        data.push(expense);
        localStorage.setItem("transaction", JSON.stringify(data));
    }
}

// Dynamic generation of task

let emptystate = document.querySelector(".empty-state")
const expensecont = document.querySelector("#expense-list")

function loadTransactions() {

    expensecont.innerHTML = ""

    const allitem = JSON.parse(localStorage.getItem("transaction")) || [];
    if (allitem.length === 0) {

        emptystate.style.display = "block"
    }
    else {
        emptystate.style.display = "none"
    }

    allitem.forEach(detail => {


        // 1. Create main container article
        const article = document.createElement("article");
        article.classList.add("expense-card");

        // 2. Create left side (expense-info block)
        const expenseInfo = document.createElement("div");
        expenseInfo.classList.add("expense-info");

        const expenseIcon = document.createElement("div");
        expenseIcon.classList.add("expense-icon");
        if (detail.category === "Food") {
            expenseIcon.textContent = "🍕";
        }
        else if (detail.category === "Travel") {
            expenseIcon.textContent = "✈️";
        }
        else if (detail.category === "Shopping") {
            expenseIcon.textContent = "🛍️";
        }
        else if (detail.category === "Bills") {
            expenseIcon.textContent = "💸";
        }
        else if (detail.category === "Entertainment") {
            expenseIcon.textContent = "🎭";
        }
        else if (detail.category === "Health") {
            expenseIcon.textContent = "🧑🏻‍⚕️";
        }
        else if (detail.category === "Education") {
            expenseIcon.textContent = "📚"
        }
        else {
            expenseIcon.textContent = "✔️";
        }



        const detailsDiv = document.createElement("div");

        const h3Title = document.createElement("h3");
        h3Title.textContent = detail.item;

        const metaSpan = document.createElement("span");
        metaSpan.textContent = `${detail.category} • ${detail.date}`;

        // Assemble left side
        detailsDiv.appendChild(h3Title);
        detailsDiv.appendChild(metaSpan);
        expenseInfo.appendChild(expenseIcon);
        expenseInfo.appendChild(detailsDiv);

        // 3. Create right side (expense-actions block)
        const expenseActions = document.createElement("div");
        expenseActions.classList.add("expense-actions");

        const h3Amount = document.createElement("h3");
        h3Amount.textContent = `₹${detail.amount}`; // e.g., "₹450"

        const buttonsDiv = document.createElement("div");

        // Edit button & FontAwesome icon
        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-solid", "fa-pen");
        editBtn.appendChild(editIcon);

        // Delete button & FontAwesome icon
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash");
        deleteBtn.appendChild(deleteIcon);

        // Assemble right side
        buttonsDiv.appendChild(editBtn);
        buttonsDiv.appendChild(deleteBtn);
        expenseActions.appendChild(h3Amount);
        expenseActions.appendChild(buttonsDiv);

        // 4. Combine both sides into the main article
        article.appendChild(expenseInfo);
        article.appendChild(expenseActions);
        expensecont.appendChild(article);

        // Adding Delete Functionality
        deleteBtn.addEventListener("click", function () {
            console.log("delete")
            deleteItem(detail.id)
        })

        editBtn.addEventListener("click", function () {

            editItem(detail);
        })
    });


}


function editItem(detail) {
    title.value = detail.item;
    amount.value = detail.amount;
    category.value = detail.category;
    date.value = detail.date;
    textarea.value = detail.note;

    editId = detail.id;
   editAction.style.display ="block"
    addtext.textContent="update Item"

}




function updateTransaction() {

    const allTransaction = JSON.parse(localStorage.getItem("transaction"));
    for (let i = 0; i < allTransaction.length; i++) {
        if (allTransaction[i].id === editId) {
            allTransaction[i].item = title.value.trim();
            allTransaction[i].amount = Number(amount.value.trim())
            allTransaction[i].category = category.value;
            allTransaction[i].date = date.value.trim();
            allTransaction[i].note = textarea.value.trim();

            break;

        }
    }
    localStorage.setItem("transaction", JSON.stringify(allTransaction));

    editId = null;
    addtext.textContent="Add Transaction"
     editAction.style.display = "none";
    form.reset();

toastNotification(
    "Updated",
    "Transaction Updated Successfully",
    "info"
);
    

    loadTransactions();


}

 cancelBtn.addEventListener("click", function () {
        form.reset();
        addtext.textContent="Add Transaction"
        addBtn.style.display = "block"
       
        editAction.style.display = "none";
        editId = null;
    })

function deleteItem(id) {
    const dataItem = JSON.parse(localStorage.getItem("transaction"));
    const newTransaction = dataItem.filter(function (transaction) {
        return transaction.id !== id;
    })
    localStorage.setItem("transaction", JSON.stringify(newTransaction));

    toastNotification(
    "Deleted",
    "Transaction Removed",
    "error"
);

    loadTransactions();
}


clearAll.addEventListener("click",function(){

    const isConfirmed = confirm(
        "Are you sure you want to delete all transactions?"
    ); 
    if(!isConfirmed)return 


    localStorage.removeItem("transaction");
    loadTransactions();
})


function toastNotification(info , data  , type ){
    const toast = document.createElement("div");
    toast.classList.add("toast" , type);

    const h3 = document.createElement("H3")
    h3.textContent=info ;

    const  p = document.createElement("p")
    p.textContent =data ;

    toast.appendChild(h3);
    toast.appendChild(p);
    toastContainer.appendChild(toast);
setTimeout(() => {

    toast.classList.add("hide");

    setTimeout(() => {

        toast.remove();

    },350);

},3000);



}


loadTransactions();