import menuData from "../public/menu.json";
import sandwichPic from "../public/images/svg/sandwich.svg";
import saladPic from "../public/images/svg/salad.svg";
import cookiePic from "../public/images/svg/cookies.svg";
import soupPic from "../public/images/svg/soup.svg";

const sections_holder = document.querySelector(".scroll-transition-sections");
const root_icon = document.querySelector("root-icon");
const navbar_links = document.querySelectorAll(".navbar-link");
const menu_modal = document.querySelector(".menu-modal");
const htmlElm = document.documentElement;

const ourProcess1 = document.querySelector(".our-process-1");
const menu = document.querySelector(".menu-section");
const loc = document.querySelector(".location-section");

const recyclingBio = document.querySelector(".s2b")
const recyclingBio2 = document.querySelector(".recycle-bio-2")

let scrollShouldTransition = true;
function scrollTransitions(screenHeightScrolled){
    if (screenHeightScrolled < 1) { // P1
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p1-scroll", Math.min(screenHeightScrolled*100, 100));

        // Reset (for super fast scroll purposes)
        htmlElm.style.setProperty("--p2-scroll", 0);
        htmlElm.style.setProperty("--p3-scroll", 0);
        htmlElm.style.setProperty("--p4-scroll", 0);
        htmlElm.style.setProperty("--p5-scroll", 0);
        htmlElm.style.setProperty("--p6-scroll", 0);
        htmlElm.style.setProperty("--p7-scroll", 0);
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);

        // Change navbar highlighting
        document.querySelector("button.active").classList.remove("active");
        document.querySelector("[data-label='Home']").classList.add("active");
    } else if (screenHeightScrolled < 2) { // P2
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p1-scroll", 100);
        htmlElm.style.setProperty("--p2-scroll", Math.min((screenHeightScrolled-0.1)*100, 200));

        // Reset 
        htmlElm.style.setProperty("--p3-scroll", 0);
        htmlElm.style.setProperty("--p4-scroll", 0);
        htmlElm.style.setProperty("--p5-scroll", 0);
        htmlElm.style.setProperty("--p6-scroll", 0);
        htmlElm.style.setProperty("--p7-scroll", 0);
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);

        // Change navbar highlighting
        document.querySelector("button.active").classList.remove("active");
        document.querySelector("[data-label='Farm-to-Table']").classList.add("active");
    } else if (screenHeightScrolled < 3) { // P2
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p1-scroll", 100);
        htmlElm.style.setProperty("--p2-scroll", 200);
        htmlElm.style.setProperty("--p2s2-scroll", Math.min((screenHeightScrolled-2)*100, 100));

        // Reset
        htmlElm.style.setProperty("--p3-scroll", 0);
        htmlElm.style.setProperty("--p4-scroll", 0);
        htmlElm.style.setProperty("--p5-scroll", 0);
        htmlElm.style.setProperty("--p6-scroll", 0);
        htmlElm.style.setProperty("--p7-scroll", 0);
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--recycle-bin-scroll", 0)
        htmlElm.style.setProperty("--top-scroll", 0);
    } else if (screenHeightScrolled > 3 && screenHeightScrolled < 4) {
        htmlElm.style.setProperty("--p2s2-scroll", 100);
        scrollShouldTransition = true;
        let percent = (screenHeightScrolled-3)*100;
        htmlElm.style.setProperty("--recycle-bin-scroll", percent);
        if (percent >= 77) {
            recyclingBio.style.display = "none";
            recyclingBio2.style.display = "block";
        } else {
            recyclingBio.style.display = "block";
            recyclingBio2.style.display = "none";
        }
    } else if (screenHeightScrolled < 5.6) {
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p2s2-scroll", 100);
        htmlElm.style.setProperty("--recycle-bin-scroll", (screenHeightScrolled-3)*100);
        htmlElm.style.setProperty("--p3-scroll", Math.min((screenHeightScrolled-4.6)*100, 100));

        // Resets
        htmlElm.style.setProperty("--p4-scroll", 0);
        htmlElm.style.setProperty("--p5-scroll", 0);
        htmlElm.style.setProperty("--p6-scroll", 0);
        htmlElm.style.setProperty("--p7-scroll", 0);
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);
        recyclingBio.style.display = "none";
        recyclingBio2.style.display = "block";
    } else if (screenHeightScrolled < 6.6) {
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p3-scroll", 100);
        htmlElm.style.setProperty("--p4-scroll", Math.min((screenHeightScrolled-5.6)*100, 100));

        // Resets
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);
        htmlElm.style.setProperty("--p5-scroll", 0);
        htmlElm.style.setProperty("--p6-scroll", 0);
        htmlElm.style.setProperty("--p7-scroll", 0);
        recyclingBio.style.display = "none";
        recyclingBio2.style.display = "block";

        // Change navbar highlighting
        document.querySelector("button.active").classList.remove("active");
        document.querySelector("[data-label='Our Process']").classList.add("active");
    }
    else if (screenHeightScrolled < 7.6) {
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p4-scroll", 100);
        htmlElm.style.setProperty("--p5-scroll", Math.min((screenHeightScrolled-6.6)*100, 100));

        // Reset
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);
        htmlElm.style.setProperty("--p6-scroll", 0);
        htmlElm.style.setProperty("--p7-scroll", 0);
        recyclingBio.style.display = "none";
        recyclingBio2.style.display = "block";
    }
    else if (screenHeightScrolled < 8.6) {
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p5-scroll", 100);
        htmlElm.style.setProperty("--p6-scroll", Math.min((screenHeightScrolled-7.6)*100, 100));

        // Reset
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);
        htmlElm.style.setProperty("--p7-scroll", 0);
        recyclingBio.style.display = "none";
        recyclingBio2.style.display = "block";
    }
    else if (screenHeightScrolled < 9.8) {
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p6-scroll", 100);
        htmlElm.style.setProperty("--p7-scroll", Math.min((screenHeightScrolled-8.6)*100, 100));

        // Reset
        document.querySelector(".scroll-transition-sections").classList.remove("inactive");
        htmlElm.style.setProperty("--top-scroll", 0);
        recyclingBio.style.display = "none";
        recyclingBio2.style.display = "block";

        // Change navbar highlighting
        document.querySelector("button.active").classList.remove("active");
        document.querySelector("[data-label='Our Process']").classList.add("active");
    } else if (scrollShouldTransition) {
        scrollShouldTransition = false;
        htmlElm.style.setProperty("--p7-scroll", 100);
        document.querySelector(".scroll-transition-sections").classList.add("inactive");
        htmlElm.style.setProperty("--top-scroll", screenHeightScrolled*100);
        // Change navbar highlighting
        document.querySelector("button.active").classList.remove("active");
        document.querySelector("[data-label='Our Process']").classList.add("active");
    } else {
        // Change navbar highlighting
        if (screenHeightScrolled < 12.6) {
            document.querySelector("button.active").classList.remove("active");
            document.querySelector("[data-label='Menu']").classList.add("active");
        } else {
            document.querySelector("button.active").classList.remove("active");
            document.querySelector("[data-label='Location']").classList.add("active");
        }
    }
}

