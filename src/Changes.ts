import { Change } from './Change'

export class Changes {
  changes: Change[] = []

  constructor(...changeDescriptions: Change[]) {
    this.changes.push(...changeDescriptions)
  }

  isRelevantFor(changes: Change|Change[]): boolean {
    for (let change of this.changes) {
      if (change.isRelevantFor(changes)) {
        return true
      }
    }

    return false
  }
}
