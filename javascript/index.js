const sections_holder = document.querySelector(".scroll-transition-sections");
const root_icon = document.querySelector("root-icon");
const navbar_links = document.querySelectorAll(".navbar-link");
const menu_modal = document.querySelector(".menu-modal");
const htmlElm = document.documentElement;

const menu = document.querySelector(".menu-section");
const loc = document.querySelector(".location-section");

let scrollShouldTransition = true;
function scrollTransitions(screenHeightScrolled){
    if (screenHeightScrolled < 1) { // P1
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p1-scroll", Math.min(screenHeightScrolled*100, 100));
        htmlElm.style.setProperty("--p2-scroll", 0);
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);
    } else if (screenHeightScrolled < 2) { // P2
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p1-scroll", 100);
        htmlElm.style.setProperty("--p2-scroll", Math.min((screenHeightScrolled-0.1)*100, 200));
        htmlElm.style.setProperty("--p3-scroll", 0);
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);
    } else if (screenHeightScrolled < 3) {
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p2-scroll", 200);
        htmlElm.style.setProperty("--p3-scroll", Math.min((screenHeightScrolled-2)*100, 100));
        htmlElm.style.setProperty("--p4-scroll", 0);
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);
    } else if (screenHeightScrolled < 4) {
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p3-scroll", 100);
        htmlElm.style.setProperty("--p4-scroll", Math.min((screenHeightScrolled-3)*100, 100));
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);
    } else if (scrollShouldTransition) {
        scrollShouldTransition = false;
        htmlElm.style.setProperty("--p4-scroll", 100);
        document.querySelector(".scroll-transition-sections").classList.add("inactive");
        htmlElm.style.setProperty("--top-scroll", screenHeightScrolled*100);
    }
}

const salad_sand_line = document.querySelector(".salad-sandwich-line");
const sand_wrap_line = document.querySelector(".sandwich-wrap-line");
const wrap_soup_line = document.querySelector(".wrap-soup-line");
const soup_drink_line = document.querySelector(".soup-drink-line");

function getMenuLineDashoffset(element, rangeTop, rangeBottom, scrollHeight, reverse=false){
    if (!reverse){
        let max_length = Math.round(element.getTotalLength());
        let scrollPos = Math.min(Math.max(((rangeTop+rangeBottom)*(scrollHeight/rangeTop) - rangeBottom), rangeBottom), rangeTop);
        let offset = rangeTop + ((max_length-rangeTop) / (rangeTop-rangeBottom)) * (scrollPos - rangeBottom);

        return max_length-offset;
    } else {
        let max_length = Math.round(element.getTotalLength());
        let scrollPos = Math.min(Math.max(((rangeTop+rangeBottom)*(scrollHeight/rangeTop) - rangeBottom), rangeBottom), rangeTop);
        let offset = rangeTop + ((max_length-rangeTop) / (rangeTop-rangeBottom)) * (scrollPos - rangeBottom);

        return max_length+offset;
    }
}

window.addEventListener("scroll", (e) => {
    
    const screenHeightScrolled = htmlElm.scrollTop/sections_holder.clientHeight;
    scrollTransitions(screenHeightScrolled);

    // Menu lines
    const menuScrollHeight = htmlElm.scrollTop/menu.clientHeight;
    console.log(menuScrollHeight);

    let saladSandDashoffset = getMenuLineDashoffset(salad_sand_line, 2.1, 1.88, menuScrollHeight);
    htmlElm.style.setProperty("--salad-sandwich-cur-scroll", saladSandDashoffset);

    let sandWrapDashoffset = getMenuLineDashoffset(sand_wrap_line, 2.22, 2.05, menuScrollHeight, true);
    htmlElm.style.setProperty("--sandwich-wrap-cur-scroll", sandWrapDashoffset);

    let wrapSoupDashoffset = getMenuLineDashoffset(wrap_soup_line, 2.49, 2.22, menuScrollHeight);
    htmlElm.style.setProperty("--wrap-soup-cur-scroll", wrapSoupDashoffset);

    let soupDrinkDashoffset = getMenuLineDashoffset(soup_drink_line, 2.6, 2.49, menuScrollHeight);
    htmlElm.style.setProperty("--soup-drink-cur-scroll", soupDrinkDashoffset);
})

navbar_links.forEach((link) => {
    link.addEventListener("click", () => {
        if (link.getAttribute("data-label") == "Home") {
            window.scrollTo({top: 0, behavior: "smooth"});
        } else if (link.getAttribute("data-label") == "Farm-to-table") {
            window.scrollTo({top: document.documentElement.clientHeight, behavior: "smooth"});
        } else if (link.getAttribute("data-label") == "Menu") {
            menu.scrollIntoView({ behavior: "smooth" });
        } else if (link.getAttribute("data-label") == "Location"){
            loc.scrollIntoView({ behavior: "smooth" });
        }
        document.querySelector(".active").classList.remove("active");
        link.classList.add("active");
    })
})

// Populate menu
fetch("./menu.json")
    .then(response => response.json())
    .then(data => {
        for (const [cat, item] of Object.entries(data)) {
            let menuTab = document.querySelector(`.${cat.toLowerCase()}-menu`);
            console.log(menuTab)
            if (menuTab == null) continue;
            for (const [itemName, properties] of Object.entries(item)) {
                let menuItem = document.createElement("div");
                menuItem.classList.add("menu-item");

                let topDiv = document.createElement("div")
                topDiv.classList.add("menu-item-top");

                let name = document.createElement("div")
                name.classList.add("menu-item-name");
                
                let nameSpan = document.createElement("span");
                nameSpan.textContent = itemName;
                name.appendChild(nameSpan);

                let price = document.createElement("div")
                price.classList.add("menu-item-price");
                price.textContent = `$${properties["Price"]}`

                topDiv.appendChild(name);
                topDiv.appendChild(price);

                let bottomDiv = document.createElement("div");
                bottomDiv.classList.add("menu-item-bottom");

                let desc = document.createElement("div");
                desc.classList.add("menu-item-description");
                desc.textContent = properties["Description"];

                let footer = document.createElement("div")
                footer.classList.add("footer");

                let calories = document.createElement("div");
                calories.classList.add("menu-item-calories");
                calories.textContent = `${properties["Calories"]}cal`;

                let addBtn = document.createElement("button")
                addBtn.classList.add("menu-item-add");
                addBtn.textContent = "Add to Order";

                addBtn.addEventListener("click", () => addToCart(itemName))

                footer.appendChild(calories);
                footer.appendChild(addBtn);

                bottomDiv.appendChild(desc);
                bottomDiv.appendChild(footer);


                menuItem.appendChild(topDiv);
                menuItem.appendChild(bottomDiv);

                menuTab.appendChild(menuItem);
            }
        }
    })
    .catch(error => {
        console.error("Error fetchin json", error);
    })

function openMenu(e, menuId)
{
    e.preventDefault();
    document.querySelector(".menu-active").classList.remove("menu-active");
    document.querySelector(`.${menuId.toLowerCase()}-menu`).classList.add("menu-active");

    document.querySelector(".menu-modal").classList.add("active");
}

function addToCart(itemName)
{
    // Check for item first
    let cartItem = parseInt(localStorage.getItem(itemName) || 0);

    // Increase quantity
    cartItem += 1;
    localStorage.setItem(itemName, cartItem);
}

console.log(document.querySelector(".place-name"))