const salad_sand_line = document.querySelector(".menu-holder g .salad-sandwich-line");
const sand_wrap_line = document.querySelector(".menu-holder g .sandwich-wrap-line");
const wrap_soup_line = document.querySelector(".menu-holder g .wrap-soup-line");
const soup_desert_line = document.querySelector(".menu-holder g .soup-dessert-line");
const desert_drink_line = document.querySelector(".menu-holder g .dessert-drink-line");

const mobile_salad_sand_line = document.querySelector(".mobile.salad-sandwich-line");
const mobile_sand_wrap_line = document.querySelector(".mobile.sandwich-wrap-line");
const mobile_wrap_soup_line = document.querySelector(".mobile.wrap-soup-line");
const mobile_soup_desert_line = document.querySelector(".mobile.soup-dessert-line");
const mobile_desert_drink_line = document.querySelector(".mobile.dessert-drink-line");

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
    // console.log(screenHeightScrolled)

    // Menu lines
    const menuScrollHeight = htmlElm.scrollTop/menu.clientHeight;
    // console.log(menuScrollHeight);

    console.log(window.getComputedStyle(document.querySelector(".menu-holder")).display)
    if (window.getComputedStyle(document.querySelector(".menu-holder")).display != "none") {
        let saladSandDashoffset = getMenuLineDashoffset(salad_sand_line, 4.5, 4.15, menuScrollHeight);
        htmlElm.style.setProperty("--salad-sandwich-cur-scroll", saladSandDashoffset);

        let sandWrapDashoffset = getMenuLineDashoffset(sand_wrap_line, 4.56, 4.45, menuScrollHeight, true);
        htmlElm.style.setProperty("--sandwich-wrap-cur-scroll", sandWrapDashoffset);

        let wrapSoupDashoffset = getMenuLineDashoffset(wrap_soup_line, 4.78, 4.56, menuScrollHeight);
        htmlElm.style.setProperty("--wrap-soup-cur-scroll", wrapSoupDashoffset);

        let soupDesertDashoffset = getMenuLineDashoffset(soup_desert_line, 4.97, 4.75, menuScrollHeight);
        htmlElm.style.setProperty("--soup-dessert-cur-scroll", soupDesertDashoffset);

        let desertDrinkDashoffset = getMenuLineDashoffset(desert_drink_line, 5.15, 4.97, menuScrollHeight);
        htmlElm.style.setProperty("--dessert-drink-cur-scroll", desertDrinkDashoffset);
    } else {
        console.log(menuScrollHeight)
        let saladSandDashoffset = getMenuLineDashoffset(mobile_salad_sand_line, 4.5, 4.17, menuScrollHeight);
        htmlElm.style.setProperty("--mobile-salad-sandwich-cur-scroll", saladSandDashoffset);

        let sandWrapDashoffset = getMenuLineDashoffset(mobile_sand_wrap_line, 4.75, 4.45, menuScrollHeight, true);
        htmlElm.style.setProperty("--mobile-sandwich-wrap-cur-scroll", sandWrapDashoffset);

        let wrapSoupDashoffset = getMenuLineDashoffset(mobile_wrap_soup_line, 4.78, 4.65, menuScrollHeight);
        htmlElm.style.setProperty("--mobile-wrap-soup-cur-scroll", wrapSoupDashoffset);

        let soupDesertDashoffset = getMenuLineDashoffset(mobile_soup_desert_line, 5.06, 4.8, menuScrollHeight);
        htmlElm.style.setProperty("--mobile-soup-dessert-cur-scroll", soupDesertDashoffset);

        let desertDrinkDashoffset = getMenuLineDashoffset(mobile_desert_drink_line, 5.15, 4.9, menuScrollHeight);
        htmlElm.style.setProperty("--mobile-dessert-drink-cur-scroll", desertDrinkDashoffset);
    }
})

