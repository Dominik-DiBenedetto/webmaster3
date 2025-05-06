const modal = document.querySelector(".modal")
const close_btn = document.querySelector(".close")

const pdf_viewer = document.querySelector(".pdf-holder");
const pdf_link = document.querySelector(".view-in-tab")

const WORKLOGS_PATH = "/documents/testworklogs.pdf";
const CHECKLIST_PATH = "/documents/CopyrightChecklist.pdf";

function open_modal(document) {
    if (document == "worklogs") {
        pdf_viewer.src = WORKLOGS_PATH;
        pdf_link.href = WORKLOGS_PATH;
    } else if (document == "checklist") {
        pdf_viewer.src = CHECKLIST_PATH;
        pdf_link.href = CHECKLIST_PATH;
    }
    modal.classList.add("active");
}

close_btn.addEventListener("click", () => {
    modal.classList.remove("active")
})

document.querySelector(".copyright-checklist-popup").addEventListener("click", (e) => open_modal("checklist"));
document.querySelector(".worklogs-popup").addEventListener("click", (e) => open_modal("worklogs"));