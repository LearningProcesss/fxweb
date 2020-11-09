export class VpnDto {

    constructor(name, vpnUser) {
        this.name = name
        this.vpnUser = vpnUser
    }
    
    static fromJson(json) {
        // return new this(json["/Document/docDescriptionUpdate"])
        return new this(json["description"], json["vpnUser"])
    }
}