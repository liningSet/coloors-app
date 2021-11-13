/*Hope this program isn't abnormally confusing to those 
who are viewing this script file in the future (including myself).
it's the best i could do by --November 11th 2021--*/ 

//initial variable declarations

const slots = document.querySelectorAll(".slot");
const locks = document.querySelectorAll(".lock");
const adjusts = document.querySelectorAll(".adjust");
const ranges = document.querySelectorAll(".range");
const closeAdjustBtns = document.querySelectorAll(".close-modal-btn");
const libraryBtn = document.querySelector("#library-btn");
const refreshBtn = document.querySelector("#refresh-btn");
const saveBtn = document.querySelector("#save-btn");
const overlay = document.querySelector(".overlay");
const overlay2 = document.querySelector(".overlay2");
const closeSaveBtn = document.querySelector(".close-save");
const closeLibraryBtn = document.querySelector(".close-library-btn");
const pnameInput = document.querySelector(".palette-name-input");
const palattesFlex = document.querySelector(".palettes-flex");
const saveNameBtn = document.querySelector(".save-name-btn");
let selectBtns;
let newPalette = [];
let hue;
let saturation;
let lightness;

//generates a random color in hsl format everytime run
function changeColor(){
    hue = Math.round(Math.random() * 359);
    saturation = Math.round(Math.random() * 100);
    lightness = Math.round(Math.random() * 100);
    return [hue, saturation, lightness];
}

//applies the output of changeColor() function to html
//also tracks the changes made in adjustments window
function refresh(){
    slots.forEach(slot => {
        let newColor = changeColor();
        let h = newColor[0];
        let s = newColor[1];
        let l = newColor[2];
        let minS = `hsl(${h}, ${0}%, ${l}%)`;
        let maxS = `hsl(${h}, ${100}%, ${l}%)`;
        let child = slot.children[1];
        let theText = slot.children[0].children[0];
        let hRange = child.children[1];
        let sRange = child.children[3];
        let lRange = child.children[5];
        let hexed = hslToHex(h, s, l);

        //ignores the locked slots
        if(!slot.classList.contains("locked")){

            slot.style.background = `hsl(${h}, ${s}%, ${l}%)`;
            theText.textContent = hexed;

            let bgC = slot.style.background;

            checkContrast(bgC, slot);
            
            hRange.value = h;
            sRange.value = s;
            lRange.value = l;
            sRange.style.background = `linear-gradient(to right, ${minS}, ${maxS})`;
            lRange.style.background = `linear-gradient(to right, black, hsl(${h}, ${s}%, ${l}%), white)`;
            
            
            hRange.addEventListener("input", () => {
                h = hRange.value;
                slot.style.background = `hsl(${h}, ${s}%, ${l}%)`;
                hexed = hslToHex(h, s, l);
                theText.textContent = hexed;

                maxS = `hsl(${h}, ${100}%, ${l}%)`;
                sRange.style.background = `linear-gradient(to right, ${minS}, ${maxS})`;
                lRange.style.background = `linear-gradient(to right, black, hsl(${h}, ${s}%, ${l}%), white)`;

                checkContrast(slot.style.background, slot);
            });

            sRange.addEventListener("input", () => {
                s = sRange.value;
                slot.style.background = `hsl(${h}, ${s}%, ${l}%)`;
                hexed = hslToHex(h, s, l);
                theText.textContent = hexed;

                lRange.style.background = `linear-gradient(to right, black, hsl(${h}, ${s}%, ${l}%), white)`;

                checkContrast(slot.style.background, slot);
            });

            lRange.addEventListener("input", () => {
                l = lRange.value;
                slot.style.background = `hsl(${h}, ${s}%, ${l}%)`;
                hexed = hslToHex(h, s, l);
                theText.textContent = hexed;

                maxS = `hsl(${h}, ${100}%, ${l}%)`;
                sRange.style.background = `linear-gradient(to right, ${minS}, ${maxS})`;

                checkContrast(slot.style.background, slot);
            });
        } 
    });
};

//checks contrast of the text with it's background and proceeds accordingly
function checkContrast(bgColor, slot){
    let luminance = chroma(bgColor).luminance();
    if(luminance >= 0.5){
        slot.style.color = "#000";
    } else{
        slot.style.color = "#fff";
    }
}

