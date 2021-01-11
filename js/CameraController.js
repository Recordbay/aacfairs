let lastRadarLooked = "C"
let lastPdfLooked = "1"
function CheckLookingAtNew() {

    if (gazingAt == "C" || gazingAt == "X" || gazingAt == "S") {
        if (document.getElementById('debugger-text').innerHTML.charAt(17) != lastRadarLooked) {
            //change radar position
            let newPos = new BABYLON.Vector3(RadarPositions[BandToIndex(gazingAt)].x, 25, RadarPositions[BandToIndex(gazingAt)].z)
            radarSpotLight.position = newPos
            lastRadarLooked = document.getElementById('debugger-text').innerHTML.charAt(17)

            //Shine stronger for gazed
            for (let i = 0; i < Led_Radar_Mats.length; i++) {
                if (i == BandToIndex(gazingAt)) {
                    Led_Radar_Mats[i].emissiveColor = new BABYLON.Color3.FromHexString("#616161")
                }
                else {
                    Led_Radar_Mats[i].emissiveColor = new BABYLON.Color3.FromHexString("#242424")
                }
            }
        }
    }

    else if (gazingAt == "1" || gazingAt == "2" || gazingAt == "3" || gazingAt == "4" || gazingAt == "5" || gazingAt == "6" || gazingAt == "7") {
        if (document.getElementById('debugger-text').innerHTML.charAt(13) != lastPdfLooked) {
            lastPdfLooked = document.getElementById('debugger-text').innerHTML.charAt(13)

            //Shine stronger for gazed
            for (let i = 1; i < Led_Pdf_Mats.length; i++) {
                if (i == parseInt(gazingAt)) {
                    Led_Pdf_Mats[i].emissiveColor = new BABYLON.Color3.FromHexString("#242424")
                }
                else {
                    Led_Pdf_Mats[i].emissiveColor = new BABYLON.Color3.FromHexString("#000000")
                }
            }
        }
    }
}

function BandToIndex(letter) {
    if (letter == "C")
        return 0
    else if (letter == "X")
        return 1
    else if (letter == "S")
        return 2
}

//Change Camera Modes
function ToWalkerMode() {

    if(scene.activeCamera == rotateCam){
        rotateCam.detachControl(canvas);
        scene.activeCamera = walkerCam;
        walkerCam.minZ = 0.05

        HandleMatsTransparency(MainSceneMats, 1)
        for (let i = 0; i < Radar_Mats.length; i++) {
            HandleMatsTransparency(Radar_Mats[i], 1)
        }
    
        //Move Prodcts new middle
        Weather_C_P.position = RadarPositions[0]
        Weather_X_P.position = RadarPositions[1]
        Weather_S_P.position = RadarPositions[2]
    
        console.log('WALKER MODE')
        document.getElementsByClassName("overlay-weather-btns")[0].classList.add("close")
        document.getElementsByClassName("view-3d-btn")[0].classList.add("close")
    }

}

function ToRadarMode(band) {
    let currentBand = scene.getTransformNodeByName("Weather_" + band + "_P")
    travelCamToRadar(currentBand.getAbsolutePosition(), band)
    walkerCam.minZ = 10
    //Transparency
    HandleMatsTransparency(MainSceneMats, 0)
    //Move Prodcts new middle
    window.setTimeout(() => {
        Weather_C_P.position = currentBand.position
        Weather_X_P.position = currentBand.position
        Weather_S_P.position = currentBand.position
    }, 500)

    console.log('RADAR MODE')
    document.getElementsByClassName("overlay-weather-btns")[0].classList.remove("close")
    document.getElementsByClassName("view-3d-btn")[0].classList.remove("close")

}

//Settings for Rotate Camera, called onComplete travelCamToRadar
let firstCall = true
function ChangeToRotCam() {
    isAnimatingCam = false
    if (!isMobileDevice()) {
        document.exitPointerLock();
    }
    //document.exitPointerLock();
    if (!firstCall) {
        let currentBand = scene.getTransformNodeByName("Weather_" + band + "_P")
        scene.activeCamera = rotateCam;
        rotateCam.attachControl(canvas, true, false, false);
        rotateCam.setTarget(new BABYLON.Vector3(currentBand.getAbsolutePosition().x, 14.07, currentBand.getAbsolutePosition().z));
        rotateCam.alpha = Math.PI / 2 + Math.PI / 4
        rotateCam.beta = 90 * (Math.PI / 180)
        rotateCam.radius = 28.28;
    }
    firstCall = false
}

//returns true if player checks in area
let lastCheckIn
function CheckIn(area) {
    if (lastCheckIn == undefined || lastCheckIn != area) {
        lastCheckIn = area
        console.log("CheckIN")
        return true
    }
    
    else {
        return false
    }

}

//Function for Swapping Radars, not used anymore
let currentBandSelection = 0
function SwapRadar(val) {
    currentBandSelection = currentBandSelection + val
    if (currentBandSelection > 2)
        currentBandSelection = 0
    else if (currentBandSelection < 0)
        currentBandSelection = 2

    for (let i = 0; i < Radar_Mats.length; i++) {
        if (i == currentBandSelection) {
            HandleMatsTransparency(Radar_Mats[i], 1)
        }
        else {
            HandleMatsTransparency(Radar_Mats[i], 0)
        }

    }
}
