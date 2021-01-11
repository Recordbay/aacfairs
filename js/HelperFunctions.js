showDebug = true;

$(document).keyup(function (e) {
    //"m" pressed
    if (e.keyCode === 77) { handleDebugLayer(); }
});

//Calculate Stuff
function A_LooksAt_B(A, B) {
    lookValue = A.position.subtract(B.position);
    A.rotation.y = -Math.atan2(lookValue.z, lookValue.x) + Math.PI / 2;
}

function handleDebugLayer() {
    console.log("d pressed")
    if (scene.debugLayer.isVisible()) {
        scene.debugLayer.hide()
    } else {
        scene.debugLayer.show()
    }
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

//loading screen
BABYLON.DefaultLoadingScreen.prototype.displayLoadingUI = function () {
    if (document.getElementById("customLoadingScreenDiv")) {
        document.getElementById("customLoadingScreenDiv").style.display = "initial";
        // Do not add a loading screen if there is already one
        return;
    }
};

BABYLON.DefaultLoadingScreen.prototype.hideLoadingUI = function () {
    document.getElementById("customLoadingScreenDiv").style.display = "none";
    console.log("scene is now loaded");
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }