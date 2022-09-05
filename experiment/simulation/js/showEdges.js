"use strict";
let svgns = "http://www.w3.org/2000/svg";
export function showEdge(edgeId) {
    let src = edgeId.split(":")[0];
    let dest = edgeId.split(":")[1];
    let writtenText = src + "-->" + dest;
    let newDiv = document.createElement("div");
    newDiv.id = "image"+edgeId;
    newDiv.className = "toolbar-component";
    newDiv.innerHTML = writtenText;
    document.getElementById("toolbar").appendChild(newDiv);
}
export function hideEdge(edgeId) {
    let element = document.getElementById("image"+edgeId);
    element.parentNode.removeChild(element);
}
