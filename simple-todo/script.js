function dragElement(noteElement){
    let currX = 0, currY = 0, newX = 0, newY = 0;
    noteElement.onpointerdown = pointerDrag;
    

    function pointerDrag(e){
        // Only drag if not clicking inside a textarea
        if (e.target.tagName.toLowerCase() === 'textarea') return;
        document.body.style.cursor = 'moving';
        e.preventDefault();
        currX = e.clientX;
        currY = e.clientY;
        document.onpointermove = elementDrag;
        document.onpointerup = stopElementDrag;
    }

    function elementDrag(e) {
        newX = currX - e.clientX;
        newY = currY - e.clientY;
        currX = e.clientX;
        currY = e.clientY;

        noteElement.style.top = (noteElement.offsetTop - newY) + 'px';
        noteElement.style.left = (noteElement.offsetLeft - newX) + 'px';
        
        
        const trashCan = document.getElementById('trashcan1');
        const trashRect = trashCan.getBoundingClientRect();
        const noteRect = noteElement.getBoundingClientRect();
       

        // Check if the note is over the trash can
        if (noteRect.right > trashRect.left && noteRect.left < trashRect.right &&
            noteRect.bottom > trashRect.top && noteRect.top < trashRect.bottom) {
            // If so, change the cursor to indicate deletion
            noteElement.style.transform = 'scale(0.80)'; // Optional: scale down for effect
            noteElement.style.transition = 'transform 0.2s ease';
        }else {
            // Reset cursor and scale if not over trash can
            noteElement.style.transform = 'scale(1)';
        }
        
    }

    function stopElementDrag() {

        const trashCan = document.getElementById('trashcan1');
        const trashRect = trashCan.getBoundingClientRect();
        const noteRect = noteElement.getBoundingClientRect();
        if (noteRect.right > trashRect.left && noteRect.left < trashRect.right &&
            noteRect.bottom > trashRect.top && noteRect.top < trashRect.bottom) {
            noteElement.remove(); // Remove note if over trash can
        }
        document.onpointerup = null;
        document.onpointermove = null;
        document.body.style.cursor = 'default'; // Reset cursor

    }
}


// function focusElement(noteElement) {
//     // Make the note focusable
//     noteElement.setAttribute('tabindex', '0');
//     // Focus the note when clicked or pressed
//     noteElement.addEventListener('pointerdown', function() {
//         noteElement.focus();
//     });
//     // Listen for keydown when focused
//     noteElement.addEventListener('keydown', function(e) {
//         // if (e.key === 'Delete' || e.key === 'Backspace') {
//         //     noteElement.remove();
//         // }
//         if (e.key === 'Enter') {
//             // Prevent default Enter behavior
//             e.preventDefault();
//             // Add a new line in the textarea
//             const textarea = noteElement.querySelector('.note-textarea');
//             if (textarea) {
//                 textarea.value += '\n';
//             }
//         }
//         if (e.key === 'Escape') {
//             // Remove focus from the note
//             noteElement.blur();
//         }
//     });
// }



// Helper to generate unique IDs for new notes
let noteCounter = 1;

function createDraggableNote(template) {
    const newNote = document.createElement('div');
    newNote.className = 'note-holder';

    // Copy color from template
    if (template.id === 'note1') newNote.style.backgroundColor = 'yellow';
    if (template.id === 'note2') newNote.style.backgroundColor = 'orange';
    if (template.id === 'note3') newNote.style.backgroundColor = 'purple';

    newNote.id = `spawned-note-${noteCounter++}`;
    newNote.style.position = 'absolute';

    // Add a textarea for note content
    const textarea = document.createElement('textarea');
    textarea.className = 'note-textarea';
    textarea.placeholder = 'Type your note...';
    textarea.style.width = '90%';
    textarea.style.height = '80%';
    textarea.style.margin = '5%';
    textarea.style.resize = 'none';
    textarea.style.background = 'transparent';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.fontSize = '1em';

    // textarea.style.color = 'black';
    if (template.id === 'note1' || template.id === 'note2') textarea.style.color = 'black';
    if (template.id === 'note3') textarea.style.color = 'white';

    newNote.appendChild(textarea);

    // Get bounding rects
    const templateRect = template.getBoundingClientRect();
    const containerRect = document.querySelector('.note-container').getBoundingClientRect();

    // Set position relative to container
    newNote.style.left = (templateRect.left - containerRect.left) + 'px';
    newNote.style.top = (templateRect.top - containerRect.top - 100) + 'px';

    dragElement(newNote);
    // focusElement(newNote);

    document.querySelector('.note-container').appendChild(newNote);
}

// Set up template click handlers
['note1', 'note2', 'note3'].forEach(id => {
    const template = document.getElementById(id);
    template.style.cursor = 'copy';
    template.onclick = function() {
        createDraggableNote(template);
    };
    
});
