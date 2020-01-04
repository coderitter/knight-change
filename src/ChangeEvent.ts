import ChangeDescription from './ChangeDescription'

export default class ChangeEvent {
  changes: ChangeDescription[] = []

  constructor(...changeDescriptions: ChangeDescription[]) {
    this.changes.push(...changeDescriptions)
  }

  isRelevantFor(changeDescriptions: ChangeDescription|ChangeDescription[]): boolean {
    for (let change of this.changes) {
      if (change.isRelevantFor(changeDescriptions)) {
        return true
      }
    }

    return false
  }
}
