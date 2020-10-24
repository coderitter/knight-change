import { Change } from './Change'

export class Changes {
  changes: Change[] = []

  constructor(...changeDescriptions: Change[]) {
    this.changes.push(...changeDescriptions)
  }

  add(change: Change) {
    let alreadyAdded = false

    for (let existingChange of this.changes) {
      if (existingChange.entityName !== change.entityName) {
        continue
      }

      if (existingChange.entity !== change.entity) {
        if (existingChange.entity == undefined || change.entity == undefined) {
          continue
        }

        let props = Object.keys(change.entity)
        let existingProps = Object.keys(existingChange.entity)

        if (existingProps.length != props.length) {
          continue
        }

        let propsEqual = true
        
        for (let existingProp of existingProps) {
          if (! (existingProp in change.entity)) {
            propsEqual = false
            break
          }

          if (existingChange.entity[existingProp] !== change.entity[existingProp]) {
            propsEqual = false
            break
          }
        }

        if (! propsEqual) {
          continue
        }
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
