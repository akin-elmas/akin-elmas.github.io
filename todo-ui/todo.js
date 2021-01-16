let form = document.querySelector("#todo-form");
let todoInput = document.querySelector("#todo");
let todoList = document.querySelector(".list-group");
let firstCardBody = document.querySelectorAll(".card-body")[0];
let secondCardBody = document.querySelectorAll(".card-body")[1];

let filter = document.querySelector("#filter");
let clearButton = document.querySelector("#clear-todos");

// Bütün event listenerları bu fonksiyona ekleyeceğiz.
eventListeners();
function eventListeners(){
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadlAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}


function clearAllTodos(){
    

    if(confirm("Emin misiniz ?")){
        while(todoList.firstElementChild != null){
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos"); // Tümünü sil.
    }

}

function filterTodos(e){
    //Filter input alanında büyük harflede yazılsa metodla küçülttük.
    let filterValue = e.target.value.toLowerCase();
    let listItems = document.querySelectorAll(".list-group-item");


    listItems.forEach(function(listitem){
        let text = listitem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1){
            // indexOf bulamadığında -1 döner. bu durumda ekrandaki görüntüsünü kaldırıyoruz.
            listitem.setAttribute("style","display : none !important");
        }else {
            listitem.setAttribute("style","display : block");
        }
    })
}

function deleteTodo(e){

    if(e.target.className === "fa fa-remove"){
        // Todo arayüzden silindi.
        e.target.parentElement.parentElement.remove();
        // Storage'dan silinecek olan ögenin localstoragedaki keyi = ui'daki textContenti fonksiyona parametre olarak verdik.
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi.");
    }
    


}

//parametresi yukarıdan yollanan textContent.
function deleteTodoFromStorage(deletetodo){
    // Storage'dan verileri çektik - parametre ile kıyasladık.
    let todos = getTodosFromStorage();
    
    //Splice metodu index no ile çalışarak silme işlemi yapar.
    todos.forEach(function(todo,index){ // hem elemanı hemde indexini aldık.
        if(todo === deletetodo){
            todos.splice(index,1); // ilgili indexten sonra 1 obj siliyor.
        }
    });

    // İlgili ögeyi tekrardan yolladık.
    localStorage.setItem("todos",JSON.stringify(todos));
}

function loadlAllTodosToUI(){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo); // Local storage'dan bütün todo ögelerini çektik.
    })
}


function addTodo(e){
    // trim function ile baş-son boşlukları sildik.
    let newTodo = todoInput.value.trim();


    // Input dolu - boş kontrolü.
    if(newTodo === ""){
        showAlert("danger","Lütfen bir todo giriniz.");
    }else {
        // Arayüze todo ekleme fonksiyonu.
        addTodoToUI(newTodo);
        // Storage'a todo ekleme.
        addTodoToStorage(newTodo);
        showAlert("success","Todo başarıyla eklendi.")
    }



    e.preventDefault(); // default olarak gerçekleşen yenileme işlemini engelledik.

}

function getTodosFromStorage(){ // Storagedan todoları aldık.
    let todos;

    if (localStorage.getItem("todos") === null){
        todos = [];
    }else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos; // Oluşturduktan sonra dışarıya döndük.
}

function addTodoToStorage(newTodo){
    // var olanı aldık.
    let todos = getTodosFromStorage();
    // geleni ekledik.
    todos.push(newTodo);
    // güncelleme işlemi yaptık.
    localStorage.setItem("todos",JSON.stringify(todos));

}

function showAlert(type,message){
    // Boş yollanması durumunda bootstrap modallardan kullanarak kullanıcı uyarıldı.
    let alert = document.createElement("div");

    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Dökümana uyarıyı ekledik.
    firstCardBody.appendChild(alert);
    // Dökümandan uyarıyı 1sn sonra sildik.
    setTimeout(function(){
        alert.remove();
    },1000)
}



function addTodoToUI(newTodo){
    //list item oluşturma
    let listItem = document.createElement("li");
     //link oluşturma
    let link = document.createElement("a");
    
    link.href ="#";
    link.className ="delete-item";
    link.innerHTML ="<i class ='fa fa-remove'></i>";
    listItem.className ="list-group-item d-flex justify-content-between";

    // Text Node Ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);



    // Todo List'e list item ı ekleme
    todoList.appendChild(listItem);
    // Ekleme işleminden sonra input içi veriler temizlendi.
    todoInput.value = "";
    
}

