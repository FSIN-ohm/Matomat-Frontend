
var keyBuffer = "";
var productScreenScrolled = false;

var server = 'http://127.0.0.1:5000';

GIPHY_API_KEY = "X9m2ukRMWcyp7lh7YjCe4SHFU365BXWY";

window.onload = function () {

    thankYouGif = document.getElementById("thank_you_gif");

    pages = {
        startPage: document.getElementById("start_page"),
        mainPage: document.getElementById("main_page"),
        addMoneyPage: document.getElementById("add_money_page"),
        thankYouPage: document.getElementById("thank_you_page"),
        registrationPage: document.getElementById("registration_page"),

        hideAllPages: function () {
            var pages = document.getElementsByClassName("page");
            for (i = 0; i < pages.length; i++) {
                pages[i].style.display = 'none';
            }
        },

        showPage: function (page) {
            this.hideAllPages();
            page.style.display = 'block';
        }
    };

    loadingScreen = {
        screen: document.getElementById("loading_screen"),

        show: function () {
            this.screen.style.display = 'block';
        },

        hide: function () {
            this.screen.style.display = 'none';
        }
    }

    errorScreen = {
        screen: document.getElementById("error_screen"),
        errorLine: document.getElementById("error_msg"),
        errorPos: document.getElementById("error_pos"),


        showError: function (error) {
            var stacktrace = error.stack.split("\n");
            this.errorPos.innerHTML = stacktrace[1].match(":[0-9]*:[0-9]*") + " in " + stacktrace[1].match("[a-zA-z]*\.js");
            this.errorLine.innerHTML = error.name + ": " + error.message;
            this.screen.style.display = 'block';
        },

        showErrorEvent: function (errorEvent) {
            this.errorPos.innerHTML = ":" + errorEvent.lineno + ":" + errorEvent.colno + " in " + errorEvent.filename;
            this.errorLine.innerHTML = errorEvent.type + ": " + errorEvent.message;
            this.screen.style.display = 'block';
        },

        hide: function () {
            this.screen.style.display = 'none';
            pages.showPage(pages.startPage);
        }
    }

    products = {
        productList: [],
        topRow: document.getElementById("top_row"),
        bottomRow: document.getElementById("bottom_row"),

        addProduct: function (id, name, imageUrl, price) {
            price = price / 100;
            var product = { id: id, name: name, imageUrl: imageUrl, price: price };
            this.productList.push(product);

            var productHtml = `
                <div id="product_${id}" class="product">
                    <img class="product_image" src="${imageUrl}">
                    <h1>${name}</h1>
                    <h2>${parseFloat(price).toFixed(2).replace(".", ",")}€</h2>
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

            if (this.topRow.childElementCount > this.bottomRow.childElementCount) {
                this.bottomRow.innerHTML += productHtml;
            } else {
                this.topRow.innerHTML += productHtml;
            }
        },

        clear: function () {
            this.productList = [];
            this.topRow.innerHTML = '';
            this.bottomRow.innerHTML = '';
        },

        getProductById: function (id) {
            for (i = 0; i < this.productList.length; i++) {
                if (this.productList[i].id == id) {
                    return this.productList[i];
                }
            }
            throw "Product id " + id + " not found";
        }
    }

    session = {
        userHash: "",
        userId: -1,
        balance: -1,
        notch: document.getElementById("notch"),
        balanceTag: document.getElementById("balance"),
        stagedProducts: [],
        isRegistration: false,

        addDeleteProduct: function (product, deleted) {
            productAlreadyStaged = false;
            for (i = 0; i < this.stagedProducts.length; i++) {
                if (product.id == this.stagedProducts[i].product.id) {
                    if (!deleted) {
                        this.stagedProducts[i].count++;
                    }
                    else if (deleted) {
                        this.stagedProducts[i].count--;
                    }
                    productAlreadyStaged = true;
                }
            }
            if (!productAlreadyStaged) {
                this.stagedProducts.push({ count: 1, product: product });
            }
        },

        getProductCount: function (product) {
            for (i = 0; i < this.stagedProducts.length; i++) {
                if (product.id == this.stagedProducts[i].product.id) {
                    return this.stagedProducts[i].count;
                }
            }
            return 0;
        },

        getProductCountDelete: function (product) {
            for (i = 0; i < this.stagedProducts.length; i++) {
                if (product.id == this.stagedProducts[i].product.id) {
                    if (this.stagedProducts[i].count > 0) {
                        return this.stagedProducts[i].count;
                    }
                    else if (this.stagedProducts[i].count = 0) {
                        return this.stagedProducts[i].count;
                    }
                }
            }
            return 0;
        },

        getProductCostSum: function () {
            var cost = 0;

            for (i = 0; i < this.stagedProducts.length; i++) {
                cost += this.stagedProducts[i].product.price
                    * this.stagedProducts[i].count;
            }
            return cost;
        },

        clear: function () {
            this.notch.innerHTML = "0,00€";
            this.stagedProducts = [];
            this.isRegistration = false;
            products.clear();
            moneyKeyPad.clear();
            userHash = "";
            userId = -1;
            balance = -1;
        },
        
        setCardId: function(userId) {
            this.userHash = sha256(userId);
        },

        setUserInfo: function(id, balance) {
            this.userId = id;
            this.balance = balance;
            this.balanceTag.innerHTML = "Guthaben: " + parseFloat(balance).toFixed(2).replace(".", ",") + " €";
        },

        getAuthHeader() {
            if(this.userHash == "")
                throw "No user hash";
            headers = new Headers();
            headers.append('Authorization', 'Basic ' + btoa(this.userHash + ':'));
            return headers;
        }
    }

    moneyKeyPad = {
        display: document.getElementById("money_display"),
        centValue: 0,

        setValue: function (value) {
            moneyKeyPad.centValue += value;
            moneyKeyPad.display.innerHTML = parseFloat(moneyKeyPad.centValue).toFixed(2).replace(".", ",") + "€";
        },

        clear: function () {
            this.centValue = 0;
            this.display.innerHTML = "0,00€";
        },

        init: function () {
            var numPadButtons = document.getElementsByClassName("npb");
            for (let i = 0; i < numPadButtons.length; i++) {
                numPadButtons[i].onclick = function () {
                    moneyKeyPad.centValue = moneyKeyPad.centValue * 10;
                    moneyKeyPad.centValue = moneyKeyPad.centValue + parseInt(numPadButtons[i].innerHTML) / 100;
                    moneyKeyPad.display.innerHTML = parseFloat(moneyKeyPad.centValue).toFixed(2).replace(".", ",") + "€";
                };
            }
        },

        delete: function () {
            moneyKeyPad.centValue = moneyKeyPad.centValue / 10;
            moneyKeyPad.centValue = Math.floor(moneyKeyPad.centValue * 100) / 100.0;
            moneyKeyPad.display.innerHTML = moneyKeyPad.centValue.toFixed(2).replace(".", ",") + "€";
        }
    }

    moneyKeyPad.init();
    errorScreen.hide();
    window.addEventListener('error', function (errorEvent) {
        errorScreen.showErrorEvent(errorEvent);
    });
    loadingScreen.hide();
    pages.showPage(pages.startPage);
}

function onEnterPressed(inputString) {
    session.clear();
    session.setCardId(inputString);
    loadingScreen.show();
    loadUser(function(res) {
        if(res.status == 200) {
            loadProducts(function(productsData) {
                for (let pData of productsData) {
                    products.addProduct(pData.id, pData.name, pData.thumbnail, pData.price);
                }
                pages.showPage(pages.mainPage);
                loadingScreen.hide();
            });
            userData = res.json();
            session.setUserInfo(userData.id, userData.balance);
        } else {
            pages.showPage(pages.registrationPage);
            loadingScreen.hide();
        }
    });
    (async () => {
        data = await giphyRandom("X9m2ukRMWcyp7lh7YjCe4SHFU365BXWY", { tag: "thanks" });
        thankYouGif.src = data.data.image_url;
    })();
}

function onLogoutButton() {
    pages.showPage(pages.startPage);
}

function onBuyButton() {
    loadingMock(function () {
        pages.showPage(pages.thankYouPage);
        setTimeout(function () {
            pages.showPage(pages.startPage);
        }, 5000);
    });
}

function onAddMoneyButton() {
    pages.showPage(pages.addMoneyPage);
}

function onCancelAddMoney() {
    moneyKeyPad.clear();
    if (session.isRegistration) {
        session.clear();
        pages.showPage(pages.startPage);
    } else {
        pages.showPage(pages.mainPage);
    }
}

function onOkAddMoney() {
    loadingMock(function () {
        moneyKeyPad.clear();
        pages.showPage(pages.mainPage);
    });
}

function onResetAddMoney() {
    moneyKeyPad.clear();
}

function onDeleteAddMoney() {
    moneyKeyPad.delete();
}

function onErrorScreenClick() {
    errorScreen.hide()
    pages.showPage(pages.startPage);
    session.clear();
}

function onProductMouseDown() {
    productScreenScrolled = false;
}

function onProductMouseMove() {
    productScreenScrolled = true;
}

function onProductMouseUp(id) {
    deleted = false;
    if (!productScreenScrolled) {
        onProductClicked(products.getProductById(id),
            document.getElementById("product_" + id), deleted);
    }
}

function onDeleteProductMouseUp(id) {
    deleted = true;
    if (!productScreenScrolled) {
        onProductClicked(products.getProductById(id),
            document.getElementById("product_" + id), deleted);
    }
}

function onProductClicked(product, productCard, productDeleted) {
    bobel = productCard.getElementsByClassName("bobel")[0];
    bobelText = productCard.getElementsByClassName("product_count")[0];
    removeButton = productCard.getElementsByClassName("product_remove_button")[0];

    if (productDeleted == true) {
        session.addDeleteProduct(product, true);
        bobelText.innerHTML = session.getProductCountDelete(product);
    }
    else if (productDeleted == false) {
        session.addDeleteProduct(product, false);
        bobelText.innerHTML = session.getProductCount(product);
    }
    session.notch.innerHTML = parseFloat(session.getProductCostSum()).toFixed(2).replace(".", ",") + " €";


    if (bobelText.innerHTML != "0") {
        bobel.style.display = 'block';
        bobelText.style.display = 'block';
        removeButton.style.display = 'block';
    }
    else if (bobelText.innerHTML == "0") {
        bobel.style.display = 'none';
        bobelText.style.display = 'none';
        removeButton.style.display = 'none';
    }
}

function onDeleteProductClicked(product, productCard) {
    alert("delete");
}

function onAddMoneyButtonClicked(amount) {
    moneyKeyPad.setValue(amount);
}

function onInvisibleAcceptButton() {
    session.isRegistration = true;
    pages.showPage(pages.addMoneyPage);
}

document.onkeypress = function (e) {
    if (e.keyCode != 13) {
        keyBuffer += String.fromCharCode(e.keyCode);
    } else {
        onEnterPressed(keyBuffer);
        keyBuffer = "";
    }
}

//THIS IS MOCKUP REMOVE THIS
function loadingMock(afterDone) {
    loadingScreen.show();
    setTimeout(function () {
        loadingScreen.hide();
        afterDone();
    }, 1000);
}

function getProducts() {
    loadProducts(
        function (productsData) {
            for (let pData of productsData) {
                products.addProduct(pData.id, pData.name, pData.thumbnail, pData.price);
            }
        });
}

function loadUser(callback) {
    fetch(server + '/v1/users/me', {method:'GET', headers:session.getAuthHeader()})
        .then(callback)
        .catch(error => errorScreen.showError(error));
}

function loadProducts(callback) {
    fetch(server + '/v1/products', {method:'GET', headers:session.getAuthHeader()})
        .then(callback)
        .then(res => res.json())
        .catch(error => errorScreen.showError(error));
}

function sendPurchase(callback, data) {
    //TODO: make this actually work
    fetch(server + '/v1/transactions/purchase', {
        method: 'POST',
        headers: session.getAuthHeader(),
        cache: 'no-cache',
        body: JSON.stringify(data)
    })
        .then(res => res.status)
        .then(callback)
        .catch(error => errorScreen.showError(error));
}

function sendDeposit(callback, data) {
    //TODO: make this actually work
    fetch(server + '/v1/transactions/deposit', {
        method: 'POST',
        headers: session.getAuthHeader(),
        cache: 'no-cache',
        body: JSON.stringify(data)
    })
        .then(res => res.status)
        .then(callback)
        .catch(error => errorScreen.showError(error));
}