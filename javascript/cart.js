import menuURL from "../menu.json";

const cart = document.querySelector(".cart");
const receiptItems = document.querySelector(".receipt-items");
const receiptSubtotal = document.querySelector(".receipt-total");

let menu = {};
let receipt = {}

fetch(menuURL)
    .then(response => response.json())
    .then(data => {
        for (const [cat, item] of Object.entries(data)) {
            for (const [itemName, properties] of Object.entries(item)) {
                menu[itemName] = properties;
            }
        }
        for (let i=0; i<localStorage.length; i++)
        {
            let itemName = localStorage.key(i);
            let quantity = localStorage.getItem(itemName);
            createCartItem(itemName, menu[itemName], quantity, cart);
        }
    })
    .catch(error => {
        console.error("Error fetchin json", error);
    })

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function removeFromCart(itemName, quantityElm)
{
    // Check for item first
    let cartItem = parseInt(localStorage.getItem(itemName) || 0);

    if (cartItem == 0) return;
    if (cartItem == 1) {
        localStorage.removeItem(itemName);
        quantityElm.parentNode.parentNode.parentNode.remove();

        // Remove from receipt
        let receiptItem = receipt[itemName];
        receiptItem.remove();
        delete receipt[itemName];
        updateTotal();
    }
    else {
        localStorage.setItem(itemName,cartItem-1);
        quantityElm.textContent = `x${cartItem-1}`;

        // Update receipt
        let receiptItem = receipt[itemName];
        let receiptPrice = receiptItem.querySelector(".receipt-price");

        let newPrice = (parseFloat(receiptPrice.textContent.replace("$",""))/cartItem) * (cartItem-1);
        receiptItem.innerHTML = `${itemName} (x${cartItem-1}) <span class='receipt-price'>$${roundToTwo(newPrice)}</span>`;

        updateTotal();
    }
}

function createCartItem(itemName, properties, quantityNum, parent)
{
    let cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    let topDiv = document.createElement("div")
    topDiv.classList.add("cart-item-top");

    let name = document.createElement("div")
    name.classList.add("cart-item-name");
    
    let nameSpan = document.createElement("span");
    nameSpan.textContent = itemName;
    name.appendChild(nameSpan);

    let price = document.createElement("div")
    price.classList.add("cart-item-price");
    price.textContent = `$${properties["Price"]}`

    topDiv.appendChild(name);
    topDiv.appendChild(price);

    let bottomDiv = document.createElement("div");
    bottomDiv.classList.add("cart-item-bottom");

    let desc = document.createElement("div");
    desc.classList.add("cart-item-description");
    desc.textContent = properties["Description"];

    let footer = document.createElement("div")
    footer.classList.add("footer");

    let quantity = document.createElement("div");
    quantity.classList.add("cart-item-quantity");
    quantity.textContent = `x${quantityNum}`;

    let removeBtn = document.createElement("button")
    removeBtn.classList.add("cart-item-remove");
    removeBtn.textContent = "Remove from Order";

    removeBtn.addEventListener("click", () => removeFromCart(itemName, quantity))

    footer.appendChild(quantity);
    footer.appendChild(removeBtn);

    bottomDiv.appendChild(desc);
    bottomDiv.appendChild(footer);


    cartItem.appendChild(topDiv);
    cartItem.appendChild(bottomDiv);

    parent.appendChild(cartItem);

    addReceiptItem(itemName, quantityNum, properties["Price"]);
}

function addReceiptItem(itemName, itemQuantity, itemPrice)
{
    let item = document.createElement("div");
    item.classList.add("receipt-item");
    item.id = itemName.replace(" ", "-");
    item.textContent = `${itemName} (x${itemQuantity})`

    let priceTotal = document.createElement("span");
    priceTotal.classList.add("receipt-price");
    priceTotal.textContent = `$${roundToTwo(itemPrice*itemQuantity)}`;
    
    item.appendChild(priceTotal);
    receiptItems.appendChild(item);

    receipt[itemName] = item;

    updateTotal();
}

function updateTotal()
{
    let subtotal = 0;
    for (const [itemName, elm] of Object.entries(receipt)) {
        subtotal += parseFloat(elm.querySelector(".receipt-price").textContent.replace("$",""));
    }
    receiptSubtotal.textContent = `Subtotal: $${roundToTwo(subtotal)}`;
}