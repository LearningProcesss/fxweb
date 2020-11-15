
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
     * @type {(FxServiceBase)}
     */
    #service
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

    get fxService() {
        return this.#service
    }
}

// TODO: reseved properties .Where(item => item.DocumentType == "")
class IDocument {
    Q_DocumentType
    ArchivedOn 
    DeletedBy 
    DeletedOn 
    CD_Status 
    CD_ID 
    CD_List 
    CD_Version 
    Client 
    DocumentTypeId 
    ArchivedBy 
    DocumentType
    Q_ArchivedOn 
    Q_DeletedBy 
    Q_DeletedOn 
    Q_CD_Status 
    Q_CD_ID 
    Q_CD_List 
    Q_CD_Version 
    Q_Client 
    Q_DocumentTypeId 
    Q_ArchivedBy 
    NDF_Extension 
}

const FxNetType = {
    int: 'int'
}

export class QField {

    /**
     * 
     * @param {string} name 
     * @param {string} value 
     * @param {boolean} useGet 
     * @param {string} dataType 
     */
    constructor(name, value, useGet, dataType) {
        this.name = name
        this.value = value
        this.useGet = useGet
        this.dataType = dataType
    }
}

class Payloads {
    /**
     * 
     * @param {string} wherePayload 
     * @param {string} selectPayload 
     * @param {string} selectManyPayload 
     * @param {string} orderPayload 
     */
    constructor(wherePayload, filterPayload, selectPayload, selectManyPayload, orderPayload) {
        this.wherePayload = wherePayload
        this.filterPayload = filterPayload
        this.selectPayload = selectPayload
        this.selectManyPayload = selectManyPayload
        this.orderPayload = orderPayload
    }
}

class Q {

    /** @type {(string)} */
    #query

    /**
     * 
     * @param {string} service 
     * @param {*} entityDefinition 
     * @param {Payloads} payloads 
     */
    constructor(service, entityDefinition, payloads) {
        this.service = service
        this.entityDefinition = entityDefinition
        this.payloads = payloads
        this.buildQuery()
    }

    buildQuery() {
        if (this.service == "LoadEntity") {
            this.#query = `[{ \"key\": \"urn:key:${this.entityDefinition.baseName}:${0}\" }]`
        } else if (this.service == "ExecuteScalarQuery") {
            this.#query = `[{ \"scalarQuery\": \"(context).${this.entityDefinition.entityPluralMethod}\" }]`
        } else if (this.service == "ExecuteCollectionQuery") {
            this.#query = `[{ \"collectionQuery\": \"(context) => context.${this.entityDefinition.entityPluralMethod}${this.payloads.wherePayload}${this.payloads.filterPayload}${this.payloads.selectManyPayload}${this.payloads.selectPayload}${this.payloads.orderPayload}\" }]`
        } else if (this.service == "LoadEntityWithSelectedFields") {
            this.#query = `[{ \"key\": \"urn:key:Document:${this.id}\", \"selectedFields\": [] }]`
        }
    }

    get getQuery() {
        return this.#query
    }
}

class QBuilder {

