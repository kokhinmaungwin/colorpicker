  const colorPicker = document.getElementById('colorPicker');
  const fakeCircle = document.getElementById('fakeColorCircle');

  colorPicker.addEventListener('input', () => {
  fakeCircle.style.backgroundColor = colorPicker.value;
  });
  const colorCode = document.getElementById('colorCode');
  const copyBtn = document.getElementById('copyBtn');
  const formatSelector = document.getElementById('formatSelector');
  const message = document.getElementById('message');
  const darkToggleCheckbox = document.getElementById('darkToggleCheckbox');

  // Social share buttons
  const fbShare = document.getElementById('fbShare');
  const twShare = document.getElementById('twShare');
  const waShare = document.getElementById('waShare');

  // Helper functions
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
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

  function rgbToCmyk(r, g, b) {
    if (r === 0 && g === 0 && b === 0) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);
    const cyan = Math.round(((c - k) / (1 - k)) * 100);
    const magenta = Math.round(((m - k) / (1 - k)) * 100);
    const yellow = Math.round(((y - k) / (1 - k)) * 100);
    const black = Math.round(k * 100);
    return { c: cyan, m: magenta, y: yellow, k: black };
  }

  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h, s, v = max;

    if (d === 0) h = 0;
    else if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    s = max === 0 ? 0 : d / max;
    s = Math.round(s * 100);
    v = Math.round(v * 100);

    return { h, s, v };
  }

  function formatColor(hex, format) {
    hex = hex.toUpperCase();
    const { r, g, b } = hexToRgb(hex);

    switch(format) {
      case 'HEX':
        return hex;
      case 'RGB':
        return `rgb(${r}, ${g}, ${b})`;
      case 'HSL':
        const { h, s, l } = rgbToHsl(r, g, b);
        return `hsl(${h}, ${s}%, ${l}%)`;
      case 'CMYK':
        const { c, m, y, k } = rgbToCmyk(r, g, b);
        return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
      case 'HSV':
        const hsv = rgbToHsv(r, g, b);
        return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
      default:
        return hex;
    }
  }

  function updateColorCode() {
    const selectedFormat = formatSelector.value;
    const formattedColor = formatColor(colorPicker.value, selectedFormat);
    colorCode.textContent = formattedColor;
    message.textContent = '';
    updateURL(colorPicker.value);
  }

  function updateURL(hex) {
    if(history.replaceState) {
      const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?color=' + encodeURIComponent(hex);
      window.history.replaceState({path: newURL}, '', newURL);
    }
  }

  function getColorFromURL() {
    const params = new URLSearchParams(window.location.search);
    const color = params.get('color');
    if(color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
      return color.toUpperCase();
    }
    return null;
  }

  // Copy to clipboard
  copyBtn.addEventListener('click', () => {
    const text = colorCode.textContent;
    navigator.clipboard.writeText(text).then(() => {
      message.textContent = `Copied: ${text}`;
      setTimeout(() => { message.textContent = ''; }, 2000);
    }).catch(() => {
      message.textContent = 'Failed to copy!';
    });
  });

  // Dark mode toggle handler
  darkToggleCheckbox.addEventListener('change', () => {
    if (darkToggleCheckbox.checked) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'disabled');
    }
  });

  // Social share functions
  function shareOnFacebook(color) {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  }
  function shareOnTwitter(color) {
    const text = encodeURIComponent(`Check out this color: ${color}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
  }
  function shareOnWhatsApp(color) {
    const text = encodeURIComponent(`Check out this color: ${color} - ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  fbShare.addEventListener('click', () => shareOnFacebook(colorCode.textContent));
  twShare.addEventListener('click', () => shareOnTwitter(colorCode.textContent));
  waShare.addEventListener('click', () => shareOnWhatsApp(colorCode.textContent));

  // Listen to color and format changes
  colorPicker.addEventListener('input', updateColorCode);
  formatSelector.addEventListener('change', updateColorCode);

  // Load saved dark mode preference and color from URL
  window.addEventListener('DOMContentLoaded', () => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
      document.body.classList.add('dark');
      darkToggleCheckbox.checked = true;
    }

    const urlColor = getColorFromURL();
    if(urlColor) {
      colorPicker.value = urlColor;
    }

    updateColorCode();
  });

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
