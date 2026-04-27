/**
 * Knob.js - A Canvas-based Knob Component
 * Replicating jqxKnob functionality
 */

class Knob {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error(`Container #${containerId} not found`);

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        // Default Options
        this.options = {
            value: 60,
            min: 0,
            max: 100,
            startAngle: 120, // Degrees
            endAngle: 420,   // Degrees
            step: 1,
            snapToStep: true,
            style: {
                stroke: '#dfe3e9',
                strokeWidth: 3,
                fill: '#fefefe'
            },
            marks: {
                colorRemaining: 'grey',
                colorProgress: '#00a4e1',
                majorInterval: 10,
                minorInterval: 2,
                majorSize: 0.09, // percentage of radius
                minorSize: 0.06,
                thickness: 3,
                offset: 0.71
            },
            labels: {
                step: 10,
                offset: 0.88,
                visible: true,
                font: '20px Arial'
            },
            progressBar: {
                color: '#00a4e1',
                background: 'grey',
                size: 0.09,
                offset: 0.60
            },
            pointer: {
                type: 'arrow',
                color: '#00a4e1',
                stroke: 'grey',
                size: 0.59,
                offset: 0.49,
                thickness: 20
            },
            onChange: null,
            ...options
        };

        this.value = this.options.value;
        this.isDragging = false;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Events
        this.canvas.addEventListener('mousedown', (e) => this.startDragging(e));
        window.addEventListener('mousemove', (e) => this.drag(e));
        window.addEventListener('mouseup', () => this.stopDragging());

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDragging(e.touches[0]);
        }, { passive: false });
        window.addEventListener('touchmove', (e) => {
            this.drag(e.touches[0]);
        }, { passive: false });
        window.addEventListener('touchend', () => this.stopDragging());

        this.draw();
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        this.canvas.width = size;
        this.canvas.height = size;
        this.radius = size / 2;
        this.centerX = size / 2;
        this.centerY = size / 2;
        this.draw();
    }

    startDragging(e) {
        this.isDragging = true;
        this.updateValueFromCoords(e.clientX, e.clientY);
    }

    drag(e) {
        if (!this.isDragging) return;
        this.updateValueFromCoords(e.clientX, e.clientY);
    }

    stopDragging() {
        this.isDragging = false;
    }

    updateValueFromCoords(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const x = clientX - rect.left - this.centerX;
        const y = clientY - rect.top - this.centerY;

        let angle = Math.atan2(y, x) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        // Normalize to our startAngle
        let start = this.options.startAngle % 360;
        let diff = angle - start;
        if (diff < 0) diff += 360;

        const totalSpan = this.options.endAngle - this.options.startAngle;
        
        // Clamp diff to totalSpan
        // We allow some overflow buffer to prevent jumping
        if (diff > totalSpan + (360 - totalSpan) / 2) {
            diff = 0;
        } else if (diff > totalSpan) {
            diff = totalSpan;
        }

        let newValue = (diff / totalSpan) * (this.options.max - this.options.min) + this.options.min;

        if (this.options.snapToStep) {
            newValue = Math.round(newValue / this.options.step) * this.options.step;
        }

        this.setValue(newValue);
    }

    setValue(val) {
        val = Math.max(this.options.min, Math.min(this.options.max, val));
        if (this.value !== val) {
            this.value = val;
            this.draw();
            if (this.options.onChange) {
                this.options.onChange(this.value);
            }
        }
    }

    degToRad(deg) {
        return (deg * Math.PI) / 180;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();
        this.drawMarks();
        this.drawProgressBar();
        this.drawLabels();
        this.drawPointer();
    }

    drawBackground() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius - 5, 0, Math.PI * 2);
        
        const grad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(1, '#f0f0f0');
        
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = this.options.style.stroke;
        ctx.lineWidth = this.options.style.strokeWidth;
        ctx.stroke();
    }

    drawMarks() {
        const ctx = this.ctx;
        const opts = this.options.marks;
        const totalSpan = this.options.endAngle - this.options.startAngle;
        const range = this.options.max - this.options.min;

        for (let i = this.options.min; i <= this.options.max; i += opts.minorInterval) {
            const isMajor = (i - this.options.min) % opts.majorInterval === 0;
            const angle = this.options.startAngle + ((i - this.options.min) / range) * totalSpan;
            const rad = this.degToRad(angle);

            const innerR = this.radius * opts.offset;
            const outerR = innerR + this.radius * (isMajor ? opts.majorSize : opts.minorSize);

            ctx.beginPath();
            ctx.moveTo(this.centerX + Math.cos(rad) * innerR, this.centerY + Math.sin(rad) * innerR);
            ctx.lineTo(this.centerX + Math.cos(rad) * outerR, this.centerY + Math.sin(rad) * outerR);
            
            ctx.strokeStyle = i <= this.value ? opts.colorProgress : opts.colorRemaining;
            ctx.lineWidth = isMajor ? opts.thickness : opts.thickness / 2;
            ctx.stroke();
        }
    }

    drawLabels() {
        if (!this.options.labels.visible) return;
        const ctx = this.ctx;
        const opts = this.options.labels;
        const totalSpan = this.options.endAngle - this.options.startAngle;
        const range = this.options.max - this.options.min;

        ctx.font = opts.font;
        ctx.fillStyle = 'grey';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = this.options.min; i <= this.options.max; i += opts.step) {
            const angle = this.options.startAngle + ((i - this.options.min) / range) * totalSpan;
            const rad = this.degToRad(angle);
            const r = this.radius * opts.offset;

            const x = this.centerX + Math.cos(rad) * r;
            const y = this.centerY + Math.sin(rad) * r;

            ctx.fillText(i.toString(), x, y);
        }
    }

    drawProgressBar() {
        const ctx = this.ctx;
        const opts = this.options.progressBar;
        const totalSpan = this.options.endAngle - this.options.startAngle;
        const range = this.options.max - this.options.min;
        const currentAngle = this.options.startAngle + ((this.value - this.options.min) / range) * totalSpan;

        const r = this.radius * opts.offset;
        const thickness = this.radius * opts.size;

        // Background track
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, r, this.degToRad(this.options.startAngle), this.degToRad(this.options.endAngle));
        ctx.strokeStyle = opts.background;
        ctx.lineWidth = thickness;
        ctx.lineCap = 'butt';
        ctx.stroke();

        // Progress track
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, r, this.degToRad(this.options.startAngle), this.degToRad(currentAngle));
        ctx.strokeStyle = opts.color;
        ctx.stroke();
    }

    drawPointer() {
        const ctx = this.ctx;
        const opts = this.options.pointer;
        const totalSpan = this.options.endAngle - this.options.startAngle;
        const range = this.options.max - this.options.min;
        const angle = this.options.startAngle + ((this.value - this.options.min) / range) * totalSpan;
        const rad = this.degToRad(angle);

        const rBase = this.radius * opts.offset;
        const rTip = rBase + this.radius * opts.size;
        const thickness = opts.thickness;

        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(rad);

        // Draw Arrow Pointer
        ctx.beginPath();
        // Start from base
        ctx.moveTo(rBase, -thickness / 2);
        ctx.lineTo(rTip, 0); // Point
        ctx.lineTo(rBase, thickness / 2);
        ctx.closePath();

        ctx.fillStyle = opts.color;
        ctx.fill();
        ctx.strokeStyle = opts.stroke;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }
}
