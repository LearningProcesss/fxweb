window.onload = async () => {



    await loadData()

    setTimeout(() => {

    }, 2000)
}

async function loadData() {

    const data = await getDocumentsByType()

    const dataContainer = document.getElementById("dataContainer")

    data.forEach(proData => {
        const card = document.createElement("div")

        card.setAttribute("class", "card")

        const cardHeader = document.createElement("header")

        cardHeader.setAttribute("class", "card-header")

        const text = document.createTextNode(proData["/Document/docDescriptionUpdate"])

        cardHeader.appendChild(text)

        card.appendChild(cardHeader)
    })



    console.log(dataContainer);
}