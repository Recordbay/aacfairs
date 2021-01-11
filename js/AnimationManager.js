//Camera Animations
function jumpCamTo(i) {

    let newPos = AnchorPosition[i]
    // walkerCam.position = newPos //NOT WORKING WHY? -> call by value vs call by reference
    // walkerCam.position.x = newPos.x 
    // walkerCam.position.y = newPos.y
    // walkerCam.position.z = newPos.z
    walkerCam.position.copyFrom(newPos)
    walkerCam.setTarget(AnchorLookAt[i])

}

// RA
let CamTween = gsap.timeline({ onComplete: zCamReset });
let isAnimatingCam = false
function travelCamToStation(i) {
    currentStation = i;
    console.log("CURRENT STATION IS" + i)
    isAnimatingCam = true
    //handle Z depth crossing mesh
    walkerCam.minZ = 15
    CamTween.to(walkerCam.position, { x: AnchorPosition[i].x, z: AnchorPosition[i].z, duration: 1.5 })
    let v0 = AnchorPosition[i]
    let v1 = AnchorLookAt[i].subtract(v0);

    v1.normalize();
    let angleAlpha = Math.atan2(v1.z, v1.x)
    console.log(BABYLON.Tools.ToDegrees(Math.PI / 2 - angleAlpha))
    //alert(BABYLON.Tools.ToDegrees(Math.PI/2 - angleAlpha))
    //walkerCam.rotation.y = Math.PI/2 - angleAlpha
    if (i == 5)
        CamTween.to(walkerCam.rotation, { x: 0, y: Math.PI * 2 + Math.PI / 2 - angleAlpha, ease: "power2.out", duration: 1.5 }, "<")
    else
        CamTween.to(walkerCam.rotation, { x: -0.05, y: Math.PI / 2 - angleAlpha, ease: "power2.out", duration: 1.5 }, "<")

    travelCamToStation_sideEffects(i)
}

function travelCamToStation_sideEffects(i) {
    // SHOW UI After Camera Animation animating
    window.setTimeout(() => {
        restartUI(i)
    }, 1500)
}

function zCamReset() {
    if (walkerCam != undefined) {
        isAnimatingCam = false
        walkerCam.minZ = 0.05
    }

}

let CamRadarAnim = gsap.timeline({ onComplete: ChangeToRotCam });
function travelCamToRadar(endPos) {
    isAnimatingCam = true
    CamRadarAnim.to(walkerCam.position, { x: endPos.x - 20, z: endPos.z + 20, duration: 1.5 })
    CamRadarAnim.to(walkerCam.rotation, { x: 0, y: Math.PI / 2 + Math.PI / 4, duration: 1.5 }, "<")
}

//Radar swapping
function ShowSelectedRadar(band) {
    Radar_Mats.forEach(matGroup => {
        if (matGroup[0].charAt(0) == band) {
            console.log("pass")
            HandleMatsTransparency(matGroup, 1)
        }
        else {
            HandleMatsTransparency(matGroup, 0)
        }
    })

}

let AnimRate = 0
let AnimSlower = 0.25
function AnimateEveryFrame() {
    AnimRate++
    //console.log(AnimRate)
    if (DiscoverMeshes[0] != undefined) {
        DiscoverMeshes[0].rotation.y = AnimRate * 0.5 * (Math.PI / 180)
        DiscoverMeshes[1].rotation.y = AnimRate * 0.5 * (Math.PI / 180)
        DiscoverMeshes[2].rotation.y = AnimRate * 0.5 * (Math.PI / 180)
        DiscoverMeshes[3].rotation.y = AnimRate * 0.5 * (Math.PI / 180)
    }
    //CheckLookingAtNew()
}
// Mat Animations
async function HandleMatsTransparency(matGroup, toValue) {
    if (toValue == 0) {
        await unlitMainMats(matGroup, true)
        await FadeMainMaterials(matGroup, toValue)
    }
    else {
        await unlitMainMats(matGroup, false)
        await FadeMainMaterials(matGroup, toValue)
    }

}
async function FadeMainMaterials(matGroup, toValue) {

    let fadeAnim = gsap.timeline()
    for (let mat of matGroup) {
        fadeAnim.to(mat, { alpha: toValue, duration: 0.5 }, "<")
    }
}

async function unlitMainMats(matGroup, state) {
    for (let mat of matGroup) {
        mat.unlit = state
    }
}

