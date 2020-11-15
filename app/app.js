import { FxAggregationGatewayClient, FxClient, FxEntities } from './api/profx.js'
import VpnCard from './views/Vpn.Document.Card.js'
import VpnWithAccordion from './views/VpnWithAccordion.Document.Card.js'

const fxClient = new FxClient("WS2019AG", "FINCAD", "procad", "procaf17")

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

const callback = async function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

const observer = new MutationObserver(async mutationRecordList => {

    for (const mutation of mutationRecordList) {
        if (mutation.type === 'childList') {
            console.log(mutation);

            let id = mutation.addedNodes[0].childNodes[1].getAttribute("id").split("-")[1]

            console.log(mutation.addedNodes[0].childNodes[1].getAttribute("id").split("-")[1])

            await fxClient.getEntityCollection({
                entity: "Document",
                whereFields: [{ name: "/3/0", value: id, dataType: "int"}],

            })
        }
    }
});


window.onload = async () => {

    console.log("window.onload ");

}

document.addEventListener('readystatechange', async event => {
    if (event.target.readyState === 'interactive') {
        console.log(event.target.readyState);
    }
    else if (event.target.readyState === 'complete') {

        console.log(event.target.readyState);


        let accordionOpenChecks = document.querySelectorAll(".check-opener")

        console.log(accordionOpenChecks);

        accordionOpenChecks.forEach(element => element.addEventListener("change", (event) => {
            console.log("clicked")
        }))
    }
});

async function display() {

    const dataContainer = document.getElementById("dataContainer")

    // Start observing the target node for configured mutations
    observer.observe(dataContainer, config);

    const vpns = await fxClient.getEntityCollection(
        {
            entity: "Document",
            whereFields: [{ name: "DocumentType", value: "/Document/Vpn/" }],
            // whereFields: [{ name: "/3/1", value: "/Document/Vpn/", dataType: "string" }],
            selectFields: [
                { name: "id", value: "Id", useGet: false },
                { name: "description", value: "/3/44", useGet: true },
                { name: "vpnUser", value: "/3/38/10", useGet: true },
                { name: "vpnPassword", value: "/3/38/11", useGet: true },
                { name: "vpnHost", value: "/3/38/60", useGet: true },
                { name: "domainUser", value: "/3/38/14", useGet: true },
                { name: "domainPassword", value: "/3/38/15", useGet: true },
                { name: "profileUser", value: "/3/38/16", useGet: true },
                { name: "profilePassword", value: "/3/38/17", useGet: true },
                { name: "customer", value: "/3/38/12", useGet: true }
            ]
        })

    vpns.forEach(async entity => {

        const div = document.createElement('div')

        div.innerHTML = new VpnWithAccordion(entity).getHtml()

        dataContainer.appendChild(div)

    })

}

//Reading in parallel
// async function printFiles() {
//     const files = await getFilePaths();

//     await Promise.all(files.map(async (file) => {
//         const contents = await fs.readFile(file, 'utf8')
//         console.log(contents)
//     }));
// }

// Reading in sequence
// async function printFiles() {
//     const files = await getFilePaths();

//     for (const file of files) {
//         const contents = await fs.readFile(file, 'utf8');
//         console.log(contents);
//     }
// }

document.addEventListener("DOMContentLoaded", async () => {

    console.log("DOMContentLoaded");

    await display()

    // await loadData()

    // let cardsButton = document.querySelectorAll(".card-btn")

    // console.log(cardsButton);

    // cardsButton.forEach(element => element.addEventListener("click", () => {
    //     const card = element.closest(".card").classList.toggle("change")
    // }))

    // document.querySelectorAll(".m-card-action-button").forEach(btn => btn.addEventListener("click", (e) => {

    //     btn.parentElement.childNodes.forEach(item => {

    //         if (item.classList?.contains("active")) {
    //             item.classList.remove("active")
    //         }
    //     })

    //     btn.classList.toggle("active")

    //     console.log(btn.classList[1])

    //     //

    //     const contentGroops = Array.from(Array.from(btn.closest(".m-card").childNodes).filter(element => element.classList?.contains("m-card-content"))[0].childNodes)

    //     contentGroops.forEach(contentGroop => {

    //         console.log(contentGroop.classList)

    //         if (contentGroop?.classList?.contains("active")) {
    //             contentGroop.classList.toggle("active")
    //         }

    //         if (contentGroop?.classList?.contains(btn.classList[1])) {
    //             contentGroop.classList.toggle("active")
    //         }
    //     })
    // }))
});

// async function loadData() {

//     const data = await FxAggregationGatewayClient.getDocumentsByType()

//     const dataContainer = document.getElementById("dataContainer")

//     data.forEach(proData => {

//         const div = document.createElement('div')

//         div.innerHTML = new VpnCard(proData).getHtml()

//         dataContainer.appendChild(div)
//     })

//     console.log(dataContainer);
// }

// const searchInput = document.getElementById('searchInput')

// searchInput.addEventListener('keyup', (e) => {

//     const list = Array.from(document.querySelectorAll('.searchable'))

//     list.filter(element => element.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) == -1)
//         .map(element => { return element.closest("div.card").id })
//         .filter((value, index, array) => array.indexOf(value) === index)
//         .forEach(id => document.getElementById(id).style.display = 'none')

//     const found = list.filter(element => element.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1)
//         .map(element => { return element.closest("div.card").id })
//         .filter((value, index, array) => array.indexOf(value) === index)
//         .forEach(id => document.getElementById(id).style.display = '')
// })

