document.addEventListener('DOMContentLoaded', () => {
    document.querySelector("form").addEventListener("submit", (e) => e.preventDefault())
})

const table = document.querySelector("#table-body")

fetch("http://localhost:3000/dogs", {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
})
.then(resp => resp.json())
.then(data => {
    for (i in data) {
        let name = data[i].name
        let breed = data[i].breed
        let sex = data[i].sex
        let id = data[i].id

        let  tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${name}</td>
            <td>${breed}</td>
            <td>${sex}</td>
            <td id=${id}><button>Edit</button></td>`
        table.appendChild(tr)
    }
    let buttons = table.getElementsByTagName("button")
    for (i in buttons) {
        buttons[i].addEventListener("click", editDog)
    }
})

let form = document.querySelector("#dog-form")
form.addEventListener("submit", waitToSubmitDog)

function waitToSubmitDog() {
    alert("Select a dog to edit first!")
} 

function editDog(e) {
    let rowCells = e.target.parentNode.parentNode.querySelectorAll("td")
    let id = e.target.parentNode.id
    let rowName = rowCells[0].innerText
    let rowBreed = rowCells[1].innerText
    let rowSex = rowCells[2].innerText

    form[0].value = rowName
    form[1].value = rowBreed
    form[2].value = rowSex

    form.removeEventListener("submit", waitToSubmitDog)
    form.addEventListener("submit", submitDog)

    function submitDog() {
        rowCells[0].innerText = form[0].value
        rowCells[1].innerText = form[1].value
        rowCells[2].innerText = form[2].value
        
        fetch(`http://localhost:3000/dogs/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({"name": rowCells[0].innerText, "breed": rowCells[1].innerText, "sex": rowCells[2].innerText})
        })
        .then(resp => resp.json())

        form.reset()
        form.removeEventListener("submit", submitDog)
        form.addEventListener("submit", waitToSubmitDog)
    }
}