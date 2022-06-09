/*
? Виды запросов
POST - добавление данных
PUT - полная замена данных
PATCH - частичная замена данных
DELETE - удаление
GET - получение данных
*/
/*
? команды для запуска json-server
json-server -w db.json -p 8000
*/
/*
CRUD - Create Read Update Delete
Read(Get)
Update(Put/Patch)
Delete(Delete)
*/

const API = "http://localhost:8000/todos";

//! CREATE

// получаем нужные для добавления элементы
let inpAdd = document.getElementById('inp-add');
let btnAdd = document.getElementById('btn-add');
// console.log(inpAdd, btnAdd);

// навесили события на кнопку сохранить
btnAdd.addEventListener('click', async function(){
    // собираем объект для добавления в дб.жсон
    let newTodo = {
        todo: inpAdd.value
    }
    // console.log(newTodo);
    // проверка на зполненность инпута и останавливаем код
    if(newTodo.todo.trim() === ""){
        alert('Заполните поля')
        return
    }
    // звпрос для добавления
    await fetch(API, {
        method: "POST",  // указыаем метод
        body: JSON.stringify(newTodo),   // указываем что именно нужно запостить
        headers: {
            "Content-type": "application/json; charset=utf-8"
        }
    });
    // очищаем инпут после добавления
    inpAdd.value = ""
    // чтобы добавленный таск сразу отобразился в листе вызываем функцию, котрая выполняет отображение
    getTodos()
});

//! READ
// ! Search
let inpSearch = document.getElementById('inp-search');
// console.log(inpSearch);
inpSearch.addEventListener('input', function(){
    // console.log('input!');
    getTodos()
})

//! Pagination
let pagination = document.getElementById('pagination')
// console.log(pagination);
let page = 1;

// получаем элемент, чтобы в нем отобразились все таски
let list = document.getElementById('list')
// проверяем в консоли, чтобы убедиться, что в переменной list сейчас НЕ пусто
// console.log(list);
// функция для получения всех тасков и отображнения их в div#list
// async await нужен здесь, чтоб при отправке запроса мы сначала получили данные и только потои записали все в переменную response, иначе (если мы НЕ дождемся) туда запишется pending (состояние промиса, который еще не выполнен)
async function getTodos(){
    let response = await fetch(`${API}?q=${inpSearch.value}&_page=${page}&_limit=2`) // если не указать метод запроса, то по умолчанию это GET запрос
    .then((res) => res.json()) // переводим все в json формат
    .catch(err => console.log(err)); // отловили ошибку
    // console.log(response);

    // AllTodos - все элементы из db.json
    let allTodos = await fetch(API)
    .then(res => res.json())
    .catch(err => console.log(err))
    // посчитали какой будет последняя страница
    let lastPage = Math.ceil(allTodos.length / 2);
    // очищаем div#list, чтоб список тасков корректно отображался и не хранил там предыдущие элементы со старыми данными
    list.innerHTML = ""
    // перебираем полученный из дб.жсон массив и для каждого объекта из этого массива создаем div и задаем ему содержимое через метод innerHTML, каждый созданный элемент аппендим в div#list
    response.forEach((item) => {
        let newElem = document.createElement('div')
        newElem.id = item.id
        newElem.innerHTML = `<span>${item.todo}</span>
        <button class='btn-delete'>Delete</button>
        <button class='btn-edit'>Edit</button>`
        list.append(newElem)
    })

    // добавляем пагинацию
    pagination.innerHTML = `
    <button id='btn-prev' ${page === 1 ? 'disabled' : ''}>Prev</button>
    <span>${page}</span>
    <button ${page === lastPage ? 'disabled' : ''} id='btn-next'>Next</button>
    `;
}
// вызываем функцию, чтоб как только откроется страница что-то было отображено
getTodos()

// элементы из модалки для редактирования
let modalEdit = document.getElementById('modal-edit')
let modalEditClose = document.getElementById('modal-edit-close')
let inpEditTodo = document.getElementById('inp-edit-todo')
let inpEditId = document.getElementById('inp-edit-id')
let btnSaveEdit = document.getElementById('btn-save-edit')
// console.log(inpEditTodo, inpEditId, btnSaveEdit);

// функция чтоб закрыть модалку
modalEditClose.addEventListener('click', function(){
    modalEdit.style.display = 'none'
});
// функция для сохранения изменений при редактировании
btnSaveEdit.addEventListener('click', async function(){
    // объект с отредактированными данными
    let editedTodo = {
        todo: inpEditTodo.value,
    }
    let id = inpEditId.value
    // запрос для изменения данных
    await fetch(`${API}/${id}`, {
        method: "PATCH",  // указыаем метод
        body: JSON.stringify(editedTodo),   // указываем что именно нужно запостить
        headers: {
            "Content-type": "application/json; charset=utf-8"
        }   // кодировка
    })
    // после изменения закрываем модалку для эдит
    modalEdit.style.display = 'none';
    getTodos()
});


document.addEventListener('click', async function(e){
    //! Delete
    if(e.target.className === 'btn-delete'){
        // запрос для удаления
        let id = e.target.parentNode.id
        await fetch(`${API}/${id}`, {
            method: 'DELETE',
        })
        getTodos()
    };
    //! Update (edit)
    if(e.target.className === 'btn-edit'){
        modalEdit.style.display = 'flex';
        let id = e.target.parentNode.id
        // запрос для получения данных чтобы мы могли отобразить все в модалке для ракдактирования
        let response = await fetch(`${API}/${id}`)
        .then((res) => res.json())
        .catch(err => console.log(err))
        // полученные данные отображаем в инпутах из html
        inpEditTodo.value = response.todo;
        inpEditId.value = response.id
    }
    // console.log(e.target.parentNode.id);
    //! Pagination
    if(e.target.id === 'btn-next'){
        page++;
        getTodos();
    }
    if(e.target.id === 'btn-prev'){
        page--;
        getTodos();
    }
})

