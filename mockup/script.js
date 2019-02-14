
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
            this.screen.style.display = 'block';
        },

        showErrorEvent: function(errorEvent) {
            this.errorPos.innerHTML = ":" + errorEvent.lineno + ":" + errorEvent.colno + " in " + errorEvent.filename;
            this.errorLine.innerHTML = errorEvent.type + ": " + errorEvent.message;
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
            var product = {id: id, name: name, imageUrl: imageUrl, price: price};
            this.productList.push(product);

            var productHtml = `
                <div id="product_${id}" class="product">
                    <img class="product_image" src="${imageUrl}">
                    <h1>${name}</h1>
                    <h2>${parseFloat(price).toFixed(2)}€</h2>
                    <button class="ripple" onmousedown="onProductMouseDown()" onmouseup="onProductMouseUp(${id})" onmousemove="onProductMouseMove()"></button>
                    <div class="bobel">
                        <img src="img/beobel.png">
                        <div class="product_count">0</div>
                    </div>
                    <div class="product_remove_button" onmousedown="onProductMouseDown()" onmousemove="onProductMouseMove()" onmouseup="onDeleteProductMouseUp(${id})">
                        <img src="img/trash.png">
                    </div>
                </div>
            `;

            if(this.topRow.childElementCount > this.bottomRow.childElementCount) {
                this.bottomRow.innerHTML += productHtml;
            } else {
                this.topRow.innerHTML += productHtml;
            }
        },

        clear: function() {
            this.productList = [];
            this.topRow.innerHTML = '';
            this.bottomRow.innerHTML = '';
        },

        getProductById: function(id) {
            for(i = 0; i < this.productList.length; i++) {
                if(this.productList[i].id == id) {
                    return this.productList[i];
                }
            }
            throw "Product id " + id + " not found";
        }
    }

    session = {
        stagedProducts: [],

        addProduct: function(product) {
            productAlreadyStaged = false;
            for(i = 0; i < this.stagedProducts.length; i++) {
                if(product.id == this.stagedProducts[i].product.id) {
                    this.stagedProducts[i].count++;
                    productAlreadyStaged = true;
                }
            }
            if(!productAlreadyStaged) {
                this.stagedProducts.push({count: 1, product: product});
            }
        },

        getProductCount: function(product) {
            for(i = 0; i < this.stagedProducts.length; i++) {
                if(product.id == this.stagedProducts[i].product.id) {
                    return this.stagedProducts[i].count;
                }
            }
            return 0;
        },

        clear: function() {
            this.stagedProducts = [];
        }
    }

    errorScreen.hide();
    window.addEventListener('error', function(errorEvent) {
        errorScreen.showErrorEvent(errorEvent);
    });
    loadingScreen.hide();
    pages.showPage(pages.startPage);

    // THIS IS MOCKUP CODE AND NEEDS TO BE REMOVED WHEN IN PRODUCTION
    products.addProduct(0, "Club Mate", "img/flasche.png", 0.70);
    products.addProduct(1, "Club Mate Ice Tea", "img/flasche.png", 0.70);
    products.addProduct(2, "Club Mate Grannat", "img/flasche.png", 0.70);
    products.addProduct(3, "Club Mate Cola", "img/flasche.png", 0.60);
    products.addProduct(4, "Club Mate Winter", "img/flasche.png", 0.70);
    products.addProduct(5, "Wasser", "img/flasche.png", 0.50);
    products.addProduct(6, "Snickers", "img/flasche.png", 0.20);
    products.addProduct(7, "Mars", "img/flasche.png", 0.20);
    products.addProduct(8, "Caffee", "img/flasche.png", 0.20);
    products.addProduct(9, "Cola Orange", "img/flasche.png", 0.60);
    products.addProduct(10, "Limo", "img/flasche.png", 0.60);
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
    session.clear();
}

onProductMouseDown = function() {
    productScreenScrolled = false;
}

onProductMouseMove = function() {
    productScreenScrolled = true;
}

onProductMouseUp = function(id) {
    if(!productScreenScrolled) {
        onProductClicked(products.getProductById(id),
        document.getElementById("product_" + id));
    }
}

onDeleteProductMouseUp = function(id) {
    if(!productScreenScrolled) {
        onProductClicked(products.getProductById(id),
        document.getElementById("product_" + id));
    }
}

onProductClicked = function(product, productCard) {
    bobel = productCard.getElementsByClassName("bobel")[0];
    bobelText = productCard.getElementsByClassName("product_count")[0];
    removeButton = productCard.getElementsByClassName("product_remove_button")[0];

    session.addProduct(product);

    bobelText.innerHTML = session.getProductCount(product);
    bobel.style.display = 'block';
    bobelText.style.display = 'block';
    removeButton.style.display = 'block';
}

onDeleteProductClicked = function(product, productCard) {
    alert("delete");
}

document.onkeypress = function(e) {
    if(e.keyCode != 13) {
        keyBuffer += String.fromCharCode(e.keyCode);
    } else {
        onEnterPressed(keyBuffer);
        keybuffer = "";
    }
}