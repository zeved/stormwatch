var socket = null;
let strikes = [], closest, range = 30;

var swInit = () => {
    if("WebSocket" in window) {
        try {
            socket = new WebSocket("ws://ws.blitzortung.org:8082");
        }
        catch (e) {
            console.error(e);
        }

        socket.onopen = () => {
            socket.send("{\"sig\":false}");
        };

        socket.onmessage = (e) => {
            swPlaceLightning(e.data);
        }

        socket.onclose = () => {
            console.warn("[-] connection to WebSocket closed");
        }
    }
    else
        console.error("[-] WebSockets not supported by browser.");

    swComputeClosest();
}

var swPlaceLightning = (lightningJSON) => {
    var json = JSON.parse(lightningJSON);
    var position = new google.maps.LatLng(json.lat, json.lon);

    var strike = new google.maps.Marker({
        map: map,
        position: position,
        icon: "assets/img/flash-recent.png"
    });

    strikes.push(json);
}


function swComputeDistance(lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p)/2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p))/2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

var swComputeClosest = () => {
    var distance = 99999999;
    for(var strike in strikes) {
        var d = swComputeDistance(strikes[strike].lat, strikes[strike].lon, homeMarker.position.lat(), homeMarker.position.lng());
        if(d < distance)
            distance = d;
    }
    var oldClosest = closest;
    closest = distance;

    if(closest < range)
        swLightningAlert(closest);

    swUpdateClosest(closest);
    setTimeout(swComputeClosest, 5000);
};

var swUpdateClosest = (closest) => {
    $("#closest").val(closest.toFixed(2));
};

var swLightningAlert = (distance) => {
    $("#distance").text(distance + " km away");
    $("#alert").dimmer('toggle');
};
