/**
 * main.js - Application logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('knob-input');
    
    // Initialize Knob
    const myKnob = new Knob('knob-container', {
        value: 60,
        min: 0,
        max: 100,
        startAngle: 120,
        endAngle: 420,
        snapToStep: true,
        step: 1,
        onChange: (val) => {
            inputField.value = val.toFixed(1);
        }
    });

    // Set initial value
    inputField.value = myKnob.value.toFixed(1);

    // Sync input field changes back to knob
    inputField.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) {
            myKnob.setValue(val);
        }
    });

    // Prevent propagation so mouse events on input don't trigger knob drag
    inputField.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });
});
