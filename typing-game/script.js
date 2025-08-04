async function sentence() {
    const url = 'https://sentence-generator2.p.rapidapi.com/sentence?length=30';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '168e0ba747msh23eee9ad25ffb99p153100jsn3acff94c25de',
		'x-rapidapi-host': 'sentence-generator2.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}

}


// sentence();





const startButton = document.getElementById('start-button1');
const resetButton = document.getElementById('reset-button1');


startButton.addEventListener('click', () => {
    console.log('Start button clicked');
    document.querySelectorAll('.action-button').forEach(button => {
        button.classList.toggle('hidden');
    });

    
})

resetButton.addEventListener('click', () => {
    console.log('Reset button clicked');
    document.querySelectorAll('.action-button').forEach(button => {
        button.classList.toggle('hidden');
    })
})