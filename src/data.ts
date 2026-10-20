import wordsData from './words-full.json'
export const words = wordsData

// Key widths are in units (u), where 1u is a standard letter key. Every full
// row adds up to ROW_UNITS so the keyboard's left and right edges line up;
// shorter rows (the space bar) are centred.
export const ROW_UNITS = 15

export type KeyDef = {
  id: string
  display: string
  // Shifted character, e.g. '#' on the 3 key; hidden on a compact keyboard.
  shift?: string
  // Short label for wide keys on a compact keyboard, e.g. '⇪' for Caps Lock.
  compact?: string
  color: string
  width?: number
}

export const keyboardLayout: KeyDef[][] = [
  [
    { id: '`', display: '`', shift: '~', color: '#FFC300' },
    { id: '1', display: '1', shift: '!', color: '#FFC300' },
    { id: '2', display: '2', shift: '@', color: '#FFC300' },
    { id: '3', display: '3', shift: '#', color: '#FF5733' },
    { id: '4', display: '4', shift: '$', color: '#C70039' },
    { id: '5', display: '5', shift: '%', color: '#900C3F' },
    { id: '6', display: '6', shift: '^', color: '#900C3F' },
    { id: '7', display: '7', shift: '&', color: '#581845' },
    { id: '8', display: '8', shift: '*', color: '#581845' },
    { id: '9', display: '9', shift: '(', color: '#C70039' },
    { id: '0', display: '0', shift: ')', color: '#FF5733' },
    { id: '[', display: '[', shift: '{', color: '#FFC300' },
    { id: ']', display: ']', shift: '}', color: '#FFC300' },
    {
      id: 'Backspace',
      display: 'Delete',
      compact: '⌫',
      color: '#FFC300',
      width: 2,
    },
  ],
  [
    { id: 'Tab', display: 'Tab', compact: '⇥', color: '#FFC300', width: 1.5 },
    { id: "'", display: "'", shift: '"', color: '#FFC300' },
    { id: ',', display: ',', shift: '<', color: '#FF5733' },
    { id: '.', display: '.', shift: '>', color: '#C70039' },
    { id: 'p', display: 'P', color: '#900C3F' },
    { id: 'y', display: 'Y', color: '#900C3F' },
    { id: 'f', display: 'F', color: '#581845' },
    { id: 'g', display: 'G', color: '#581845' },
    { id: 'c', display: 'C', color: '#C70039' },
    { id: 'r', display: 'R', color: '#FF5733' },
    { id: 'l', display: 'L', color: '#FFC300' },
    { id: '/', display: '/', shift: '?', color: '#FFC300' },
    { id: '=', display: '=', shift: '+', color: '#FFC300' },
    { id: '\\', display: '\\', shift: '|', color: '#FFC300', width: 1.5 },
  ],
  [
    {
      id: 'CapsLock',
      display: 'Caps Lock',
      compact: '⇪',
      color: '#FFC300',
      width: 1.75,
    },
    { id: 'a', display: 'A', color: '#FFC300' },
    { id: 'o', display: 'O', color: '#FF5733' },
    { id: 'e', display: 'E', color: '#C70039' },
    { id: 'u', display: 'U', color: '#900C3F' },
    { id: 'i', display: 'I', color: '#900C3F' },
    { id: 'd', display: 'D', color: '#581845' },
    { id: 'h', display: 'H', color: '#581845' },
    { id: 't', display: 'T', color: '#C70039' },
    { id: 'n', display: 'N', color: '#FF5733' },
    { id: 's', display: 'S', color: '#FFC300' },
    { id: '-', display: '-', shift: '_', color: '#FFC300' },
    {
      id: 'Enter',
      display: 'Return',
      compact: '⏎',
      color: '#FFC300',
      width: 2.25,
    },
  ],
  [
    {
      id: 'ShiftLeft',
      display: 'Shift',
      compact: '⇧',
      color: '#FFC300',
      width: 2.25,
    },
    { id: ';', display: ';', shift: ':', color: '#FFC300' },
    { id: 'q', display: 'Q', color: '#FF5733' },
    { id: 'j', display: 'J', color: '#C70039' },
    { id: 'k', display: 'K', color: '#900C3F' },
    { id: 'x', display: 'X', color: '#900C3F' },
    { id: 'b', display: 'B', color: '#581845' },
    { id: 'm', display: 'M', color: '#581845' },
    { id: 'w', display: 'W', color: '#C70039' },
    { id: 'v', display: 'V', color: '#FF5733' },
    { id: 'z', display: 'Z', color: '#FFC300' },
    {
      id: 'ShiftRight',
      display: 'Shift',
      compact: '⇧',
      color: '#FFC300',
      width: 2.75,
    },
  ],
  [{ id: ' ', display: 'Space', color: '#FFC300', width: 7 }],
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
