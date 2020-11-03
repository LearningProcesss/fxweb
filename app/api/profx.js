
function fx() {
    this.url = "http://localhost:3001/http://WS2019AG/Procad/Profile/AppServer/rest/FINCAD/secure/Procad.ProfileNT.Services.MobilityService.IMobilityService"
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
    this.fx = new fx()
    this.url = `${this.fx.url}/LoadEntity`
}

function fxServiceScalarQuery() {
    this.fx = new fx()
    this.url = `${this.fx.url}/ExecuteScalarQuery`
}

function fxServiceCollectionQuery() {
    this.fx = new fx()
    this.url = `${this.fx.url}/ExecuteCollectionQuery` ///ExecuteCollectionQuery
}

fxServiceLoadEntity.prototype.fxFetch = async function () {

    let response

    try {
        response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${this.fx.user}:${this.fx.password}`)
            },
            body: JSON.stringify([
                {
                    key: "urn:key:Document:19541"
                }
            ])
        })

        return await response.json()
    } catch (error) {
        console.log(error);
    }

    return null
}

fxServiceCollectionQuery.prototype.fxFetch = async function () {

    let response

    var raw = "[{\"collectionQuery\": \"(context) => context.Documents().Where(item => item.DocumentType == \\\"/Document/Vpn/\\\").Select(item => item.ToDictionary(FieldValueFilter.ExcludeDefault))\"}]";

    try {
        response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${this.fx.user}:${this.fx.password}`)
            },
            body: raw
        })

        return await response.json()
    } catch (error) {
        console.log(error);
    }


    return null
}

class FxCore {
    /**
     * 
     * @param {string} server 
     * @param {string} tenant 
     * @param {string} user 
     * @param {string} password 
     */
    constructor(server, tenant, user, password) {
        this.url = `http://localhost:3001/http://${server}/Procad/Profile/AppServer/rest/${tenant}/secure/Procad.ProfileNT.Services.MobilityService.IMobilityService`
        this.user = user
        this.password = password
    }
}

const entities = {
    DOCUMENT: 'Document',
    PART: 'Part',
    PROJECT: 'Project'
}

class Query {
    /** @type {(string|Array|Object)} */
    _data

    /** @type {(string)} */
    _queryMethod
    /**
     * 
     * @param {string} entity 
     */
    constructor(entity) {
        this.entity = entity
    }

    getData() {
        return this._data
    }

    getQueryMethod() {
        return this._queryMethod
    }
}

class LoadEntityQuery extends Query {

    /**
    * 
    * @param {string} entity 
    * @param {number} id 
    */
    constructor(entity, id) {
        super(entity)
        this._queryMethod = "LoadEntity"
        this._data = JSON.stringify([{ key: `urn:key:${this.entity}:${id}` }])
    }
}

class ExecuteCollectionQuery extends Query {

    /**
    * 
    * @param {string} entity 
    */
    constructor(entity) {
        super(entity)
        this._queryMethod = "ExecuteCollectionQuery"
        this._data = "[{\"collectionQuery\": \"(context) => context.Documents().Where(item => item.DocumentType == \\\"/Document/Vpn/\\\").Select(item => item.ToDictionary(FieldValueFilter.ExcludeDefault))\"}]"
    }
}

class FxServiceBase {

    /**
     * @type {RequestInit}
     */
    request

    /**
     * 
     * @param {FxCore} fxCore 
     * @param {Query} query 
     */
    constructor(fxCore, query) {

        this.fxCore = fxCore
        this.query = query
        this.url = `${this.fxCore.url}/${query.getQueryMethod()}`
        this.request = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${this.fxCore.user}:${this.fxCore.password}`)
            }
        }

        // if (this.constructor === FxServiceBase) {
        //     throw new Error("Can't instantiate abstract class!");
        // }
    }

    /** 
     * @param {string} endpoint 
     */
    setUrl(endpoint) {
        this.url = `${this.fxCore.url}/${endpoint}`
    }

    async sendRequest(data) {
        // throw new Error("Abstract method!");

        this.request.body = this.query.getData()

        const response = await fetch(this.url, this.request)

        return await response.json()
    }
}

class FxServiceLoadEntity extends FxServiceBase {
    constructor(fxCore) {
        super(fxCore)
        this.setUrl("LoadEntity")
    }

    async sendRequest(data) {
        this.request.body = JSON.stringify(data)
        await fetch(this.url, this.request)
    }
}

/**
 * 
 * @param {*} params 
 * @returns {Array}
 */
async function getDocumentsByType(params) {

    const fxCore = new FxCore("WS2019AG", "FINCAD", "procad", "procaf17")

    // const service = new fxServiceCollectionQuery()

    const service = new FxServiceBase(fxCore, new ExecuteCollectionQuery("Document"))

    try {
        // const data = await service.fxFetch()

        const data = await service.sendRequest()

        console.log(data);

        return data[1]

    } catch (error) {
        console.log(error);
    }
}

export {
    getDocumentsByType
}