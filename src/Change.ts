import { Changes } from "."

export const methods = [ 'create', 'update', 'delete' ]

export class Change {

  static readonly methods = methods

  entityName?: string
  entity?: any
  method?: string
  props?: string[]

  constructor()
  constructor(entity: object, method?: string, props?: string[])
  constructor(entityName: string, entity?: object, method?: string, props?: string[])
  constructor(entityName: string, method: string, props?: string[])
  constructor(classFunction: { new(): any }, entity?: object, method?: string, props?: string[])
  constructor(classFunction: { new(): any }, method: string, props?: string[])

  constructor(arg1?: any, arg2?: any, arg3?: any, arg4?: any) {
    if (arg1 === undefined) {
      return
    }

    // first parameter is entity
    if (typeof arg1 == 'object' && arg1 !== null) {
      this.entityName = arg1.constructor.name
      this.entity = arg1
    }
    // first parameter is entityName
    else if (typeof arg1 == 'string') {
      this.entityName = arg1
    }
    // first parameter is classFunction
    else if (typeof arg1 == 'function' && (<any> arg1).name != undefined) {
      this.entityName = (<any> arg1).name
    }
    else {
      throw new TypeError('First argument was neither an entity object nor an entity name nor a class function')
    }

    // second parameter is method
    if (typeof arg2 == 'string') {
      this.method = arg2

      if (arg3 != undefined) {
        this.props = arg3
      }
    }
    // second parameter is the entity
    else if (typeof arg2 == 'object' && typeof arg2 !== null) {
      this.entity = arg2

      if (arg3 != undefined) {
        this.method = arg3

        if (arg4 != undefined) {
          this.props = arg4
        }
      }
    }
  }

  isTriggered(changes: Change|Change[]|Changes): boolean {
    if (changes instanceof Change) {
      changes = [ changes ]
    }
    else if (changes instanceof Changes) {
      changes = changes.changes
    }

    // if there are changes attached make a list out of the most specific
    // change. this means that the methods matches.
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
      if (! this._isEntityNameTriggering(change)) {
        continue
      }

      if (! this._isEntityTriggering(change)) {
        continue
      }

      if (! this._isMethodTriggering(change)) {
        continue
      }

      if (this._arePropsTriggering(change)) {
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

    if (this.props !== other.props) {
      if (this.props instanceof Array && other.props instanceof Array) {
        if (this.props.length != other.props.length) {
          return false
        }

        for (let prop of this.props) {
          if (other.props.indexOf(prop) == -1) {
            return false
          }
        }

        return true
      }

      return false
    }

    if (this.entity !== other.entity) {
      if (typeof this.entity == 'object' && typeof other.entity == 'object') {
        let entityProps = Object.keys(this.entity)
        let otherEntityProps = Object.keys(other.entity)

        if (entityProps.length != otherEntityProps.length) {
          return false
        }

        for (let entityProp of entityProps) {
          if (otherEntityProps.indexOf(entityProp) == -1) {
            return false
          }
        }

        for (let entityProp of entityProps) {
          if (this.entity[entityProp] !== other.entity[entityProp]) {
            return false
          }
        }

        return true
      }

      return false
    }

    return true
  }

  private _isEntityNameTriggering(other: Change): boolean {
    if (this.entityName == undefined || other.entityName == undefined) {
      return true
    }

    return this.entityName === other.entityName
  }

  private _isEntityTriggering(other: Change): boolean {
    // if one of the entities is undefined or null then it wants to be always relevant
    if (this.entity == undefined || other.entity == undefined) {
      return true
    }

    // if the entities have a different type than object then there is something wrong
    if (typeof this.entity !== 'object' || typeof other.entity !== 'object') {
      return false
    }

    // if one of the entity does not contain any key then it wants to be relevant for anything
    if (Object.keys(this.entity).length == 0 || Object.keys(other.entity).length == 0) {
      return true
    }

    let entityProps = Object.keys(this.entity)
    for (let prop of entityProps) {
      if (this.entity[prop] === undefined || other.entity[prop] === undefined) {
        return true
      }
      
      if (this.entity[prop] !== other.entity[prop]) {
        return false
      }
    }

    return true
  }

  private _isMethodTriggering(other: Change): boolean {
    // if one of the changes is undefined or null then it wants it is relevant
    // because it was kept unspecific so that it is relevant in any way
    if (this.method == undefined || other.method == undefined) {
      return true
    }

    // if the method is of the same type and of equal value then it is relevant
    if (this.method === other.method) {
      return true
    }

    // if there was not equal prop it is not relevant
    return false
  }

  private _arePropsTriggering(other: Change): boolean {
    if (other.props == undefined || this.props == undefined) {
      return true
    }

    if (! (other.props instanceof Array) || ! (this.props instanceof Array)) {
      return false
    }

    if (other.props.length == 0 || this.props.length == 0) {
      return true
    }

    for (let prop of other.props) {
      for (let thisProp of this.props) {
        // if any changed prop is equal it is relevant
        if (prop === thisProp) {
          return true
        }
      }
    }

    return false
  }
}