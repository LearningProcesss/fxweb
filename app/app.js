window.onload = async () => {

    const dataContainer = document.getElementById("dataContainer")

    console.log(dataContainer);

   await loadData()

    setTimeout(() => {

    }, 2000)
}

async function loadData() {

    await getDocumentsByType()

}