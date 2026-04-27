# Premium Canvas Knob Widget

A high-performance, lightweight UI component built using **HTML5 Canvas** and **Vanilla JavaScript**. This project is a replica of the "Arrow Pointer" knob from the jQWidgets library, designed with modern aesthetics and smooth interaction.

![Preview](https://github.com/unobengkel/knob_versi1/blob/main/preview.PNG) *(Note: Add your own screenshot here)*

## 🚀 Features

- **Native Canvas Rendering**: Smooth drawing and high performance.
- **Bi-directional Synchronization**: Syncs perfectly with a numeric input field.
- **Customizable Pointer**: Includes a sleek arrow pointer that follows the value accurately.
- **Smooth Interaction**: Supports both mouse drag and touch events.
- **Premium Aesthetics**: Glassmorphism design, custom gradients, and modern typography using Google Fonts (Outfit).
- **Responsive**: Adapts to container size while maintaining visual fidelity.

## 📁 Project Structure

```text
knob_trial/
├── asset/
│   ├── knob/
│   │   ├── knob.js     # Core Canvas Class & Logic
│   │   └── knob.css    # Component specific styles
│   └── web/
│       ├── main.css    # Modern UI & Layout styles
│       └── main.js     # App initialization & events
└── index.html          # Main entry point
```

## 🛠️ Installation & Usage

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/premium-canvas-knob.git
   ```
2. **Open the project**:
   Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

### Customizing the Knob

You can initialize the knob with custom options in `main.js`:

```javascript
const myKnob = new Knob('container-id', {
    value: 60,           // Initial value
    min: 0,              // Minimum value
    max: 100,            // Maximum value
    startAngle: 120,     // Angle for min value
    endAngle: 420,       // Angle for max value
    step: 1,             // Incremental step
    snapToStep: true,    // Enable/disable snapping
    onChange: (val) => {
        console.log("Value changed:", val);
    }
});
```

## 🎨 Design Inspiration

This widget was inspired by the **jqxKnob** widget from jQWidgets, recreated from scratch to demonstrate the power of native Web APIs without external dependencies like jQuery.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
>>>>>>> e41d713 (Upload project pertama)
