'use strict';
import { makeGraph, states, numEdges, graph } from "./randomGraph.js";
import { addEdges, cy } from "./displayGraph.js";
import { removeEdges } from "./demo.js";

const observ = document.getElementById("observations");
window.refreshWorkingArea = refreshWorkingArea;
window.openIteration = openIteration;
window.submitIteration = submitIteration;
window.showInfo = showInfo;
export let currentIteration = 0;
let selectedIteration = 0;
let edgeList = [];

function showInfo(){
    let info = document.getElementsByClassName("tooltiptext")[0];
    if(info.style.visibility === "visible"){
        info.style.visibility = "hidden";
    }
    else{
        info.style.visibility = "visible";
    }
}

function fillStates() {
    let numNodes = 7;
    let d = Array(numNodes).fill(1e7);
    let p = Array(numNodes).fill(-1);
    d[0] = 0;
    p[0] = 0;
    for (let i = 0; i < numNodes; ++i) {
        let tempState = {};
        let selectedEdges = [];
        for (let j = 0; j < numEdges; ++j) {
            const edgeId = graph[j].source.toString() + ":" + graph[j].target.toString();
            if (d[graph[j].source] + graph[j].weight < d[graph[j].target] && d[graph[j].source] + graph[j].weight < 1e6) {
                d[graph[j].target] = d[graph[j].source] + graph[j].weight;
                p[graph[j].target] = graph[j].source;
                selectedEdges.push(edgeId);
            }
        }
        tempState["selectedEdges"] = selectedEdges;
        tempState["distance"] = d.slice();
        tempState["parent"] = p.slice();
        states[i] = tempState;
    }
}


export function pastIteration(iteration) {
    const key = iteration;
    let distance = states[key]["distance"];
    let parent = states[key]["parent"];
    for (let i = 0; i < 7; i++) {
        if (distance[i] < 1e6) {
            document.getElementById("text" + i.toString()).innerHTML = distance[i].toString();
            document.getElementById("parent" + i.toString()).innerHTML = parent[i].toString();
        }
    }
}

function areEqual(array1, array2) {
    if (array1.length === array2.length) {
        return array1.every(element => {
            if (array2.includes(element)) {
                return true;
            }
            return false;
        });
    }
    return false;
}

function changeColorGraph(edgeColor) {
    cy.edges().style('line-color', edgeColor);
}

function colorPreviousEdges(selectedEdges) {
    selectedEdges.forEach((edgeId) => {
        cy.edges('[id=\'' + edgeId + '\']').style('line-color', "red");
    });
}

function submitIteration() {
    if (currentIteration > 5) {
        return;
    }
    // check if the elemenst in edgeList are same as the states[currentIteration].selectedEdges
    if (areEqual(edgeList, states[currentIteration].selectedEdges)) {
        observ.innerHTML = "Correct Answer";
        currentIteration++;
        edgeList = [];
        changeColorGraph("lightgreen");
        if (currentIteration <= 5)
            document.getElementById("iteration" + currentIteration.toString()).click();
    } else {
        observ.innerHTML = "Incorrect Answer"
    }
}

function openIteration(evt, cityName) {
    if (currentIteration >= parseInt(cityName[cityName.length - 1])) {
        selectedIteration = parseInt(cityName[cityName.length - 1])
        // remove classname is-active from id iteration0 to iteration 5
        for(let iter = 0 ;iter <6;iter++){
            document.getElementById("iteration" + iter.toString()).classList.remove("is-active")
        }
        evt.currentTarget.className += " is-active";
        changeColorGraph("lightgreen");
        if (currentIteration > parseInt(cityName[cityName.length - 1])) {
            pastIteration(cityName[cityName.length - 1]);
            colorPreviousEdges(states[cityName[cityName.length - 1]].selectedEdges)
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
    for (let i = 0; i < 7; i++) {
        if (i == 0) {
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
    removeEdges();
    makeGraph();
    addEdges(null);
    fillStates();
    document.getElementById("iteration0").click();
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