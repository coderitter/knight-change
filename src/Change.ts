import { Changes } from '.'

export class Change {

  entityName?: string
  entity?: any
  method?: 'create'|'update'|'delete'
  properties?: string[]

  constructor()
  constructor(entity: object, method?: string, properties?: string[])
  constructor(entityName: string, entity?: object, method?: string, properties?: string[])
  constructor(entityName: string, method: string, properties?: string[])
  constructor(classFunction: { new(): any }, entity?: object, method?: string, properties?: string[])
  constructor(classFunction: { new(): any }, method: string, properties?: string[])

  constructor(...args: any[]) {
    if (args.length == 0) {
      return
    }

    // first parameter is classFunction
    if (typeof args[0] == 'function' && args[0].name != undefined) {
      this.entityName = args[0].name
    }
    // first parameter is object
    else if (args[0] instanceof Object) {
      this.entityName = args[0].constructor.name
      this.entity = args[0]
    }
    // first parameter is entityName
    else if (typeof args[0] == 'string') {
      this.entityName = args[0]
    }
    else {
      throw new TypeError('First argument was neither an entity object nor an entity name nor a class function')
    }

    if (args.length > 1) {
      // second parameter is method
      if (typeof args[1] == 'string') {
        this.method = args[1] as any

        if (args.length > 2) {
          this.properties = args[2]
        }
      }
      // second parameter is the entity
      else if (args[1] instanceof Object) {
        this.entity = args[1]

        if (args.length > 2) {
          this.method = args[2]

          if (args.length > 3) {
            this.properties = args[3]
          }
        }
      }
    }
  }

  triggeredBy(changes: Change|Change[]|Changes): boolean {
    if (changes instanceof Change) {
      changes = [ changes ]
    }
    else if (changes instanceof Changes) {
      changes = changes.changes
    }

    // if there are changes attached make a list out of the most specific change.
    // this means that the methods matches.
    // if there are not any matches consider every change.
    if (this.method != undefined) {
      let mostSpecificChanges = []

      for (let change of changes) {
        if (change.entityName === this.entityName && change.method === this.method) {
          mostSpecificChanges.push(change)
        }
      }

      if (mostSpecificChanges.length > 0) {
        changes = mostSpecificChanges
      }
    }

    for (let change of changes) {
      if (! this.triggeredByEntityName(change)) {
        continue
      }

      if (! this.triggeredByEntity(change)) {
        continue
      }

      if (! this.triggeredByMethod(change)) {
        continue
      }

      if (this.triggeredByProperties(change)) {
        return true
      }
    }

    return false
  }

  equals(other: Change): boolean {
    if (this.entityName !== other.entityName) {
      return false
    }

    if (this.method !== other.method) {
      return false
    }

    if (this.properties !== other.properties) {
      if (this.properties instanceof Array && other.properties instanceof Array) {
        if (this.properties.length != other.properties.length) {
          return false
        }

        for (let property of this.properties) {
          if (other.properties.indexOf(property) == -1) {
            return false
          }
        }

        return true
      }

      return false
    }

    if (this.entity !== other.entity) {
      if (typeof this.entity == 'object' && typeof other.entity == 'object') {
        let thisProperties = Object.keys(this.entity)
        let otherProperties = Object.keys(other.entity)

        if (thisProperties.length != otherProperties.length) {
          return false
        }

        for (let thisProperty of thisProperties) {
          if (otherProperties.indexOf(thisProperty) == -1) {
            return false
          }
        }

        for (let thisProperty of thisProperties) {
          if (this.entity[thisProperty] !== other.entity[thisProperty]) {
            return false
          }
        }

        return true
      }

      return false
    }

    return true
  }

  triggeredByEntityName(other: Change): boolean {
    if (this.entityName == undefined || other.entityName == undefined) {
      return true
    }

    return this.entityName === other.entityName
  }

  triggeredByEntity(other: Change): boolean {
    // if one of the entities is undefined or null then it is triggering
    if (this.entity == undefined || other.entity == undefined) {
      return true
    }

    // if the entities have a different type than object then there is something wrong
    if (typeof this.entity !== 'object' || typeof other.entity !== 'object') {
      return false
    }

    // if one of the entities does not contain any key then it is triggering
    let containsAtLeastOneProperty = false

    for (let property in this.entity) {
      if (! this.entity.propertyIsEnumerable(property)) {
        continue
      }

      containsAtLeastOneProperty = true
      break
    }

    if (! containsAtLeastOneProperty) {
      return true
    }

    containsAtLeastOneProperty = false
    for (let property in other.entity) {
      if (! other.entity.propertyIsEnumerable(property)) {
        continue
      }

      containsAtLeastOneProperty = true
      break
    }

    if (! containsAtLeastOneProperty) {
      return true
    }

    // compare every property    
    for (let property in this.entity) {
      if (! this.entity.propertyIsEnumerable(property)) {
        continue
      }

      // if one of the properties is undefined then it has the potential to trigger, it is not a false yet
      if (this.entity[property] === undefined || other.entity[property] === undefined) {
        continue
      }
      
      if (this.entity[property] !== other.entity[property]) {
        return false
      }
    }

    return true
  }

  triggeredByMethod(other: Change): boolean {
    // if one of the changes is undefined or null then it is triggering
    if (this.method == undefined || other.method == undefined) {
      return true
    }

    // if the method is of the same type and of equal value then it is triggering
    if (this.method === other.method) {
      return true
    }

    // if there was not equal prop it is not triggering
    return false
  }

  triggeredByProperties(other: Change): boolean {
    if (other.properties == undefined || this.properties == undefined) {
      return true
    }

    if (! (other.properties instanceof Array) || ! (this.properties instanceof Array)) {
      return false
    }

    if (other.properties.length == 0 || this.properties.length == 0) {
      return true
    }

    for (let otherProperty of other.properties) {
      for (let thisProperty of this.properties) {
        // if any changed property is equal it is triggering
        if (otherProperty === thisProperty) {
          return true
        }
      }
    }

    return false
  }
}
