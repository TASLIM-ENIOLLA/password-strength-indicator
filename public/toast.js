class Toast{
	constructor(){
		this.TOAST_Z_INDEX_COUNT = 1;
	}
	toast(message, background = "light", duration = 4000){
        let body = document.body;

        let a = document.createElement("div");
        a.className = "py-3 px-4 btn-" + background + " shadow animated text-c fadeIn po-fixed cursor-pointer user-select-0";
        a.style = "max-width: 100%; min-width: 10%; top: 5%; left: 50%; z-index: " + this.TOAST_Z_INDEX_COUNT + "; transform: translate(-50%, 0); width: auto; border-radius: 30px;";
        a.innerHTML = message;
        this.TOAST_Z_INDEX_COUNT = Number(this.TOAST_Z_INDEX_COUNT) + 1;

        body.appendChild(a);

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
}

var toast = (message, background, duration) => {
    new Toast().toast(message, background, duration);
}