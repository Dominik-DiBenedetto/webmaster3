const sections_holder = document.querySelector(".scroll-transition-sections");
const root_icon = document.querySelector("root-icon");

let scrollShouldTransition = true;
window.addEventListener("scroll", (e) => {
    const htmlElm = document.documentElement;
    const screenHeightScrolled = htmlElm.scrollTop/sections_holder.clientHeight;
    console.log("scroll", screenHeightScrolled, scrollShouldTransition);
    if (screenHeightScrolled < 1) { // P1
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p1-scroll", Math.min(screenHeightScrolled*100, 100));
        htmlElm.style.setProperty("--p2-scroll", 0);
    } else if (screenHeightScrolled < 2) { // P2
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p1-scroll", 100);
        htmlElm.style.setProperty("--p2-scroll", Math.min(screenHeightScrolled*100, 200));
        htmlElm.style.setProperty("--p3-scroll", 0);
    } else if (screenHeightScrolled < 3) {
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p2-scroll", 200);
        htmlElm.style.setProperty("--p3-scroll", Math.min((screenHeightScrolled-2)*100, 100));
        htmlElm.style.setProperty("--p4-scroll", 0);
    } else if (screenHeightScrolled < 4) {
        scrollShouldTransition = true;
        htmlElm.style.setProperty("--p3-scroll", 100);
        htmlElm.style.setProperty("--p4-scroll", Math.min((screenHeightScrolled-3)*100, 100));
    } else if (scrollShouldTransition) {
        scrollShouldTransition = false;
        htmlElm.style.setProperty("--p4-scroll", 100);
    }
    if (scrollShouldTransition) htmlElm.style.setProperty("--top-scroll", screenHeightScrolled*100);
})
