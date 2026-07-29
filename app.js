const todoList=document.getElementById("todoList")
const input=document.getElementById("todoInput")
const addBtn=document.getElementById("todoBtn")

let todos =[];

input.addEventListener("keydown", (e) => { ///for using ENTER key instead of add
    if (e.key === "Enter") addTodo();
});

addBtn.addEventListener("click", addTodo);

function addTodo(){

    let todoText = input.value.trim();

    if(todoText ==""){
        alert("add value")

        return;
    }

    todos.push({
        text:todoText,
        completed:false,
    });

    saveTodo();
    input.value=""
    displayTodo();
    
}



function saveTodo(){
    localStorage.setItem("todos",JSON.stringify(todos));
}


function displayTodo(){
    todoList.innerHTML="";
    todos.forEach((todo,index) => {
        let li = document.createElement("li");
        li.className = "list";


        let checkBox = document.createElement("input")
        checkBox.type="checkBox"
        checkBox.className = "checkBox"

        checkBox.checked=todo.completed;


        checkBox.addEventListener("change", () =>{
            todo[index].completed = checkBox.checked;
            saveTodo();
            displayTodo();
        })


        let text = document.createElement("span");
        text.textContent=todo.text;
        text.className="text";


        if(todo.completed){
            text.style.textDecoration = "line-through";
            text.style.opacity="0.7";

        }


        let editBtn = document.createElement("button");
        editBtn.innerHTML="EDIT"
        editBtn.className="editBtn";
        
        editBtn.addEventListener('click', ()=>{
            editTodo(index);
        })

        if(!todo.completed){
            editBtn.addEventListener('click', ()=>{
                editTodo(index)
            });
        }
        else{
            editBtn.disabled=true;
        }

        let del = document.createElement("button")
        del.innerHTML="DELETE";
        del.className = "del-btn";

        if(!todo.completed){
            del.addEventListener("click", ()=>{
                deteleTodo(index);
            });
        }

        else{
            del.disabled = true;
        }

        li.appendChild(checkBox);
        li.appendChild(text);
        li.appendChild(editBtn);
        li.appendChild(del);
        todoList.appendChild(li)
    })
}


function editTodo(index){
    let newText = prompt("Edit your Task", todos[index].text);

    if(newText !== null && newText.trim() !== ""){
        todos[index].text=newText.trim();
        saveTodo();
        displayTodo();
    }

}

function deteleTodo(index){
    todos.splice(index,1);
    displayTodo();
    saveTodo();
}

function loadTodo(){
    let data = localStorage.getItem("todos");
    if(data){
        todos.JSON.parse(data);
        displayTodo();
    }

    
}


loadTodo();