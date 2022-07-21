var TOAST_Z_INDEX_COUNT = 1000;

function toast(message, background = "light", duration = 4000){
    let main_content = document.querySelector("#main-content");

    let a = document.createElement("div");
    a.className = "py-3 col-xs-10 px-4 btn-" + background + " shadow animated text-c fadeIn po-abs cursor-pointer user-select-0";
    a.style = "max-width: 100%; min-width: 10%; top: 5%; left: 50%; z-index: " + TOAST_Z_INDEX_COUNT + "; transform: translate(-50%, 0); width: auto; border-radius: 30px;";
    a.innerHTML = message;
    TOAST_Z_INDEX_COUNT = Number(TOAST_Z_INDEX_COUNT) + 1;

    main_content.appendChild(a);

    return new Promise(
        res => {
            setTimeout(
                () => {
                    return new Promise(
                        () => {
                            a.classList.replace("fadeIn", "fadeOut");
                            a.addEventListener(
                                "animationend",
                                () => {
                                    a.remove();
                                    res("success");
                                }
                            );
                        }
                    );
                }, duration
            );
        }
    );
}