//saves the new palette to local storage and adds it to the library
function savePalette(h, s, l) {
    slots.forEach(slot => {
        let color = slot.children[0].children[0].textContent;
        newPalette.push(color);
    });
    localStorage.setItem(pnameInput.value, newPalette);

    let palette = document.createElement("div");
    palette.className = "palette";
    palette.innerHTML = 
    `<h3>${pnameInput.value}</h3>
    
    <div class="colors-preview">
        <div class="color 0"></div>
        <div class="color 1"></div>
        <div class="color 2"></div>
        <div class="color 3"></div>
        <div class="color 4"></div>
        <button class="select-palette-btn">Select</button>
    </div>`;

    palattesFlex.appendChild(palette);

    let getPalatte = localStorage.getItem(`${pnameInput.value}`).split(",");

    selectBtns = document.querySelectorAll(".select-palette-btn");
    selectBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            [...slots].forEach(slot => {
                slot.style.background = getPalatte[[...slots].indexOf(slot)];
            });
        });
    });

    const colors = [...document.querySelectorAll(".color")];
    colors.forEach(color => {
        color.style.background = getPalatte[colors.indexOf(color)];
    });

    pnameInput.value = null;
}

//the functionality for lock buttons
locks.forEach(lock => {
    lock.addEventListener("click", () => {
        if(lock.classList.contains("fa-lock-open")){
            lock.className = "fas fa-lock lock";
            lock.parentElement.parentElement.classList.add("locked");
        } else{
            lock.className = "fas fa-lock-open lock";
            lock.parentElement.parentElement.classList.remove("locked");
        }
    });
});

//the animation when adjustments window is opened
adjusts.forEach(adj => {
    adj.addEventListener("click", () => {
        let theModal = adj.parentElement.nextElementSibling;
        theModal.style.pointerEvents = "auto";
        theModal.style.animation = "open 1s ease forwards";
        theModal.addEventListener("animationend", () => {
            theModal.style.animation = "";
            theModal.style.bottom = "0";
            theModal.style.opacity = "1";
        });
    });
});

//the functionality for close buttons in adjustment windows
closeAdjustBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        let theModal = btn.parentElement;
        theModal.style.pointerEvents = "none";
        theModal.style.animation = "close 1s ease forwards";
        theModal.addEventListener("animationend", () => {
            theModal.style.animation = "none";
            theModal.style.bottom = "-25%";
            theModal.style.opacity = "0";
        });
    });
});

refresh()

//main buttons

//the functionality for library button
libraryBtn.addEventListener("click", () => {
    overlay2.style.pointerEvents = "auto";
    overlay2.style.opacity = "1";
    gsap.from(".pick-section", {y:-150, duration: 0.5});
    gsap.from(".pick-section", {opacity: 0, duration: 0.5, delay:0.15});

    libraryBtn.firstChild.style.animation = "pop 0.25s ease forwards";
    libraryBtn.firstChild.addEventListener("animationend", (e) => e.target.style.animation = "");
});

//the functionality for refresh button
refreshBtn.addEventListener("click" , () => {
    refreshBtn.firstChild.style.animation = "rotate 0.25s ease forwards";
    refreshBtn.firstChild.addEventListener("animationend", () => {
        refreshBtn.firstChild.style.animation = "";
    });
    refresh();
});

//the functionality for save button
saveBtn.addEventListener("click", () => {
    saveBtn.firstChild.style.animation = "pop 0.25s ease forwards"
    saveBtn.firstChild.addEventListener("animationend", (e) => e.target.style.animation = "");
    overlay.style.pointerEvents = "auto";
    overlay.style.opacity = "1";
    
});

//the functionality for close button in save modal
closeSaveBtn.addEventListener("click", () => {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
});

//the functionality for close button in library modal
closeLibraryBtn.addEventListener("click", () => {
    overlay2.style.opacity = "0";
    overlay2.style.pointerEvents = "none";
});

//the functionality for the final button for saving the palette
saveNameBtn.addEventListener("click", () => {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    savePalette();

});

//copies the chosen hex value to clipboard
const hexCodes = document.querySelectorAll(".hex-code");
hexCodes.forEach(hex => {
    hex.addEventListener("click", () => {
        navigator.clipboard.writeText(hex.textContent);
        hex.style.animation = "pop 0.5s ease-in-out forwards";
        gsap.to(".copied", {y:-50, duration:0.25});
        gsap.to(".copied", {y:0, duration:0.25, delay:0.5});
    });
});




// this piece of code is imported
//turns hsl color to it's hex equivalent
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}