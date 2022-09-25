"use strict";
import { graph,clearGraph } from "./randomGraph.js";
import { cy } from "./displayGraph.js";
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

export function removeEdges(){
    for(const edge of graph){
        let src = edge.source.toString();
        let dest = edge.target.toString();
        let edgeId = src + ":" +dest;
        hideEdge(edgeId);
    }
    cy.remove(cy.edges());
    // empty graph
    clearGraph();
}