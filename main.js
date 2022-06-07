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
json-server - w db.json -p 8000
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

// получаем элемент, чтобы в нем отобразились все таски
let list = document.getElementById('list')
// проверяем в консоли, чтобы убедиться, что в переменной list сейчас НЕ пусто
console.log(list);
// функция для получения всех тасков и отображнения их в div#list
// async await нужен здесь, чтоб при отправке запроса мы сначала получили данные и только потои записали все в переменную response, иначе (если мы НЕ дождемся) туда запишется pending (состояние промиса, который еще не выполнен)
async function getTodos(){
    let response = await fetch(API) // если не указать метод запроса, то по умолчанию это GET запрос
    .then((res) => res.json()) // переводим все в json формат
    .catch(err => console.log(err)); // отшовили ошибку
    console.log(response);
    // очищаем div#list, чтоб список тасков корректно отображался и не хранил там предыдущие элементы со старыми данными
    list.innerHTML = ""
    // перебираем полученный из дб.жсон массив и для каждого объекта из этого массива создаем div и задаем ему содержимое через метод innerHTML, каждый созданный элемент аппендим в div#list
    response.forEach((item) => {
        let newElem = document.createElement('div')
        newElem.innerHTML = `<span>${item.todo}</span>`
        list.append(newElem)
    })
}
// вызываем функцию, чтоб как только откроется страница что-то было отображено
getTodos()

