import ChangeDescription from './ChangeDescription'

export default class ChangeEvent {
  changes: ChangeDescription[] = []

  constructor(...entityDescriptions: ChangeDescription[]) {
    this.changes.push(...entityDescriptions)
  }

  isRelevantFor(entityDescriptions: ChangeDescription|ChangeDescription[]): boolean {
    for (let change of this.changes) {
      if (change.isRelevantFor(entityDescriptions)) {
        return true
      }
    }

    return false
  }
}
