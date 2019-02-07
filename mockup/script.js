
var keyBuffer = "";
window.onload = function() {
    pages = {
        startPage: document.getElementById("start_page"),
        mainPage: document.getElementById("main_page"),
        addMoneyPage: document.getElementById("add_money_page"),
        thankYouPage: document.getElementById("thank_you_page"),
    
        hideAllPages: function() {
            this.startPage.style.display = 'none';
            this.mainPage.style.display = 'none';
            this.addMoneyPage.style.display = 'none';
            this.thankYouPage.style.display = 'none';
        },
    
        showPage: function(page) {
            this.hideAllPages();
            page.style.display = 'block';
        }
    };

    pages.showPage(pages.startPage);
}

onEnterPressed = function(inputString) {
    pages.showPage(pages.mainPage);
}

onLogoutButton = function() {
    pages.showPage(pages.startPage);
}

onBuyButton = function() {
    pages.showPage(pages.thankYouPage);
}

onAddMoneyButton = function() {
    pages.showPage(pages.addMoneyPage);
}

document.onkeypress = function(e) {
    if(e.keyCode != 13) {
        keyBuffer += String.fromCharCode(e.keyCode);
    } else {
        onEnterPressed(keyBuffer);
        keybuffer = "";
    }
}

