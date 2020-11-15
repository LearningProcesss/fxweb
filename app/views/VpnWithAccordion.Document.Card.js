import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor({ id, customer, vpnUser, vpnPassword, vpnHost, domainUser, domainPassword, profileUser, profilePassword, structure }) {
        super();
        this.id = id
        this.customer = customer
        this.vpnHost = vpnHost
        this.vpnUser = vpnUser
        this.vpnPassword = vpnPassword
        this.domainUser = domainUser
        this.domainPassword = domainPassword
        this.profileUser = profileUser
        this.profilePassword = profilePassword
    }

    getHtml() {
        return `
        <div class="d-card" id="card-${this.id}">
        <div class="d-card-header">
            ${this.customer}
        </div>
        <div class="d-card-groops">
            <div class="d-card-groop">
                <div class="d-icon-wrapper vpn">
                    <i class="fas fa-lock"></i>
                </div>
                <div class="d-card-groop-content">
                    <h4>Vpn User</h4>
                    <p>${this.vpnUser}</p>
                    <h4>Vpn Password</h4>
                    <p>${this.vpnPassword}</p>
                    <h4>Vpn Host</h4>
                    <p>${this.vpnHost}</p>
                </div>
            </div>
            <div class="d-card-groop">
                <div class="d-icon-wrapper domain">
                    <i class="fas fa-laptop"></i>
                </div>
                <div class="d-card-groop-content">
                    <h4>Domain User</h4>
                    <p>${this.domainUser}</p>
                    <h4>Domain Password</h4>
                    <p>${this.domainPassword}</p>
                </div>
            </div>
            <div class="d-card-groop">
                <div class="d-icon-wrapper profile">
                    <i class="fab fa-product-hunt"></i>
                </div>
                <div class="d-card-groop-content">
                    <h4>PRO.FILE User</h4>
                    <p>${this.profileUser}</p>
                    <h4>PRO.FILE Password</h4>
                    <p>${this.profilePassword}</p>
                </div>
            </div>
            <div class="tabs">
                <div class="tab">
                    <input type="checkbox" class="check-opener" id="check${this.id}">
                    <label class="tab-label" for="check${this.id}">
                        <div class="d-icon-wrapper server">
                            <i class="fas fa-server"></i>
                        </div>
                        Servers
                    </label>
                    <div class="tab-content">
                        <div class="d-card-groop">
                            <div class="d-icon-wrapper server">
                                <i class="fas fa-server"></i>
                            </div>
                            <div class="d-card-groop-content">
                                <h4>Server name</h4>
                                <p>vpn della dropsa </p>
                                <h4>Domain</h4>
                                <p>vpn della dropsa </p>
                                <h4>User</h4>
                                <p>vpn della dropsa </p>
                                <h4>Password</h4>
                                <p>vpn della dropsa </p>
                                <h4>Ip</h4>
                                <p>vpn della dropsa </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `;
    }
}