//KeyBoard Inputs
document.addEventListener("keydown", event => {
    //Key Space. jump
    if (event.code === "Space") {
        //jump(3)
    }
})

let currentStation = 4;
let band = "C" // init value
let stationsUIBtn = ["to-overlay", "video-btn",
    "x-0", "x-1", "x-1-r", "x-2", "x-3", "x-4", "x-5",
    "b-0", "b-1", "b-2", "b-2-0", "b-2-1", "b-3", "b-3-1", "b-3-2", "b-3-3", "b-3-4", "b-3-5", "b-3-6", "b-3-7", "b-4", "b-5",
    "soft-vid-btn-1", "soft-vid-btn-0", "lidar-vid-btn-0"]

let is_in_new_p = false
//Mouse Listener
document.addEventListener("pointerdown", event => {
    //avoid clicking while animiting
    if (isAnimatingCam) {
        return
    }

    if (event.target.id == "quiz-screen") {
        toNextQuestion();
    }

    //INTERACT ONE TIME TO PLAY VIDEO ON SCREEN
    if (logo_anim_vid.video.paused) {
        logo_anim_vid.video.play();
    }

    //X CLOSE ICON PRESSED
    if (event.target.classList.contains("icon-close")) {
        CloseParentOverlay(event)
        document.getElementById("software-video-content").children[0].src = ""
    }

    //X CLOSE ICON PRESSED
    if (event.target.classList.contains("icon-back")) {
        document.getElementsByClassName("layer1")[0].parentNode.classList.remove("close")
        document.getElementsByClassName("layer2")[0].parentNode.classList.add("close")
    }
    if(event.target.id=="open-video"){
        document.getElementsByClassName("layer2")[0].parentNode.classList.add("close")
        document.getElementsByClassName("layer3")[0].parentNode.classList.remove("close")
        document.getElementById("software-video-content").children[0].src = "https://www.youtube.com/embed/G-AYEt6bmlM" 
    }

    if(event.target.classList.contains("ui-collider")){
        document.getElementsByClassName("layer1")[0].parentNode.classList.add("close")
        document.getElementsByClassName("layer2")[0].parentNode.classList.remove("close")
    }

    console.log(event.target)
    // REveal DEbugger
    if (event.target.id.startsWith("debugger")) {
        event.target.parentNode.style.opacity = 1;
    }
    //UI Button Click
    else if (event.target.classList.contains("menu-group")) {
        //handle kamera fahrt
        if(event.target.id=="agenda-btn" || event.target.id=="chat-btn"){
            return;
        }
        if(event.target.classList.contains("hasCam")){
            closeOverlayBlockers();
            MenuUIListener(event)
            toFirstQuestion()

        }
        handlePressedMenu(event)
        //handle aufklappen

    }
    else if (event.target.classList.contains("station-names-text") || event.target.id == "sn-4") {
        if(event.target.id=="sn-5"){
            document.getElementById("sn-1").classList.toggle("hidden-box")
            document.getElementById("sn-0").classList.toggle("hidden-box")
            event.target.classList.toggle("hidden-box")
            let children = document.getElementsByClassName("c-1")
            for (let child of children){
                child.classList.toggle("hidden-box")
            }
            return
        }

        console.log(event.target.id)
        StationNameCliked(event)
        toFirstQuestion()

    }
    //Stations UI Button Click
    else if (stationsUIBtn.includes(event.target.id)) {
        OverlayUIListener(event.target.id)
    }

    //solution and services submenus
    else if (event.target.id.startsWith("solserv-")) {
        let index = parseInt(event.target.id.charAt(8))
        UISolutionPressed(index)
    }

    else if (event.target.id == "impressum-btn") {
        document.getElementsByClassName("impressumArea")[0].classList.toggle("close")
    }
    //avoid having to click again on UI to be able to move in walkercam
    else {
        if (scene.activeCamera == walkerCam) {
            ToWalkerMode()
        }
    }
})

function handleParentStickers(ev){
    
}
function handlePressedMenu(ev){
    if(ev.target.classList.contains("p-1")){
        let children = document.getElementsByClassName("c-1")
        for (let child of children){
            child.classList.toggle("hidden-box")
        }
        document.getElementById("sn-1").classList.toggle("hidden-box")
        document.getElementById("sn-0").classList.toggle("hidden-box")
        document.getElementById("sn-5").classList.toggle("hidden-box")
    }
    else if(ev.target.classList.contains("p-2")){
        let children = document.getElementsByClassName("c-2")
        for (let child of children){
            child.classList.toggle("hidden-box")
        }
    }
    else if(ev.target.classList.contains("p-3")){
        let children = document.getElementsByClassName("c-3")
        for (let child of children){
            child.classList.toggle("hidden-box")
        }
    }
}

function CloseParentOverlay(ev){
    let papa = ev.target.parentNode.parentNode.parentNode.parentNode
    papa.classList.add("close")
}
function StationNameCliked(ev) {


    let childElem = ev.target
    document.getElementById("station-names").style.display = "none"
    if (childElem.id.startsWith("sn-")) {
        let stationIndex = parseInt(childElem.id.charAt(3))
        //handleUISelection(childElem, stationIndex)
        travelCamToStation(stationIndex)
        if(stationIndex == 1){
            scene.getMeshByName("Collider Weather_C_P").isPickable=true
        }
        if (stationIndex == 2) {
            ShowDigilounge(true)
        }
        else {
            ShowDigilounge(false)
        }
    }
}
// OVERLAY UI Solutions
function UISolutionPressed(index) {
    let elem = document.getElementById("solution-content-" + index)
    elem.classList.remove("close")
    document.getElementsByClassName("station-content")[3].classList.add("close")
}

