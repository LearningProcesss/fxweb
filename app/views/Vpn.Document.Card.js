import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor({ name }) {
        super();
        this.name = name
        // console.log("vpn component", name);
    }

    // async getHtml() {
    //     return `
    //         <h1>Post</h1>
    //         <p>You are viewing post #${this.postId}.</p>
    //     `;
    // }

    getHtml() {
        return `
            <div class="card">
                <header class="card-header">
                    ${this.name}
                </header>
            <div class="card-header-sub">
                <p>Data</p>
            </div>
            <div class="card-content">
                <div class="card-content-groop vpn">
                    <div class="icon-wrapper">
                        <i class="fas fa-lock"></i>
                    </div>
                    <div class="details">
                        <h4>Vpn User</h4>
                        <p>janebrown@gmail.com</p>
                        <h4>Vpn Password</h4>
                        <p>janebrown@gmail.com</p>
                        <h4>Vpn Host</h4>
                        <p>janebrown@gmail.com</p>
                    </div>
                </div>
                <div class="card-content-groop domain">
                    <div class="icon-wrapper">
                        <i class="fas fa-address-card"></i>
                    </div>
                    <div class="details">
                        <h4>Domain User</h4>
                        <p>janebrown@gmail.com</p>
                        <h4>Domain Password</h4>
                        <p>janebrown@gmail.com</p>
                    </div>
                </div>
                <div class="card-content-groop profile">
                    <div class="icon-wrapper">
                        <i class="fas fa-user-lock"></i>
                    </div>
                    <div class="details">
                        <h4>Profile User</h4>
                        <p>janebrown@gmail.com</p>
                        <h4>Profile Password</h4>
                        <p>janebrown@gmail.com</p>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <p>Open</p>
            </div>
            </div>
        `;
    }
}