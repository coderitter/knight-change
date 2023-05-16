import { Change } from './Change'

export class Changes {
  
  changes: Change[] = []

  constructor(...changes: Change[]) {
    this.changes.push(...changes)
  }

  add(change: Change) {
    let alreadyIncluded = false

    for (let existingChange of this.changes) {
      if (existingChange.equals(change)) {
        alreadyIncluded = true
        break
      }
    }

    if (! alreadyIncluded) {
      this.changes.push(change)
    }
  }

  triggeredBy(changes: Change|Change[]|Changes): boolean {
    for (let change of this.changes) {
      if (change.triggeredBy(changes)) {
        return true
      }
    }

    return false
  }
}
