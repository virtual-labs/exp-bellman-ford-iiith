'use strict';
import { numEdges, graph } from "./randomGraph.js";
import { cy } from "./displayGraph.js";
import { refreshWorkingArea, removeEdges } from "./demo.js";

const observ = document.getElementById("observations");
const EMPTY = "";

let iter = 0;
let edge = 0;
let decide = true;
let numNodes = 7;

let states = {};

export function fillStates() {
    let d = Array(numNodes).fill(1e7);
    let p = Array(numNodes).fill(-1);
    d[0] = 0;
    p[0] = 0;
    for (let i = 0; i < numNodes; ++i) {
        for (let j = 0; j < numEdges; ++j) {
            const edgeId = graph[j].source.toString() + ":" + graph[j].target.toString();
            const key = i.toString() + "-" + edgeId;
            let tempState = {};
            if (d[graph[j].source] + graph[j].weight < d[graph[j].target] && d[graph[j].source] + graph[j].weight < 1e6) {
                d[graph[j].target] = d[graph[j].source] + graph[j].weight;
                p[graph[j].target] = graph[j].source;
                tempState["change"] = true;
            } else {
                tempState["change"] = false;
            }
            tempState["distance"] = d.slice();
            tempState["parent"] = p.slice();
            states[key] = tempState;
        }
    }
}

function restoreColor(arrayColor, edgeColor,imageColor) {
    for (let i = 0; i < numNodes; i++) {
        document.getElementById("text" + i.toString()).style.fill = arrayColor;
        document.getElementById("parent" + i.toString()).style.fill = arrayColor;
    }
    cy.edges().style('line-color', edgeColor);
    for(let i=0;i<numEdges;i++){
        const edgeId = graph[i].source.toString() + ":" + graph[i].target.toString();
        document.getElementById("image"+edgeId).style.backgroundColor = imageColor;
    }
}

function changeColor(color, nodeNum, edgeId) {
    document.getElementById("text" + nodeNum.toString()).style.fill = color;
    document.getElementById("parent" + nodeNum.toString()).style.fill = color;
    document.getElementById("image" + edgeId).style.backgroundColor = color;
    cy.edges('[id=\'' + edgeId + '\']').style('line-color', color);
}

function changeArray(distance, parent) {
    for (let i = 0; i < numNodes; i++) {
        if (distance[i] < 1e6) {
            document.getElementById("text" + i.toString()).innerHTML = distance[i].toString();
        } else {
            document.getElementById("text" + i.toString()).innerHTML = "INF";
        }
        document.getElementById("parent" + i.toString()).innerHTML = parent[i].toString();
    }
}

function run(key) {
    // check if color of current edge is red
    const edgeId = key.split("-")[1];
    restoreColor("black", "lightgreen","rgb(202, 252, 202)");
    changeArray(states[key]["distance"], states[key]["parent"]);
    let dest = parseInt(edgeId.split(":")[1]);
    if (states[key].change) {
        observ.innerHTML = "Current Iteration: " + iter.toString() + " Current Edge: " + edge.toString();
        observ.innerHTML += "<br> The distance to node " + dest.toString() + " is updated to " + states[key]["distance"][dest].toString();
        changeColor("red", dest, edgeId);
    } else {
        observ.innerHTML = "Current Iteration: " + iter.toString() + " Current Edge: " + edge.toString();
        observ.innerHTML += "<br> The distance to node " + dest.toString() + " is not updated";
        changeColor("yellow", dest, edgeId);
    }
}

export function restartCircuit() {
    removeEdges();
    edge = 0;
    iter = 0;
    decide = true;
    observ.innerHTML = EMPTY;
    for (let i = 0; i < numNodes; i++) {
        document.getElementById("text" + i.toString()).style.fill = "black";
        document.getElementById("parent" + i.toString()).style.fill = "black";
        if (i == 0) {
            document.getElementById("text" + i.toString()).textContent = "0";
            document.getElementById("parent" + i.toString()).textContent = "0";
        } else {
            document.getElementById("text" + i.toString()).textContent = "INF";
            document.getElementById("parent" + i.toString()).textContent = "-1";
        }
    }
    refreshWorkingArea();
}

export function simulationStatus() {
    if(!decide) {
        edge++;
    }
    decide = true;        
    if (edge == numEdges) {
        edge = 0;
        iter++;
    }
    if (iter == (numNodes - 1)) {
        observ.innerHTML = "Simulation finished";
    }
    else {
        let src = graph[edge].source;
        let dest = graph[edge].target;
        const edgeId = src.toString() + ":" + dest.toString();
        const key = iter.toString() + "-" + edgeId;
        run(key);
        edge++;
    }
}

export function previousSimulation(){

    if(decide){
        if(edge == 0)
        {
            if(iter == 0)
            {
                observ.innerHTML = "Can't go back";
                return;
            }
            iter--;
            edge = numEdges-1;
        }
        else{
            edge--;
        }
    }
    decide = false;
    if(edge == 0)
    {
        if(iter == 0)
        {
            observ.innerHTML = "Can't go back";
            return;
        }
        iter--;
        edge = numEdges-1;
    }
    else{
        edge--;
    }
    let src = graph[edge].source;
    let dest = graph[edge].target;
    const edgeId = src.toString() + ":" + dest.toString();
    const key = iter.toString() + "-" + edgeId;
    run(key);

}