//  HANDLE OVERLAY UI BTNS 
function setRadarSelection(band) {
    setRadarSelection_sideEffects()

    document.getElementsByClassName("main-menus")[0].classList.add("close")
    if (scene.activeCamera == walkerCam) {
        ToRadarMode(band)
    }
    ShowSelectedRadar(band)
    //let radarElem = document.getElementById("ra-" + band)
    //ToggleSubmenuSelection(radarElem)
}

function setRadarSelection_sideEffects() {
    closeOverlays(1, false)
}

function closeOverlayBlockers(){
    let overlays = document.getElementsByClassName("overlay-blocker");
    for(let ov of overlays){
        ov.classList.add("close")
    };
    document.getElementById("software-video-content").children[0].src = ""
}

function closeOverlay_sideEffects(index) {
    if (index != 5 && index != 2)
        travelCamToStation(index)
}

let menuStationsDict = { 0: "computer", 1: "mediation", 2: "toys", 3: "home_repair_service", 4: "contact_page", 5: "school", 6: "toys" }
//HANDLE STATION NAMES VISIBILITY
function restartUI(index) {
    
    //HANDLE STATION NAMES VISIBILITY
    if (index == 4) {
        //show stationames
        document.getElementById("station-names").style.display = "initial"

        let children1 = document.getElementsByClassName("c-1")
        for (let child of children1){
            child.classList.add("hidden-box")
        }
        let children2 = document.getElementsByClassName("c-2")
        for (let child of children2){
            child.classList.add("hidden-box")
        }

        let children3 = document.getElementsByClassName("c-3")
        for (let child of children3){
            child.classList.add("hidden-box")
        }

        document.getElementById("sn-1").classList.add("hidden-box")
        document.getElementById("sn-0").classList.add("hidden-box")
        document.getElementById("sn-5").classList.remove("hidden-box")

        

        disableAllColliders();
    }
    else{
        enableCollidersOnStation(index)
    }

}
let StationColliders
function enableCollidersOnStation(index){
    if(index != 1 && index != 3){
        return;
    }
    if(index == 1){
        scene.getMeshByName("Collider Weather_C_P").isPickable=true
    }
    else if(index == 3){
        scene.getMeshByName("ms_1").isPickable=true
        scene.getMeshByName("ms_2").isPickable=true
        scene.getMeshByName("ms_3").isPickable=true
        scene.getMeshByName("ms_4").isPickable=true
    }
}
function disableAllColliders(){
    scene.getMeshByName("Collider Weather_C_P").isPickable=false
    scene.getMeshByName("ms_1").isPickable=false
    scene.getMeshByName("ms_2").isPickable=false
    scene.getMeshByName("ms_3").isPickable=false
    scene.getMeshByName("ms_4").isPickable=false
    
}
function hideMenuControl() {
    document.getElementsByClassName("overlay-weather-btns")[0].classList.add("close")
    document.getElementById("to-overlay").innerHTML = ""
}


// SHOW DIGILOUNGE
function ShowDigilounge(show) {
    if (show) {
        window.setTimeout(() => {
            document.getElementById("howto-overlay").classList.remove("close")
            document.getElementById("chat").classList.remove("close")
            document.getElementById("chat-x").classList.add("close")
        }, 1500)

    }
    else {
        document.getElementById("howto-overlay").classList.add("close")
        document.getElementById("chat").classList.add("close")
        document.getElementById("chat-x").classList.remove("close")
    }
}


function MenuUIListener(ev) {
    let childElem;
    if(!ev.target.children[1]){
        childElem = ev.target.children[0]
    }
    else{
        childElem = ev.target.children[1]
    }


    if (childElem.id.startsWith("go-")) {
        console.log(childElem.id)
        let stationIndex = parseInt(childElem.id.charAt(3))
        //handleUISelection(childElem, stationIndex)
        travelCamToStation(stationIndex)
        if (parseInt(childElem.id.charAt(3)) != 4) {
            //show stationames
            document.getElementById("station-names").style.display = "none"
        }
        if (stationIndex == 1) {
            scene.getMeshByName("Collider Weather_C_P").isPickable=true
        }
        if(stationIndex != 3 && getComputedStyle(document.getElementById("overlay-ms"), null).display !="none" ){
            document.getElementById("overlay-ms").classList.add("close")
        }
        if(stationIndex == 4){
            closeOverlayBlockers();
        }
        if (stationIndex == 2) {
            ShowDigilounge(true)
        }
        else {
            ShowDigilounge(false)
        }


    }
}

let lastMenuSelection
let radarsUI = document.getElementsByClassName("sub3")
let pdfsUI = document.getElementsByClassName("sub1")
function handleUISelection(elem, stationIndex) {
    console.log(elem)
    console.log(stationIndex)
    if (lastMenuSelection != undefined) {
        lastMenuSelection.classList.remove("menu-selected")
        lastMenuSelection.parentNode.children[1].classList.remove("dot-selected")
    }
    lastMenuSelection = elem
    //elem.classList.add("menu-selected")
    //elem.parentNode.children[1].classList.add("dot-selected")
}

let lastSubmenuSelection
function ToggleSubmenuSelection(elem) {
    if (lastSubmenuSelection != undefined) {
        lastSubmenuSelection.classList.remove("menu-selected")
        lastSubmenuSelection.parentNode.children[1].classList.remove("dot-selected")
    }
    lastSubmenuSelection = elem
    elem.classList.add("menu-selected")
    elem.parentNode.children[1].classList.add("dot-selected")
}



