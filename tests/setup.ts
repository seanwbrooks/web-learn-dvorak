import { afterEach } from 'vitest'

// Each test starts with no learner history (see docs/adr/0001)
afterEach(() => {
  if (typeof window !== 'undefined') window.localStorage.clear()
})

// jsdom has <dialog> but not its methods; the intro only needs open/close
if (
  typeof HTMLDialogElement !== 'undefined' &&
  !HTMLDialogElement.prototype.showModal
) {
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function () {
    this.open = false
  }
}
