import { expect } from 'chai'
import 'mocha'
import { Change } from '../src/Change'

describe('Change', function() {
  describe('constructor', function() {
    it('should accept parameter-less', function() {
      let change = new Change
      expect(change.entityName).to.be.undefined
      expect(change.entity).to.be.undefined
      expect(change.method).to.be.undefined
      expect(change.properties).to.be.undefined
    })

    it('should set with a entity name', function() {
      let change = new Change('Entity')
      expect(change.entityName).to.equal('Entity')
      expect(change.entity).to.be.undefined
      expect(change.method).to.be.undefined
      expect(change.properties).to.be.undefined
    })

    it('should set with a entity name and entity', function() {
      let change = new Change('Entity', { a: 'a' })
      expect(change.entityName).to.equal('Entity')
      expect(change.entity).to.deep.equal({ a: 'a' })
      expect(change.method).to.be.undefined
      expect(change.properties).to.be.undefined
    })

    it('should set with a entity name, entity and a method', function() {
      let change = new Change('Entity', { a: 'a' }, 'delete')
      expect(change.entityName).to.equal('Entity')
      expect(change.entity).to.deep.equal({ a: 'a' })
      expect(change.method).to.equal('delete')
      expect(change.properties).to.be.undefined
    })

    it('should set with a entity name, entity and a method', function() {
      let change = new Change('Entity', { a: 'a' }, 'delete', ['a', 'b'])
      expect(change.entityName).to.equal('Entity')
      expect(change.entity).to.deep.equal({ a: 'a' })
      expect(change.method).to.equal('delete')
      expect(change.properties).to.deep.equal(['a', 'b'])
    })

    it('should set with a entity name and a method', function() {
      let change = new Change('Entity', 'delete')
      expect(change.entityName).to.equal('Entity')
      expect(change.entity).to.be.undefined
      expect(change.method).to.equal('delete')
      expect(change.properties).to.be.undefined
    })

    it('should set with a entity name, a method and properties', function() {
      let change = new Change('Entity', 'delete', ['a', 'b'])
      expect(change.entityName).to.equal('Entity')
      expect(change.entity).to.be.undefined
      expect(change.method).to.equal('delete')
      expect(change.properties).to.deep.equal(['a', 'b'])
    })

    it('should set with a constructor function', function() {
      let change = new Change(TestEntity1)
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.method).to.be.undefined
      expect(change.properties).to.be.undefined
    })

    it('should set with a constructor function and entity', function() {
      let change = new Change(TestEntity1, { a: 'a' })
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ a: 'a' })
      expect(change.method).to.be.undefined
      expect(change.properties).to.be.undefined
    })

    it('should set with a constructor function, entity and a method', function() {
      let change = new Change(TestEntity1, { a: 'a' }, 'delete')
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ a: 'a' })
      expect(change.method).to.equal('delete')
      expect(change.properties).to.be.undefined
    })

    it('should set with a constructor function, an entity, a method and properties', function() {
      let change = new Change(TestEntity1, { a: 'a' }, 'delete', ['a', 'b'])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.deep.equal({ a: 'a' })
      expect(change.method).to.equal('delete')
      expect(change.properties).to.deep.equal(['a', 'b'])
    })

    it('should set with a constructor function and a method', function() {
      let change = new Change(TestEntity1, 'delete')
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.method).to.equal('delete')
      expect(change.properties).to.be.undefined
    })

    it('should set with a constructor function, a method and properties', function() {
      let change = new Change(TestEntity1, 'delete', ['a', 'b'])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.be.undefined
      expect(change.method).to.equal('delete')
      expect(change.properties).to.deep.equal(['a', 'b'])
    })

    it('should set with an entity', function() {
      let entity = new TestEntity1
      let change = new Change(entity)
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.equal(entity)
      expect(change.method).to.be.undefined
      expect(change.properties).to.be.undefined
    })

    it('should set with an entity and a method', function() {
      let entity = new TestEntity1
      let change = new Change(entity, 'delete')
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.entity).to.equal(entity)
      expect(change.method).to.equal('delete')
      expect(change.properties).to.be.undefined
    })

    it('should set with an entity, a methods and properties', function() {
      let entity = new TestEntity1
      let change = new Change(entity, 'delete', ['a', 'b'])
      expect(change.entityName).to.equal('TestEntity1')
      expect(change.method).to.equal('delete')
      expect(change.properties).to.deep.equal(['a', 'b'])
    })
  })

  describe('triggeredBy', function() {
    it('should trigger if the listener and the change not specified anything', function() {
      let listener = new Change
      let change = new Change
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener does not define anything but the change an entity name', function() {
      let listener = new Change
      let change = new Change('Entity')
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener defines an entity name but the change nothing', function() {
      let listener = new Change('Entity')
      let change = new Change
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener does not define anything but the change an entity name', function() {
      let listener = new Change
      let change = new Change({ a: 'a', b: 'b' })
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener defines an entity but the change nothing', function() {
      let listener = new Change({ a: 'a', b: 'b' })
      let change = new Change
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener does not define anything but the change a method', function() {
      let listener = new Change
      let change = new Change
      change.method = 'delete'
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener defines an entity but the change nothing', function() {
      let listener = new Change
      let change = new Change
      listener.method = 'delete'
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener does not define anything but the change properties', function() {
      let listener = new Change
      let change = new Change
      change.properties = ['a', 'b']
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener defines properties but the change nothing', function() {
      let listener = new Change
      let change = new Change
      listener.properties = ['a', 'b']
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the entity names are the same', function() {
      let listener = new Change('Entity')
      let change = new Change('Entity')
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should not trigger if the entity names are not the same', function() {
      let listener = new Change('Entity1')
      let change = new Change('Entity2')
      expect(listener.triggeredBy(change)).to.be.false
    })

    it('should trigger if the listener does not define an entity but the change does', function() {
      let listener = new Change('Entity')
      let change = new Change('Entity', { a: 'a' })
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener defines an entity but the change does not', function() {
      let listener = new Change('Entity', { a: 'a' })
      let change = new Change('Entity')
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the entities look the same', function() {
      let listener = new Change('Entity', { a: 'a', b: 'b' })
      let change = new Change('Entity', { a: 'a', b: 'b' })
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener defines lesser properties and the change more but with the same values', function() {
      let listener = new Change('Entity', { a: 'a' })
      let change = new Change('Entity', { a: 'a', b: 'b' })
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should not trigger if the listener defines more properties and the change less but with the same values', function() {
      let listener = new Change('Entity', { a: 'a', b: 'b' })
      let change = new Change('Entity', { a: 'a' })
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should not trigger if the entities look different', function() {
      let listener = new Change('Entity', { a: 'a', b: 'b' })
      let change = new Change('Entity', { a: 'a', b: 'c' })
      expect(listener.triggeredBy(change)).to.be.false
    })

    it('should trigger if null values are involved', function() {
      let listener = new Change('Entity', { a: null })
      let change = new Change('Entity', { a: null })
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should not trigger if the listener defines a property to be null but the change as undefined', function() {
      let listener = new Change('Entity', { a: null })
      let change = new Change('Entity', { a: undefined })
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should not trigger if the listener defines a property to be null but the change as 0', function() {
      let listener = new Change('Entity', { a: null })
      let change = new Change('Entity', { a: 'a' })
      expect(listener.triggeredBy(change)).to.be.false
    })

    it('should trigger if the change also defines a method', function() {
      let listener = new Change('Entity', { a: 'a' })
      let change = new Change('Entity', { a: 'a' }, 'update')
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener also defines a method', function() {
      let listener = new Change('Entity', { a: 'a' }, 'update')
      let change = new Change('Entity', { a: 'a' })
      expect(change.triggeredBy(listener)).to.be.true
    })

    it('should trigger if the method is the same', function() {
      let listener = new Change('Entity', { a: 'a' }, 'update')
      let change = new Change('Entity', { a: 'a' }, 'update')
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should not trigger if the method is different', function() {
      let listener = new Change('Entity', { a: 'a' }, 'update')
      let change = new Change('Entity', { a: 'a' }, 'delete')
      expect(listener.triggeredBy(change)).to.be.false
    })

    it('should trigger if the change defines additional properties', function() {
      let listener = new Change('Entity', { a: 'a' }, 'update')
      let change = new Change('Entity', { a: 'a' }, 'update', ['a', 'b'])
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener defindes additional properties', function() {
      let listener = new Change('Entity', { a: 'a' }, 'update', ['a', 'b'])
      let change = new Change('Entity', { a: 'a' }, 'update')
      expect(change.triggeredBy(listener)).to.be.true
    })

    it('should trigger if both define the properties', function() {
      let listener = new Change('Entity', { a: 'a' }, 'update', ['b', 'a'])
      let change = new Change('Entity', { a: 'a' }, 'update', ['a', 'b'])
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if both define the same properties but additional different ones', function() {
      let listener = new Change('Entity', { a: 'a' }, 'update', ['a', 'b', 'c'])
      let change = new Change('Entity', { a: 'a' }, 'update', ['a', 'b', 'd'])
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener describes less properties but the same as the change', function() {
      let listener = new Change('Entity', { a: 'a' }, 'update', ['a'])
      let change = new Change('Entity', { a: 'a' }, 'update', ['a', 'b'])
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should trigger if the listener describes more properties but the same as the change', function() {
      let listener = new Change('Entity', { a: 'a' }, 'update', ['a', 'b'])
      let change = new Change('Entity', { a: 'a' }, 'update', ['a'])
      expect(listener.triggeredBy(change)).to.be.true
    })

    it('should not trigger if both define different properties', function() {
      let listener = new Change('Entity', { a: 'a' }, 'update', ['a', 'b'])
      let change = new Change('Entity', { a: 'a' }, 'update', ['c', 'd'])
      expect(listener.triggeredBy(change)).to.be.false
    })

    it('should return true if there is at least one relevant description', function() {
      let change = new Change('a', { a: 'a' })
      let challengers = [
        new Change('b'),
        new Change('c', { id: 2 }),
        new Change('a', { a: 'a' }),
        new Change('d', { id: 4 })
     ]

      let result = change.triggeredBy(challengers)

      expect(result).to.equal(true)
    })

    it('should return false if there is no satisfying description', function() {
      let change = new Change('a', { a: 'a' })
      let challengers = [
        new Change('b'),
        new Change('c', { a: 'b' }),
        new Change('a', { a: 'c' }),
        new Change('d', { a: 'd' })
     ]

      let result = change.triggeredBy(challengers)

      expect(result).to.equal(false)
    })

    it('should use only the most specific descriptions', function() {
      let challengers = [
        new Change('Entity1', { a: 'a' }),
        new Change('Entity1', { a: 'a' }, 'delete', ['b']),
        new Change('Entity2', { a: 'a' }, 'update', ['a']),
     ]

      let change1 = new Change('Entity1', { a: 'a' }, 'update', ['a'])
      let result1 = change1.triggeredBy(challengers)
      expect(result1).to.equal(true)

      let change2 = new Change('Entity1', { a: 'a' }, 'delete', ['a'])
      let result2 = change2.triggeredBy(challengers)
      expect(result2).to.equal(false)

      let change3 = new Change('Entity1', { a: 'a' }, 'delete', ['b'])
      let result3 = change3.triggeredBy(challengers)
      expect(result3).to.equal(true)

      let change4 = new Change('Entity2', { a: 'a' }, 'update', ['a'])
      let result4 = change4.triggeredBy(challengers)
      expect(result4).to.equal(true)
    })
  })

  describe('equals', function() {
    it('should return true if everything is undefined', function() {
      let change1 = new Change
      let change2 = new Change
      expect(change1.equals(change2)).to.be.true
    })

    it('should not return true if for one everything is undefined but for the other the entity name is set', function() {
      let change1 = new Change
      let change2 = new Change('Entity')
      expect(change1.equals(change2)).to.be.false
    })

    it('should not return true if for one everything is undefined but for the other the entity is set', function() {
      let change1 = new Change
      let change2 = new Change({ a: 'a' })
      expect(change1.equals(change2)).to.be.false
    })

    it('should not return true if for one everything is undefined but for the other the method is set', function() {
      let change1 = new Change
      let change2 = new Change
      change2.method = 'delete'
      expect(change1.equals(change2)).to.be.false
    })

    it('should not return true if for one everything is undefined but for the other properties are set', function() {
      let change1 = new Change
      let change2 = new Change
      change2.properties = ['a', 'b']
      expect(change1.equals(change2)).to.be.false
    })

    it('should return true if the entity name is the same', function() {
      let change1 = new Change('Entity')
      let change2 = new Change('Entity')
      expect(change1.equals(change2)).to.be.true
    })

    it('should not return true if the entity name is different', function() {
      let change1 = new Change('Entity1')
      let change2 = new Change('Entity2')
      expect(change1.equals(change2)).to.be.false
    })

    it('should return true if the entity has the same properties', function() {
      let change1 = new Change({ a: 'a', b: 'b' })
      let change2 = new Change({ a: 'a', b: 'b' })
      expect(change1.equals(change2)).to.be.true
    })

    it('should not return true if the entity has different properties', function() {
      let change1 = new Change({ a: 'a', b: 'b' })
      let change2 = new Change({ a: 'a' })
      expect(change1.equals(change2)).to.be.false
    })

    it('should not return true if the entity has the same properties but with different values', function() {
      let change1 = new Change({ a: 'a', b: 'b' })
      let change2 = new Change({ a: 'a', b: 'c' })
      expect(change1.equals(change2)).to.be.false
    })

    it('should return true if the method is the same', function() {
      let change1 = new Change
      let change2 = new Change
      change1.method = 'delete'
      change2.method = 'delete'
      expect(change1.equals(change2)).to.be.true
    })

    it('should not return true if the methods are different', function() {
      let change1 = new Change
      let change2 = new Change
      change1.method = 'delete'
      change2.method = 'update'
      expect(change1.equals(change2)).to.be.false
    })

    it('should return true if the properties are the same', function() {
      let change1 = new Change
      let change2 = new Change
      change1.properties = ['a', 'b']
      change2.properties = ['a', 'b']
      expect(change1.equals(change2)).to.be.true
    })

    it('should not return true if the properties are different', function() {
      let change1 = new Change
      let change2 = new Change
      change1.properties = ['a', 'b']
      change2.properties = ['a']
      expect(change1.equals(change2)).to.be.false
    })
  })
})

class TestEntity1 {}