    /**
    * @type {Payloads}
    */
    #queryDefinition = {
        wherePayload: '',
        filterPayload: '',
        selectPayload: '',
        selectManyPayload: '',
        orderPayload: ''
    }

    constructor() {

    }

    /**
     * 
     * @param {string} service
     */
    ofService(service) {
        this.service = service
        return this
    }

    /**
     * 
     * @param {string} entity 
     */
    ofEntity(entity) {
        this.entityDefinition = {
            baseName: entity,
            entityPlural: `${entity}s`,
            entityPluralMethod: `${entity}s()`
        }
        return this
    }

    /**
     * 
     * @param {Array.<QField>} whereFields 
     */
    withWhere(whereFields) {

        if (!whereFields) { return this }

        // TODO: handle reserved item properties es: item => item.Id , item.DocumentType
        // TODO: handle multiple where condition es: item => item.Get<string>("/Document/Type") == "" && ...

        // const whereComputed = whereFields.map(field => `item.${field.name} == \\\"${field.value}\\\"`).toString()

        const whereComputed = whereFields.map(field => `item.Get<${field.dataType}>.(\\\"${field.name}\\\") == ${field.dataType == "string" ? `\\\"${field.value}\\\"` : field.value } `).toString()

        console.log(whereComputed)

        this.#queryDefinition.wherePayload = `.Where(item => ${whereComputed})`

        return this
    }

    /**
     * 
     * @param {Array.<QField>} filterFields 
     */
    withFilters(filterFields) {

        if (!filterFields) { return this }

        const filterComputed = filterFields.map(field => `{ \\\"${field.name}\\\", \\\"${field.value}\\\"}`).toString()

        console.log(filterComputed);

        this.#queryDefinition.filterPayload = `.WithFilterOption(new FieldValues {${filterComputed}})`

        return this
    }

    /**
     * 
     * @param {Array.<QField>} selectFields 
     */
    withSelect(selectFields) {

        if (!selectFields) { return this }

        const selectComputed = selectFields.map(field => `${field.name} = ${field.useGet ? `item.Get<string>(\\\"${field.value}\\\")` : `item.${field.value}`} `).toString()

        this.#queryDefinition.selectPayload = `.Select(item => new { ${selectComputed} })`

        return this
    }

    /**
     * 
     * @param {string} entity 
     */
    withStructure(entity) {

        if (!entity) { return this }

        this.#queryDefinition.selectManyPayload = `.SelectMany(item => item.Children<I${entity}>())`

        return this
    }

    /**
     * 
     * @param {QField} field 
     */
    withOrder(field) {

        if (!field) { return this }

        this.#queryDefinition.orderPayload = `.OrderBy(item => item.${field.name})`

        return this
    }

    build() {
        return new Q(this.service, this.entityDefinition, this.#queryDefinition)
    }
}

class QBuilderFactory {

    /**
     * 
     * @param {string} entity 
     * @param {QField[]} whereFields 
     * @param {QField[]} selectFields 
     * @param {string} orderField 
     */
    static create(entity, whereFields, selectFields, orderField, structureEntity) {
        let qBuilder = new QBuilder()

        qBuilder = qBuilder.ofEntity(entity)


    }
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

class ExecuteCollectionQueryBase extends Query {
    constructor() {

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

    async send() {

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

const FxAggregationGatewayClient = {

    /**
     * 
     * @param {boolean} withChilds 
     */
    getDocumentsByType: async function (withChilds) {

        const fxCore = new FxCore("WS2019AG", "FINCAD", "procad", "procaf17")

        // const service = new FxServiceBase(fxCore, Query.factory("ExecuteCollectionQuery", "Document", null))

        // let entities = []

        // try {
        //     const data = await service.sendRequest()

        //     console.log(data);

        //     if (!withChilds) {
        //         entities = data[1]
        //     } else {
        //         data[1].forEach(entity => {

        //         })
        //     }



        // } catch (error) {
        //     console.log(error);
        // }
    },
    /**
     * 
     * @param {number} id 
     */
    getDocumentChilds: async function (id) {

    }
}

// TODO e con I ROCO?
export const FxEntities = {
    DOCUMENT: 'Document'
}

export class FxClient {
    /** @type {(string)} */
    #url
    /** @type {(string)} */
    #server
    /** @type {(string)} */
    #tenant
    /** @type {(string)} */
    #username
    /** @type {(string)} */
    #password

    /**
     * 
     * @param {string} server 
     * @param {string} tenant 
     * @param {string} username 
     * @param {string} password 
     */
    constructor(server, tenant, username, password) {
        this.#server = server
        this.#tenant = tenant
        this.#username = username
        this.#password = password
        this.url = `http://localhost:3001/http://${server}/Procad/Profile/AppServer/rest/${tenant}/secure/Procad.ProfileNT.Services.MobilityService.IMobilityService`
    }

    /**
     * 
     * @param {string} service 
     * @param {string} query 
     */
    async fxFetch(service, query) {

        // const request = new Request(`${this.url}/${service}`, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Basic ' + btoa(`${this.#username}:${this.#password}`)
        //     },
        //     body: query
        // })

        return await fetch(`${this.url}/${service}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${this.#username}:${this.#password}`)
            },
            body: query
        })
    }

    /**
     * @param {{entity: string, whereFields: QField[], filterFields: QField[], selectFields: QField[], structureEntity: string, orderField: string}}
    */
    async getEntityCollection({ entity, whereFields, filterFields, selectFields, structureEntity, orderField }) {
        const query = new QBuilder()
            .ofService("ExecuteCollectionQuery")
            .ofEntity(entity)
            .withWhere(whereFields)
            .withFilters(filterFields)
            .withStructure(structureEntity)
            .withSelect(selectFields)
            .build()

        let entities = []

        console.log(query.getQuery);

        try {

            const response = await this.fxFetch("ExecuteCollectionQuery", query.getQuery)

            const json = await response.json()

            entities = json[1]

            console.log(entities);

            // .sort((previous, successor) => {
            //     var previousCustomer = previous.customer.toUpperCase()

            //     var successorCustomer = successor.customer.toUpperCase()

            //     if (previousCustomer < successorCustomer) { return -1 }

            //     if (previousCustomer > successorCustomer) { return 1 }

            //     return 0
            // })

        } catch (error) {

        }

        return entities
    }
}



export {
    FxAggregationGatewayClient
}