navbar_links.forEach((link) => {
    link.addEventListener("click", () => {
        if (link.getAttribute("data-label") == "Home") {
            window.scrollTo({top: 0, behavior: "smooth"});
        } else if (link.getAttribute("data-label") == "Farm-to-table") {
            window.scrollTo({top: document.documentElement.clientHeight, behavior: "smooth"});
        } else if (link.getAttribute("data-label") == "Our Process") {
            window.scrollTo({top: document.documentElement.clientHeight*5.6, behavior: "smooth"});
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
if (menuData != null) {
    for (const [cat, item] of Object.entries(menuData)) {
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
}

const modal_url = document.querySelector(".image-side");
function openMenu(menuId)
{
    switch (menuId) {
        case "salads":
            modal_url.style.backgroundImage = `url(${saladPic})`;
            break;
        case "sandwiches":
            modal_url.style.backgroundImage = `url(${sandwichPic})`;
            break;
        case "deserts":
            modal_url.style.backgroundImage = `url(${cookiePic})`;
        case "soups":
            modal_url.style.backgroundImage = `url(${soupPic})`;

    
        default:
            console.log('sa', menuId)
            break;
    }
    document.querySelector(".menu-active").classList.remove("menu-active");
    document.querySelector(`.${menuId.toLowerCase()}-menu`).classList.add("menu-active");

    document.querySelector(".menu-modal").classList.add("active");
}

document.querySelectorAll(".menu-cat").forEach((cat) => {
    console.log(cat)
    cat.addEventListener("click", (e) => {
        e.preventDefault();
        openMenu(cat.getAttribute("data-menu").toLowerCase());
    })
})

function addToCart(itemName)
{
    // Check for item first
    let cartItem = parseInt(localStorage.getItem(itemName) || 0);

    // Increase quantity
    cartItem += 1;
    localStorage.setItem(itemName, cartItem);
}


console.log(document.querySelector(".place-name"))