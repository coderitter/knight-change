export const methods = [ 'create', 'update', 'delete' ]

export interface Method {
  method: string
  props?: string[]
}

export class Change {

  static readonly methods = methods

  entityName?: string
  entity?: any
  methods?: Method[]

  constructor()
  constructor(entity: object)
  constructor(entity: object, method: string)
  constructor(entity: object, method: Method)
  constructor(entity: object, methods: ( string | Method )[])
  constructor(entityName: string)
  constructor(entityName: string, entity: object)
  constructor(entityName: string, entity: object, method: string)
  constructor(entityName: string, entity: object, method: Method)
  constructor(entityName: string, entity: object, methods: ( string | Method )[])
  constructor(entityName: string, method: string)
  constructor(entityName: string, method: Method)
  constructor(entityName: string, methods: ( string | Method )[])
  constructor(classFunction: { new(): any })
  constructor(classFunction: { new(): any }, entity: object)
  constructor(classFunction: { new(): any }, entity: object, method: string)
  constructor(classFunction: { new(): any }, entity: object, method: Method)
  constructor(classFunction: { new(): any }, entity: object, methods: ( string | Method )[])
  constructor(classFunction: { new(): any }, method: string)
  constructor(classFunction: { new(): any }, method: Method)
  constructor(classFunction: { new(): any }, methods: ( string | Method )[])

  constructor(arg1?: any, arg2?: any, arg3?: any) {
    let methods: string | Method | ( string | Method )[] | undefined = arg3
    let firstParameterIsEntity = false

    // first parameter is entity
    if (typeof arg1 == 'object' && arg1 !== null) {
      firstParameterIsEntity = true
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
    if (typeof arg2 == 'string' || arg2 instanceof Array) {
      methods = arg2
    }
    // if the second parameter is an object it may be idProps or method
    else if (typeof arg2 == 'object' && typeof arg2 !== null) {
      // second parameter is method
      if ('method' in arg2 && Object.keys(arg2).length == 1 || 'method' in arg2 && 'props' in arg2 && Object.keys(arg2).length == 2) {
        methods = arg2
      }
      // second parameter id entity
      else {
        this.entity = arg2
      }
    }

    if (methods != undefined) {
      if (! (this.methods instanceof Array)) {
        this.methods = []
      }

      if (typeof methods == 'string') {
        this.methods.push({ method: methods })
      }
      else if (methods instanceof Array) {
        for (let change of methods) {
          if (typeof change == 'string') {
            this.methods.push({ method: change })
          }
          else if (typeof change == 'object' && change !== null) {
            if (change.method != undefined) {
              this.methods.push(change)
            }
          }
        }
      }  
      else if (typeof methods == 'object' && methods !== null) {
        if (methods.method != undefined) {
          this.methods.push(methods)
        }
      }
    }
  }

  containsMethod(method: string): boolean
  containsMethod(method: Method): boolean

  containsMethod(arg1: any): boolean {
    if (this.methods == undefined || this.methods.length == 0) {
      return false
    }

    let method: string
    let props: string[]|undefined = undefined

    if (typeof arg1 == 'string') {
      method = arg1
    }
    else {
      method = arg1.method
      props = arg1.props
    }
    
    for (let thisMethod of this.methods) {
      if (method != undefined && method === thisMethod.method) {
        if (props != undefined) {
          if (thisMethod.props == undefined) {
            return false
          }

          for (let prop of props) {
            if (thisMethod.props.indexOf(prop) == -1) {
              return false
            }
          }

          return true
        }
        else {
          return true
        }
      }
    }

    return false
  }

  isRelevantFor(changes: Change|Change[]): boolean {
    if (changes instanceof Change) {
      changes = [ changes ]
    }

    // if there are changes attached make a list out of the most specific
    // change. this means that the change methods matches.
    // if there are not any matches consider every change.
    if (this.methods != undefined && this.methods.length > 0) {
      let mostSpecificChanges = []

      for (let change of changes) {
        if (change.entityName == this.entityName && change.containsAtLeastOneMethod(this)) {
          mostSpecificChanges.push(change)
        }
      }

      if (mostSpecificChanges.length > 0) {
        changes = mostSpecificChanges
      }
    }

    for (let change of changes) {
      // if the entity name is not relevant just skip it
      if (! this.isEntityNameRelevant(change)) {
        continue
      }

      if (! this.isEntityRelevant(change)) {
        continue
      }

      if (this.areMethodsRelevant(change)) {
        return true
      }
    }

    return false
  }

  private isEntityNameRelevant(change: Change): boolean {
    // if the entity names are not equal just skip it
    if (change.entityName != this.entityName) {
      return false
    }

    return true
  }

  private isEntityRelevant(change: Change): boolean {
    // if one of the entities is undefined or null then it wants to be always relevant
    if (this.entity == undefined || change.entity == undefined) {
      return true
    }

    // if the entities have a different type than object then there is something wrong
    if (typeof this.entity !== 'object' || typeof change.entity !== 'object') {
      return false
    }

    // if one of the entity does not contain any key then it wants to be relevant for with anything
    if (Object.keys(this.entity).length == 0 || Object.keys(change.entity).length == 0) {
      return true
    }

    for (let prop in change.entity) {
      if (Object.prototype.hasOwnProperty.call(change.entity, prop)) {
        // if the property on the given idProps is not present in this change
        // we think it is not relevant. for example if the parentId is missing on this
        // change then it cannot be relevant for the given change expecting
        // the parentId to be something specific.
        if (! (prop in this.entity)) {
          return false
        }
        
        if (change.entity[prop] !== this.entity[prop]) {
          return false
        }
      }
    }

    return true
  }

  private areMethodsRelevant(change: Change): boolean {
    // if one of the changes is undefined or null then it wants it is relevant
    // because it was kept unspecific so that it is relevant in any way
    if (this.methods == undefined || change.methods == undefined) {
      return true
    }

    // if the changes have a different type than object then there is something wrong
    if (! (this.methods instanceof Array) || ! (change.methods instanceof Array)) {
      return false
    }

    // if one of the changes does not contain any element then it wants to be relevant for with anything
    if (this.methods.length == 0 ||change.methods.length == 0) {
      return true
    }

    for (let method of change.methods) {
      for (let thisChange of this.methods) {
        if (method.method == undefined || thisChange.method == undefined) {
          continue
        }

        if (method.method === thisChange.method) {
          if (method.props == undefined || thisChange.props == undefined) {
            return true
          }

          if (! (method.props instanceof Array) || ! (thisChange.props instanceof Array)) {
            return false
          }

          if (method.props.length == 0 || thisChange.props.length == 0) {
            return true
          }

          for (let prop of method.props) {
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

  private containsAtLeastOneMethod(change: Change): boolean {
    if (change.methods instanceof Array && this.methods instanceof Array) {
      for (let method of change.methods) {
        for (let thisMethod of this.methods) {
          if (method.method != undefined && method.method === thisMethod.method) {
            return true
          }
        }
      }
    }

    return false
  }
}