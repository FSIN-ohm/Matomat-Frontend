
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

    products = {
        productList: [],
        topRow: document.getElementById("top_row"),
        bottomRow: document.getElementById("bottom_row"),

        addProduct: function(id, name, imageUrl, price) {
            var productHtml = `
                <div class="product">
                    <img class="product_image" src="${imageUrl}">
                    <h1>${name}</h1>
                    <h2>${parseFloat(price).toFixed(2)}€</h2>
                    <button class="ripple" onmousedown="onProductMouseDown()" onmouseup="onProductMouseUp()" onmousemove="onProductMouseMove()"></button>
                    <div class="bobel">
                        <img src="img/beobel.png">
                        <div class="product_count">0</div>
                    </div>
                    <div class="product_remove_button">
                        <img src="img/trash.png">
                    </div>
                </div>
            `;

            if(this.topRow.childElementCount > this.bottomRow.childElementCount) {
                this.bottomRow.innerHTML += productHtml;
            } else {
                this.topRow.innerHTML += productHtml;
            }
        }
    }

    errorScreen.hide();
    loadingScreen.hide();
    pages.showPage(pages.startPage);

    // THIS IS MOCKUP CODE AND NEEDS TO BE REMOVED WHEN IN PRODUCTION
    products.addProduct(0, "Club Mate", "img/flasche.png", 0.70);
    products.addProduct(0, "Club Mate Ice Tea", "img/flasche.png", 0.70);
    products.addProduct(0, "Club Mate Grannat", "img/flasche.png", 0.70);
    products.addProduct(0, "Club Mate Cola", "img/flasche.png", 0.60);
    products.addProduct(0, "Club Mate Winter", "img/flasche.png", 0.70);
    products.addProduct(0, "Wasser", "img/flasche.png", 0.50);
    products.addProduct(0, "Snickers", "img/flasche.png", 0.20);
    products.addProduct(0, "Mars", "img/flasche.png", 0.20);
    products.addProduct(0, "Caffee", "img/flasche.png", 0.20);
    products.addProduct(0, "Cola Orange", "img/flasche.png", 0.60);
    products.addProduct(0, "Limo", "img/flasche.png", 0.60);
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

