export default class ChangeDescription {
  entity?: string
  idProps: {[propName: string]: any} = {}
  changes: {method: string, props?: string[]}[] = []

  constructor(
      entity?: string | object,
      idPropsOrChanges?: number | {[propName: string]: any} | string|{method: string, props?: string[]} | (string|{method: string, props?: string[]})[],
      changes?: string | {method: string, props?: string[]} | (string|{method: string, props?: string[]})[]) {

    let firstParameterObject = false
    if (typeof entity === 'string') {
      this.entity = entity
    }
    else if (typeof entity === 'object' && entity !== null) {
      firstParameterObject = true
      this.entity = entity.constructor.name

      if ((<any> entity).id != undefined) {
        this.idProps = {
          id: (<any> entity).id
        }
      }
    }
    // class function
    else if (typeof entity === 'function' && (<any> entity).name != undefined) {
      this.entity = (<any> entity).name
    }

    let theChanges: any = changes

    if (firstParameterObject) {
    // if the first parameter was an object it was used to extract the entity name and its id
    // that means that the next parameter is supposed to be changes
      theChanges = idPropsOrChanges
    }
    else {
      if (typeof idPropsOrChanges === 'number') {
        // if the description is a number it is expected that it is the id of an entity
        this.idProps = {
          id: idPropsOrChanges
        }
      }
      else if (typeof idPropsOrChanges === 'object' && idPropsOrChanges !== null && ! (idPropsOrChanges instanceof Array)) {
        if (idPropsOrChanges.method == undefined) {
          this.idProps = idPropsOrChanges
        }
      }  
    }

    if (theChanges != undefined) {
      if (! (this.changes instanceof Array)) {
        this.changes = []
      }

      if (typeof theChanges === 'string') {
        this.changes.push({ method: theChanges })
      }
      else if (theChanges instanceof Array) {
        for (let change of theChanges) {
          if (typeof change === 'string') {
            this.changes.push({method: change})
          }
          else if (typeof change === 'object' && change !== null) {
            if (change.method != undefined) {
              this.changes.push(change)
            }
          }
        }
      }  
      else if (typeof theChanges === 'object' && theChanges !== null) {
        if (theChanges.method != undefined) {
          this.changes.push(theChanges)
        }
      }
    }
  }

  isRelevantFor(changeDescriptions: ChangeDescription|ChangeDescription[]): boolean {
    if (changeDescriptions instanceof ChangeDescription) {
      changeDescriptions = [ changeDescriptions ]
    }

    // if there are changes attached make a list out of the most specific
    // change descriptions. this means that the change methods matches.
    // if there are not any matches consider every change description.
    if (this.changes != undefined && this.changes.length > 0) {
      let mostSpecificChanges = []

      for (let changeDescription of changeDescriptions) {
        if (changeDescription.containsChangeMethod(this)) {
          mostSpecificChanges.push(changeDescription)
        }
      }

      if (mostSpecificChanges.length > 0) {
        changeDescriptions = mostSpecificChanges
      }
    }

    for (let changeDescription of changeDescriptions) {
      // if the entity name is not relevant just skip it
      if (! this.isEntityRelevant(changeDescription)) {
        continue
      }

      if (! this.isIdPropsRelevant(changeDescription)) {
        continue
      }

      if (this.isChangesRelevant(changeDescription)) {
        return true
      }
    }

    return false
  }

  private isEntityRelevant(changeDescription: ChangeDescription): boolean {
    // if the entity names are not equal just skip it
    if (changeDescription.entity != this.entity) {
      return false
    }

    return true
  }

  private isIdPropsRelevant(changeDescription: ChangeDescription): boolean {
    // if one of the idProps is undefined or null then it wants to be relevant for with anything
    if (this.idProps == undefined || changeDescription.idProps == undefined) {
      return true
    }

    // if the idProps have a different type than object then there is something wrong
    if (typeof this.idProps !== 'object' || typeof changeDescription.idProps !== 'object') {
      return false
    }

    // if one of the idProps does not contain any key then it wants to be relevant for with anything
    if (Object.keys(this.idProps).length == 0 || Object.keys(changeDescription.idProps).length == 0) {
      return true
    }

    for (let prop in changeDescription.idProps) {
      if (Object.prototype.hasOwnProperty.call(changeDescription.idProps, prop)) {
        // if the property on the given idProps is not present in this description
        // we think it is not relevant. for example if the parentId is missing on this
        // description then it cannot be relevant for the given description expecting
        // the parentId to be something specific.
        if (! (prop in this.idProps)) {
          return false
        }
        
        if (changeDescription.idProps[prop] !== this.idProps[prop]) {
          return false
        }
      }
    }

    return true
  }

  isChangesRelevant(changeDescription: ChangeDescription): boolean {
    // if one of the changes is undefined or null then it wants it is relevant
    // because it was kept unspecific so that it is relevant in any way
    if (this.changes == undefined || changeDescription.changes == undefined) {
      return true
    }

    // if the changes have a different type than object then there is something wrong
    if (! (this.changes instanceof Array) || ! (changeDescription.changes instanceof Array)) {
      return false
    }

    // if one of the changes does not contain any element then it wants to be relevant for with anything
    if (this.changes.length == 0 ||changeDescription.changes.length == 0) {
      return true
    }

    for (let change of changeDescription.changes) {
      for (let thisChange of this.changes) {
        if (change.method == undefined || thisChange.method == undefined) {
          continue
        }

        if (change.method === thisChange.method) {
          if (change.props == undefined || thisChange.props == undefined) {
            return true
          }

          if (! (change.props instanceof Array) || ! (thisChange.props instanceof Array)) {
            return false
          }

          if (change.props.length == 0 || thisChange.props.length == 0) {
            return true
          }

          for (let prop of change.props) {
            for (let thisProp of thisChange.props) {
              // if any changed prop is equal it is relevant
              if (prop === thisProp) {
                return true
              }
            }
          }
        }
      }
    }

    // if there was not equal prop it is not relevant
    return false
  }

  private containsChangeMethod(changeDescription: ChangeDescription): boolean {
    if (changeDescription.changes instanceof Array && this.changes instanceof Array) {
      for (let change of changeDescription.changes) {
        for (let thisChange of this.changes) {
          if (change.method != undefined && change.method === thisChange.method) {
            return true
          }
        }
      }
    }

    return false
  }

  static fullDescription(entity: any, method?: string, props?: string[]): ChangeDescription|undefined {
    if (typeof entity !== 'object' || entity === null) {
      return
    }

    let description = new ChangeDescription()
    description.entity = entity.constructor.name
    description.idProps = this.describeAllIds(entity)
    
    if (method != undefined) {
      let change: { method: string, props?: string[] } = {
        method: method
      }

      if (props != undefined) {
        change.props = props
      }

      description.changes.push(change)
    }

    return description
  }

  static describeAllIds(entity: any): {[propName: string]: any} {
    if (typeof entity !== 'object' || entity === null) {
      return {}
    }

    let description: any = {}
    
    for (let prop in entity) {
      if (Object.prototype.hasOwnProperty.call(entity, prop)) {
        if (prop == 'id' || prop.length > 2 && prop.lastIndexOf('Id') == prop.length - 2) {
          description[prop] = entity[prop]
        }
      }
    }

    return description
  }
}