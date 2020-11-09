import AbstractView from "./AbstractView.js";
import VpnCard from './Vpn.Document.Card.js'

export default class extends AbstractView {
    /**
     * 
     * @param {Array} data 
     */
    constructor(data) {
        super();
        this.data = data
    }

    getHtml() {
        return `
            <div class="">
            ${
                this.data.map(item => {
                    return new VpnCard(item).getHtml()
                })
            }
            </div>
        `;
    }
}