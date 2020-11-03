export class VpnDto {

    constructor(name) {
        this.name = name
    }
    
    static fromJson(json) {
        return new this(json["/Document/docDescriptionUpdate"])
    }
}