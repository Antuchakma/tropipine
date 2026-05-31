// Global design tokens — premium minimal aesthetic

export const colors = {
  // Backgrounds
  cream:  '#F8F5F0',   // primary page background
  bone:   '#F0EBE3',   // secondary surface / inputs
  white:  '#FFFFFF',   // card backgrounds
  // Text
  bark:   '#1A1410',   // primary text (near-black warm)
  earth:  '#4A3728',   // secondary dark text
  clay:   '#8C6F58',   // muted / label text
  sand:   '#BDA88A',   // faint text / placeholders
  // Borders
  stone:  '#E5DDD3',   // default borders
  smoke:  '#F0EBE3',   // subtle dividers
  // Brand accent — single forest-green
  grove:  '#2A3B26',   // primary brand color (dark forest green)
  sage:   '#5C7055',   // medium green
  mist:   '#EAF0E8',   // light green (hover/selected bg)
  // Status
  success: '#2E5E34',
  error:   '#7A1F1F',
  errorBg: '#F8EFEF',
  // Star
  star: '#C4923A',
  // Auth dark theme (unchanged dark screens)
  auth: {
    bg:    '#120F0D',
    card:  '#1B1714',
    input: '#26211D',
  },
}

export const shadows = {
  card:    '0 1px 4px rgba(26,20,16,0.06)',
  lift:    '0 4px 16px rgba(26,20,16,0.09)',
  grove:   '0 4px 12px rgba(42,59,38,0.25)',
}

export const gradients = {
  brandAlt: `linear-gradient(135deg, rgb(255, 107, 53) 0%, rgb(255, 152, 0) 100%)`,
}
