
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
    constructor(entity, data) {
        this.entity = entity
        this._data = data
    }

    getData() {
        return this._data
    }

    getQueryMethod() {
        return this._queryMethod
    }

    static factory(type, entity, data) {
        if (type == "LoadEntityQuery") {
            return new LoadEntityQuery(entity, data)
        } else if (type == "LoadEntityWithSelectedFields") {
            return new LoadEntityWithSelectedFields(entity, data)
        } else if (type == "ExecuteCollectionQuery") {
            return new ExecuteCollectionQuery(entity, data)
        }

        return undefined
    }
}

class LoadEntityQuery extends Query {

    /**
    * 
    * @param {string} entity 
    * @param {number} id 
    */
    constructor(entity, data) {
        super(entity, data)
        this._queryMethod = "LoadEntity"
        this._data = JSON.stringify([{ key: `urn:key:${this.entity}:${id}` }])
    }
}

class ExecuteCollectionQuery extends Query {

    /**
    * 
    * @param {string} entity 
    */
    constructor(entity, data) {
        super(entity)
        this._queryMethod = "ExecuteCollectionQuery"
        this._data = "[{\"collectionQuery\": \"(context) => context.Documents().Where(item => item.DocumentType == \\\"/Document/Vpn/\\\").Select(item => new { id = item.Id, description = item.Get<string>(\\\"/3/44\\\"), vpnUser = item.Get<string>(\\\"/3/38/10\\\"), vpnPassword = item.Get<string>(\\\"/3/38/11\\\"), domainUser = item.Get<string>(\\\"/3/38/14\\\"), domainPassword = item.Get<string>(\\\"/3/38/15\\\"), profileUser = item.Get<string>(\\\"/3/38/16\\\"), profilePassword = item.Get<string>(\\\"/3/38/17\\\") } )\"}]"
    }
}

class LoadEntityWithSelectedFields extends Query {
    /**
    * 
    * @param {string} entity 
    */
    constructor(entity, data) {
        super(entity)
        this._queryMethod = "LoadEntityWithSelectedFields"
        this._data = "[{\"collectionQuery\": \"(context) => context.Documents().Where(item => item.DocumentType == \\\"/Document/Vpn/\\\").Select(item => new { id = item.Id, description = item.Get<string>(\"/3/44\") } )\"}]"
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

    const service = new FxServiceBase(fxCore, Query.factory("ExecuteCollectionQuery", "Document", null))

    try {
        // const data = await service.fxFetch()

        const data = await service.sendRequest()

        console.log(data);

        return data[1]

    } catch (error) {
        console.log(error);
    }
}

const FxClient = {

    getDocumentsByType: async function (params) {

        const fxCore = new FxCore("WS2019AG", "FINCAD", "procad", "procaf17")

        const service = new FxServiceBase(fxCore, Query.factory("ExecuteCollectionQuery", "Document", null))

        try {
            const data = await service.sendRequest()

            console.log(data);

            return data[1]

        } catch (error) {
            console.log(error);
        }
    }
}



export {
    FxClient
}