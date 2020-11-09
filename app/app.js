import { FxClient } from './api/profx.js'
import VpnCard from './views/Vpn.Document.Card.js'

window.onload = async () => {

    console.log("window.onload ");

}

document.addEventListener("DOMContentLoaded", async () => {

    console.log("DOMContentLoaded");

    // await loadData()

    let cardsButton = document.querySelectorAll(".card-btn")

    console.log(cardsButton);

    cardsButton.forEach(element => element.addEventListener("click", () => {
        const card = element.closest(".card").classList.toggle("change")
    }))

    document.querySelectorAll(".m-card-action-button").forEach(btn => btn.addEventListener("click", (e) => {

        btn.parentElement.childNodes.forEach(item => {

            if (item.classList?.contains("active")) {
                item.classList.remove("active")
            }
        })

        btn.classList.toggle("active")

        console.log(btn.classList[1])

        //

        const contentGroops = Array.from(Array.from(btn.closest(".m-card").childNodes).filter(element => element.classList?.contains("m-card-content"))[0].childNodes)

        contentGroops.forEach(contentGroop => {

            console.log(contentGroop.classList)

            if (contentGroop?.classList?.contains("active")) {
                contentGroop.classList.toggle("active")
            }

            if (contentGroop?.classList?.contains(btn.classList[1])) {
                contentGroop.classList.toggle("active")
            }
        })



    }))
});

async function loadData() {

    const data = await FxClient.getDocumentsByType()

    const dataContainer = document.getElementById("dataContainer")

    data.forEach(proData => {

        const div = document.createElement('div')

        div.innerHTML = new VpnCard(proData).getHtml()

        dataContainer.appendChild(div)
    })

    console.log(dataContainer);
}

const searchInput = document.getElementById('searchInput')

searchInput.addEventListener('keyup', (e) => {

    const list = Array.from(document.querySelectorAll('.searchable'))

    list.filter(element => element.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) == -1)
        .map(element => { return element.closest("div.card").id })
        .filter((value, index, array) => array.indexOf(value) === index)
        .forEach(id => document.getElementById(id).style.display = 'none')

    const found = list.filter(element => element.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
        .map(element => { return element.closest("div.card").id })
        .filter((value, index, array) => array.indexOf(value) === index)
        .forEach(id => document.getElementById(id).style.display = '')
})

