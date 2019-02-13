
var keyBuffer = "";
var productScreenScrolled = false;

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

    loadingScreen = {
        screen: document.getElementById("loading_screen"),

        show: function() {
            this.screen.style.display = 'block';
        },
        
        hide: function() {
            this.screen.style.display = 'none';
        }
    }

    errorScreen = {
        screen: document.getElementById("error_screen"),
        errorLine: document.getElementById("error_msg"),
        errorPos: document.getElementById("error_pos"),

        showError: function(error) {
            var stacktrace = error.stack.split("\n");
            this.errorPos.innerHTML = stacktrace[1].match(":[0-9]*:[0-9]*") + " in " + stacktrace[1].match("[a-zA-z]*\.js");
            this.errorLine.innerHTML = error.name + ": " + error.message;
            this.stacktrace = stacktrace[1];
            this.screen.style.display = 'block';
        },

        hide: function() {
            this.screen.style.display = 'none';
            pages.showPage(pages.startPage);
        }
    }

    errorScreen.hide();
    loadingScreen.hide();
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

onCancelAddMoney = function() {
    pages.showPage(pages.mainPage);
}

onErrorScreenClick = function() {
    errorScreen.hide()
    pages.showPage(pages.startPage);
}

onProductMouseDown = function() {
    productScreenScrolled = false;
}

onProductMouseUp = function() {
    if(!productScreenScrolled) {
        onProductClicked();
    }
}

onProductMouseMove = function() {
    productScreenScrolled = true;
}

onProductClicked = function() {
    alert("cluck");
}

document.onkeypress = function(e) {
    if(e.keyCode != 13) {
        keyBuffer += String.fromCharCode(e.keyCode);
    } else {
        onEnterPressed(keyBuffer);
        keybuffer = "";
    }
}

