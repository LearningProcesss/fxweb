import { getDocumentsByType } from './api/profx.js'
import { VpnDto } from './dto/Vpn.dto.js';
import Vpn from './views/Vpn.Document.Card.js'


window.onload = async () => {

    console.log("window.onload ");

    await loadData()
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");

});

async function loadData() {

    const data = await getDocumentsByType()

    const dataContainer = document.getElementById("dataContainer")

    data.forEach(proData => {

        // console.log(VpnDto.fromJson(proData));

        const div = document.createElement('div')

        div.innerHTML = new Vpn(VpnDto.fromJson(proData)).getHtml()

        dataContainer.appendChild(div)



        // const card = document.createElement("div")

        // card.setAttribute("class", "card")

        // const cardHeader = document.createElement("header")

        // cardHeader.setAttribute("class", "card-header")

        // const text = document.createTextNode(proData["/Document/docDescriptionUpdate"])

        // cardHeader.appendChild(text)

        // card.appendChild(cardHeader)

        // const subHeader = document.createElement("div")

        // subHeader.setAttribute("class", "card-header-sub")

        // const subHeaderP = document.createElement("p")

        // const subHeaderPText = document.createTextNode("Data")

        // subHeaderP.appendChild(subHeaderPText)

        // subHeader.appendChild(subHeaderP)
    })

    console.log(dataContainer);
}