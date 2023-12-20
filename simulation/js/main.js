'use strict';
import { states, numNodes } from "./randomGraph.js";
import { cy } from "./displayGraph.js";
import { refreshComponents, changeColorGraph, colorPreviousEdges, areEqual, showInfo } from "./helper.js";

const observ = document.getElementById("observations");

window.refreshWorkingArea = refreshWorkingArea;
window.openIteration = openIteration;
window.submitIteration = submitIteration;
window.showInfo = showInfo;

let currentIteration = 0;
let selectedIteration = 0;
let edgeList = [];

export function pastIteration(iteration) {
    const key = iteration;
    let distance = states[key]["distance"];
    let parent = states[key]["parent"];
    for (let i = 0; i < numNodes; i++) {
        if (distance[i] < 1e6) {
            document.getElementById("text" + i.toString()).innerHTML = distance[i].toString();
            document.getElementById("parent" + i.toString()).innerHTML = parent[i].toString();
        }
    }
}


function submitIteration() {
    if (currentIteration > 5) {
        return;
    }
    // check if the elemenst in edgeList are same as the states[currentIteration].selectedEdges
    if (areEqual(edgeList, states[currentIteration].selectedEdges)) {
        observ.style.color = "green";
        observ.innerHTML = "Correct Answer";
        currentIteration++;
        edgeList = [];
        changeColorGraph("lightgreen");
        if (currentIteration <= 5)
            document.getElementById("iteration" + currentIteration.toString()).click();
    } else {
        observ.style.color = "red";
        observ.innerHTML = "Incorrect Answer"
    }
}

function openIteration(evt, iterNumber) {
    if (currentIteration >= parseInt(iterNumber[iterNumber.length - 1])) {
        selectedIteration = parseInt(iterNumber[iterNumber.length - 1])
        // remove classname is-active from id iteration0 to iteration 5
        for(let iter = 0 ;iter <numNodes-1;iter++){
            document.getElementById("iteration" + iter.toString()).classList.remove("is-active")
        }
        evt.currentTarget.className += " is-active";
        changeColorGraph("lightgreen");
        if (currentIteration > parseInt(iterNumber[iterNumber.length - 1])) {
            pastIteration(iterNumber[iterNumber.length - 1]);
            colorPreviousEdges(states[iterNumber[iterNumber.length - 1]].selectedEdges)
        } else if (currentIteration !== 0) {
            pastIteration((currentIteration - 1).toString())
        }
        if(selectedIteration === 5){
            document.getElementById("submit").innerHTML = "Submit";
        }
        else{
            document.getElementById("submit").innerHTML = "Next Iteration";
        }
    }
}


export function refreshWorkingArea() {
    for (let i = 0; i < numNodes; i++) {
        if (i === 0) {
            document.getElementById("text" + i.toString()).textContent = "0";
            document.getElementById("parent" + i.toString()).textContent = "0";
        } else {
            document.getElementById("text" + i.toString()).textContent = "INF";
            document.getElementById("parent" + i.toString()).textContent = "-1";
        }
    }
    currentIteration = 0;
    selectedIteration = 0;
    edgeList = [];
    refreshComponents();
}
cy.on('tap', 'edge', function (evt) {
    if (currentIteration === selectedIteration) {
        let edge = evt.target;
        if (edgeList.includes(edge.id())) {
            edgeList.splice(edgeList.indexOf(edge.id()), 1);
            edge.style('line-color', 'lightgreen');
        }
        else {
            edgeList.push(edge.id());
            edge.style('line-color', 'red');
        }
    }
});
refreshWorkingArea();