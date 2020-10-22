import { Change } from './Change'

export class Changes {
  changes: Change[] = []

  constructor(...changeDescriptions: Change[]) {
    this.changes.push(...changeDescriptions)
  }

  add(change: Change) {
    let idPropNames = change.idProps != undefined ? Object.keys(change.idProps) : []
    let alreadyAdded = false

    for (let existingChange of this.changes) {
      if (existingChange.entityName !== change.entityName) {
        continue
      }

      let existingIdPropNames = existingChange.idProps != undefined  ? Object.keys(existingChange.idProps) : []
      if (idPropNames.length != existingIdPropNames.length) {
        continue
      }

      let idPropsDifferent = false

      for (let idPropName of idPropNames) {
        if (existingIdPropNames.indexOf(idPropName) == -1) {
          idPropsDifferent = true
          break
        }

        if (change.idProps![idPropName] !== existingChange.idProps![idPropName]) {
          idPropsDifferent = true
          break
        }
      }

      if (idPropsDifferent) {
        continue
      }

      alreadyAdded = true

      if (change.methods != undefined ) {
        if (existingChange.methods == undefined) {
          existingChange.methods = []
        }

        for (let method of change.methods) {
          let methodExisting = false
          
          for (let existingMethod of existingChange.methods) {
            if (existingMethod.method == method.method) {
              methodExisting = true
  
              if (method.props != undefined) {
                for (let prop of method.props) {
                  if (existingMethod.props == undefined || existingMethod.props.indexOf(prop) == -1) {
                    if (existingMethod.props == undefined) {
                      existingMethod.props = []
                    }
  
                    existingMethod.props.push(prop)
                  }
                }
              }
            }
          }
  
          if (! methodExisting) {
            existingChange.methods.push(method)
          }
        }          
      }
    }

    if (! alreadyAdded) {
      this.changes.push(change)
    }
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
