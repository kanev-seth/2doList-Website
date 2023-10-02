//Variables
let todoItems = []
const todoInput = document.querySelector('.todo-input')
const completed2dosDiv = document.querySelector('.completed-todos')
const uncompleted2dosDiv = document.querySelector('.uncompleted-todos')
const audio = new Audio('sound.mp3')

//Get 2do List on first boot
window.onload = () => {
    let storage2doItems = localStorage.getItem('todoItems')
    if(storage2doItems !== null){
        todoItems = JSON.parse(storage2doItems)
    }

    render()
}

//Get the content typed into the input
todoInput.onkeyup = ((e) => {
    let value = e.target.value.replace(/^\s+/, "")
    if(value && e.keyCode == 13) { //Enter
        add2do(value)

        todoInput.value = ''
        todoInput.focus()

    }
})

//Add 2do
function add2do(text){
    todoItems.push({
        id: Date.now(),
        text,
        completed: false
    })

    saveAndRender()
}

//Remove 2do
function remove2do(id) {
    todoItems = todoItems.filter(todo => todo.id !== Number(id))
    saveAndRender()
}

//Mark as completed
function markAsCompleted(id){
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = true
        }

        return todo
    })

    audio.play()

    saveAndRender()
}

//Mark as uncompleted
function markAsUncompleted(id){
    todoItems = todoItems.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = false
        }

        return todo
    })

    saveAndRender()
}

//Save in localstorage
function save(){
    localStorage.setItem('todoItems', JSON.stringify(todoItems))
}

//Render
function render(){
    let unCompleted2dos = todoItems.filter(item => !item.completed)
    let completed2dos = todoItems.filter(item => item.completed)

    completed2dosDiv.innerHTML = ''
    uncompleted2dosDiv.innerHTML = ''

    if(unCompleted2dos.length > 0)
    {
        unCompleted2dos.forEach(todo => {
            uncompleted2dosDiv.append(create2doElement(todo))
        })
    }else{
        uncompleted2dosDiv.innerHTML = `<div class='empty'>No uncompleted tasks</div>`
    }

    if(completed2dos.length > 0){
        completed2dosDiv.innerHTML = `<div class='completed-title'>Completed (${completed2dos.length} / ${todoItems.length})</div>`

        completed2dos.forEach(todo => {
            completed2dosDiv.append(create2doElement(todo))
        })
    }
}

//Save and render
function saveAndRender(){
    save()
    render()
}

//Create 2do list item
function create2doElement(todo){
    //Create 2todo list container
    const todoDiv = document.createElement('div')
    todoDiv.setAttribute('data-id', todo.id)
    todoDiv.className = 'todo-item'

    //Create 2do item text
    const todoTextSpan = document.createElement('span')
    todoTextSpan.innerHTML = todo.text

    //Checkbox for list
    const todoInputCheckbox = document.createElement('input')
    todoInputCheckbox.type = 'checkbox'
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsCompleted(id)
    }

    //Delete button for list
    const todoRemoveBtn = document.createElement('a')
    todoRemoveBtn.href = '#'
    todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M4 7h16"></path>
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                            <path d="M10 12l4 4m0 -4l-4 4"></path>
                         </svg>`
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo-item').dataset.id
        remove2do(id)
    }

    todoTextSpan.prepend(todoInputCheckbox)
    todoDiv.appendChild(todoTextSpan)
    todoDiv.appendChild(todoRemoveBtn)

    return todoDiv
}