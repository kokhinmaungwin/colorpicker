  const colorPicker = document.getElementById('colorPicker');
  const hexCode = document.getElementById('hexCode');
  const rgbCode = document.getElementById('rgbCode');
  const hslCode = document.getElementById('hslCode');
  const message = document.getElementById('message');
  const copyButtons = document.querySelectorAll('.copy-btn');

  // Helper to convert HEX to RGB
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  // Helper to convert RGB to HSL
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return { h, s, l };
  }

  // Update all color codes based on picker value
  function updateColorCodes(hex) {
    hex = hex.toUpperCase();
    hexCode.textContent = `HEX: ${hex}`;

    const { r, g, b } = hexToRgb(hex);
    rgbCode.textContent = `RGB: rgb(${r}, ${g}, ${b})`;

    const { h, s, l } = rgbToHsl(r, g, b);
    hslCode.textContent = `HSL: hsl(${h}, ${s}%, ${l}%)`;
  }

  colorPicker.addEventListener('input', () => {
    updateColorCodes(colorPicker.value);
    message.textContent = '';
  });

  // Copy button event listeners
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const text = document.getElementById(targetId).textContent;
      navigator.clipboard.writeText(text).then(() => {
        message.textContent = `Copied: ${text}`;
        setTimeout(() => { message.textContent = ''; }, 2000);
      }).catch(() => {
        message.textContent = 'Failed to copy!';
      });
    });
  });

  // Initialize on load
  updateColorCodes(colorPicker.value);

  // Service Worker registration (optional)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').then(reg => {
        console.log('Service Worker registered:', reg.scope);
      }).catch(err => {
        console.error('Service Worker registration failed:', err);
      });
    });
  }
