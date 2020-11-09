import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor({ id, description, vpnUser, vpnPassword, vpnHost, domainUser, domainPassword, profileUser, profilePassword }) {
        super();
        this.id = id
        this.description = description
        this.vpnUser = vpnUser
        this.vpnPassword = vpnPassword
        this.domainUser = domainUser
        this.domainPassword = domainPassword
        this.profileUser = profileUser
        this.profilePassword = profilePassword
    }

    getHtml() {
        return `
            <div id="${this.id}" class="card">
                <div class="card-header searchable">
                    ${this.description}
                    <button class="card-btn">
                        <span class="card-btn-contact">Data</span>
                        <i class="fas fa-angle-up"></i>
                    </button>
                </div>
                <div class="card-header-sub">
                    <p>data</p>
                 </div>
                <div class="card-content">
                    <div class="card-content-groop vpn">
                        <div class="icon-wrapper">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div class="details">
                            <h4>Vpn User</h4>
                            <p class="searchable">${this.vpnUser}</p>
                            <h4>Vpn Password</h4>
                            <p class="searchable">${this.vpnPassword}</p>
                            <h4>Vpn Host</h4>
                            <p class="searchable">janebrown@gmail.com</p>
                        </div>
                    </div>
                <div class="card-content-groop domain">
                    <div class="icon-wrapper">
                        <i class="fas fa-address-card"></i>
                    </div>
                    <div class="details">
                        <h4>Domain User</h4>
                        <p class="searchable">${this.domainUser}</p>
                        <h4>Domain Password</h4>
                        <p class="searchable">${this.domainPassword}</p>
                    </div>
                </div>
                <div class="card-content-groop profile">
                    <div class="icon-wrapper">
                        <i class="fas fa-user-lock"></i>
                    </div>
                    <div class="details">
                        <h4>Profile User</h4>
                        <p class="searchable">${this.profileUser}</p>
                        <h4>Profile Password</h4>
                        <p class="searchable">${this.profilePassword}</p>
                    </div>
                </div>
            </div>
            
            </div>
        `;
    }
}