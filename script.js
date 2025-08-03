function dragElement(noteElement){
    let currX = 0, currY = 0, newX = 0, newY = 0;
    noteElement.onpointerdown = pointerDrag;





function pointerDrag(e){
    e.preventDefault(); // prevents any default actions that might occur when the even is triggered
    console.log(e);
    currX = e.clientX;
    currY = e.clientY;
    document.onpointermove = elementDrag;
    document.onpointerup = stopElementDrag;
}

function elementDrag(e) {
    newX = currX - e.clientX;   // how much has the mouse moved sinec the last event
    newY = currY - e.clientY;
    currX = e.clientX;   //update the current position
    currY = e.clientY;

    noteElement.style.top = (noteElement.offsetTop - newY) + 'px'; //translate the movement
    noteElement.style.left = (noteElement.offsetLeft - newX) + 'px';

}

function stopElementDrag() {
    document.onpointerup = null;    //removes the event listener for the pointerup event
    document.onpointermove = null;  //removes the event listener for the pointermove event
}

}

dragElement(document.getElementById("note1"));
dragElement(document.getElementById("note2"));
dragElement(document.getElementById("note3"));
