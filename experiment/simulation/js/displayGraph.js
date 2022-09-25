import { graph } from "./randomGraph.js";
import { showEdge } from "./showEdges.js";
export let cy = cytoscape({
    container: document.getElementById('diagram'),
    elements: [
        { data: { id: '0' } },
        { data: { id: '1' } },
        { data: { id: '2' } },
        { data: { id: '3' } },
        { data: { id: '4' } },
        { data: { id: '5' } },
        { data: { id: '6' } }],
    style: [
        {
            selector: 'node',
            style: {
                'background-color': 'pink',
                label: 'data(id)',
                'text-valign': 'center',
                'text-halign': 'center'
            }
        },
        {
            selector: 'edge',
            style: {
                'curve-style': 'bezier',
                'target-arrow-shape': 'triangle',
                'line-color': "lightgreen",
                'width': 3,
                label: 'data(label)'
            }
        }
    ]
});
export function addEdges(graphNum) {
    cy.nodes('[id=\'' + '0' + '\']').style('background-color','violet',);
    for (let node in graph) {
        let src = graph[node].source.toString();
        let dest = graph[node].target.toString();
        let weight = graph[node].weight.toString();
        let edgeId = src + ":" +dest;
        if(graphNum !== null){
            edgeId = graphNum.toString() + "-" + edgeId;
        }
        cy.add([
            { group: 'edges', data: { id: edgeId, source: src, target: dest, label: weight } }
        ]);
        showEdge(edgeId);
    }
}
cy.layout({ name: 'circle' }).run();
cy.zoomingEnabled(false);