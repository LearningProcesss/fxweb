function fx() {
    this.url = "http://localhost:3000/proxy/http://WS2019AG/Procad/Profile/AppServer/rest/FINCAD/secure/Procad.ProfileNT.Services.MobilityService.IMobilityService"
    this.user = "procad"
    this.password = "procaf17"
}

function fxServiceBase() {
    this.fx = new fx()
}

fxServiceBase.prototype.fxFetch = async function (params) {
    const response = await fetch(params)
    return await response.json()
}

function fxServiceLoadEntity() {

}

function fxServiceScalarQuery() {
    this.fx = new fx()
    this.url = `${this.fx.url}/ExecuteScalarQuery`
}

function fxServiceCollectionQuery() {
    this.fx = new fx()
    this.url = `${this.fx.url}/ExecuteCollectionQuery`
}

fxServiceCollectionQuery.prototype.fxFetch = async function () {

    let response

    try {
        response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${this.fx.user}:${this.fx.password}`)
            },
            body: JSON.stringify('[{"collectionQuery": "(context) => context.Documents().Where(item => item.DocumentType == \"/Document/Vpn/\").Select(item => item.ToDictionary(FieldValueFilter.ExcludeDefault))"}]')
        })

        return await response.json()
    } catch (error) {
        console.log(error);
    }

    
    return null    
}

// class baseFxService {
//     constructor() {
//         this.fx = new fx()
//     }


// }

async function getDocumentsByType(params) {

    const collectionService = new fxServiceCollectionQuery()

    try {
        const data = await collectionService.fxFetch()

    } catch (error) {
        console.log(error);
    }

    console.log(data);
}