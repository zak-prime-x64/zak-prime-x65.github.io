document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('whiteboardCanvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clearButton');
    const brushSizeSlider = document.getElementById('brushSize');
    const brushSizeValueSpan = document.getElementById('brushSizeValue');
    const colorGrid = document.querySelector('.color-grid');
    const customColorPicker = document.getElementById('customColorPicker');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#0000FF'; 
    let currentBrushSize = 5;

    function resizeCanvas() {
   
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);


    function draw(e) {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        if (clientX === undefined || clientY === undefined) return;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentBrushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.shadowBlur = currentBrushSize * 0.8;
        ctx.shadowColor = currentColor;

        ctx.stroke();

        [lastX, lastY] = [x, y];
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    });

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.touches[0].clientX - rect.left;
        lastY = e.touches[0].clientY - rect.top;
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); 
        draw(e);
    });

    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchcancel', () => isDrawing = false);


    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    brushSizeSlider.addEventListener('input', (e) => {
        currentBrushSize = parseInt(e.target.value);
        brushSizeValueSpan.textContent = currentBrushSize;
    });


    colorGrid.addEventListener('click', (e) => {
        const clickedColorBox = e.target.closest('.color-box');
        if (clickedColorBox) {
            const currentSelected = document.querySelector('.color-box.selected');
            if (currentSelected) {
                currentSelected.classList.remove('selected');
            }

            clickedColorBox.classList.add('selected');

            currentColor = clickedColorBox.dataset.color;
            customColorPicker.value = currentColor; 
        }
    });
    customColorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        const currentSelected = document.querySelector('.color-box.selected');
        if (currentSelected) {
            currentSelected.classList.remove('selected');
        }
    });

    document.querySelector('.color-box[data-color="#0000FF"]').classList.add('selected');
});