import wordsData from './words-full.json'
export const words = wordsData

// Key widths are in units (u), where 1u is a standard letter key. Every full
// row adds up to ROW_UNITS so the keyboard's left and right edges line up;
// shorter rows (the space bar) are centred.
export const ROW_UNITS = 15

export type Finger = 'pinky' | 'ring' | 'middle' | 'index-left' | 'index-right'

export type KeyDef = {
  id: string
  display: string
  // Shifted character, e.g. '#' on the 3 key; hidden on a compact keyboard.
  shift?: string
  // Short label for wide keys on a compact keyboard, e.g. '⇪' for Caps Lock.
  compact?: string
  // Finger zone, which sets the key's colour (--finger-* in tokens.css)
  finger: Finger
  width?: number
}

export const keyboardLayout: KeyDef[][] = [
  [
    { id: '`', display: '`', shift: '~', finger: 'pinky' },
    { id: '1', display: '1', shift: '!', finger: 'pinky' },
    { id: '2', display: '2', shift: '@', finger: 'pinky' },
    { id: '3', display: '3', shift: '#', finger: 'ring' },
    { id: '4', display: '4', shift: '$', finger: 'middle' },
    { id: '5', display: '5', shift: '%', finger: 'index-left' },
    { id: '6', display: '6', shift: '^', finger: 'index-left' },
    { id: '7', display: '7', shift: '&', finger: 'index-right' },
    { id: '8', display: '8', shift: '*', finger: 'index-right' },
    { id: '9', display: '9', shift: '(', finger: 'middle' },
    { id: '0', display: '0', shift: ')', finger: 'ring' },
    { id: '[', display: '[', shift: '{', finger: 'pinky' },
    { id: ']', display: ']', shift: '}', finger: 'pinky' },
    {
      id: 'Backspace',
      display: 'Delete',
      compact: '⌫',
      finger: 'pinky',
      width: 2,
    },
  ],
  [
    { id: 'Tab', display: 'Tab', compact: '⇥', finger: 'pinky', width: 1.5 },
    { id: "'", display: "'", shift: '"', finger: 'pinky' },
    { id: ',', display: ',', shift: '<', finger: 'ring' },
    { id: '.', display: '.', shift: '>', finger: 'middle' },
    { id: 'p', display: 'P', finger: 'index-left' },
    { id: 'y', display: 'Y', finger: 'index-left' },
    { id: 'f', display: 'F', finger: 'index-right' },
    { id: 'g', display: 'G', finger: 'index-right' },
    { id: 'c', display: 'C', finger: 'middle' },
    { id: 'r', display: 'R', finger: 'ring' },
    { id: 'l', display: 'L', finger: 'pinky' },
    { id: '/', display: '/', shift: '?', finger: 'pinky' },
    { id: '=', display: '=', shift: '+', finger: 'pinky' },
    { id: '\\', display: '\\', shift: '|', finger: 'pinky', width: 1.5 },
  ],
  [
    {
      id: 'CapsLock',
      display: 'Caps Lock',
      compact: '⇪',
      finger: 'pinky',
      width: 1.75,
    },
    { id: 'a', display: 'A', finger: 'pinky' },
    { id: 'o', display: 'O', finger: 'ring' },
    { id: 'e', display: 'E', finger: 'middle' },
    { id: 'u', display: 'U', finger: 'index-left' },
    { id: 'i', display: 'I', finger: 'index-left' },
    { id: 'd', display: 'D', finger: 'index-right' },
    { id: 'h', display: 'H', finger: 'index-right' },
    { id: 't', display: 'T', finger: 'middle' },
    { id: 'n', display: 'N', finger: 'ring' },
    { id: 's', display: 'S', finger: 'pinky' },
    { id: '-', display: '-', shift: '_', finger: 'pinky' },
    {
      id: 'Enter',
      display: 'Return',
      compact: '⏎',
      finger: 'pinky',
      width: 2.25,
    },
  ],
  [
    {
      id: 'ShiftLeft',
      display: 'Shift',
      compact: '⇧',
      finger: 'pinky',
      width: 2.25,
    },
    { id: ';', display: ';', shift: ':', finger: 'pinky' },
    { id: 'q', display: 'Q', finger: 'ring' },
    { id: 'j', display: 'J', finger: 'middle' },
    { id: 'k', display: 'K', finger: 'index-left' },
    { id: 'x', display: 'X', finger: 'index-left' },
    { id: 'b', display: 'B', finger: 'index-right' },
    { id: 'm', display: 'M', finger: 'index-right' },
    { id: 'w', display: 'W', finger: 'middle' },
    { id: 'v', display: 'V', finger: 'ring' },
    { id: 'z', display: 'Z', finger: 'pinky' },
    {
      id: 'ShiftRight',
      display: 'Shift',
      compact: '⇧',
      finger: 'pinky',
      width: 2.75,
    },
  ],
  [{ id: ' ', display: 'Space', finger: 'pinky', width: 7 }],
]

export const keyMap: { [key: string]: string } = {
  '~': '`',
  '!': '1',
  '@': '2',
  '#': '3',
  $: '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  '{': '[',
  '}': ']',
  '"': "'",
  '<': ',',
  '>': '.',
  '?': '/',
  '+': '=',
  '|': '\\',
  ':': ';',
  _: '-',
}

export const specialKeys: string[] = [
  'Enter',
  'Tab',
  'Shift',
  'Meta',
  'Alt',
  'Control',
]
