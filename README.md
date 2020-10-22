# Mega Nice Change

A mega nice change to describe changes of entities.

## Install

`npm install mega-nice-change`

## Overview

### Describe a change using an entity that changed

The journey begins when an entity changed.

```typescript
import { ChangeDescription } from 'mega-nice-change'

let task = {
  id: 5,
  parentId: 33,
  userId: 12
  title: 'Clean up room'
}

let change = ChangeDescription.fullDescription(task, 'update', ['title'])

change == {
  entity: 'Task',

  idProps: {
    id: 5,
    parentId: 33,
    userId: 12
  },

  changes: [{
    method: 'update',
    props: ['title']
  }]
}
```

The static method `fullDescription` will create a full description of the changed object.

- `entity`: The entity name which basically is the class name but in this context we want to think about the changed thing as a database entity.
- `idProps`: Contains any property which identifies the entity. It includes any property named `id` or ending with `Id`.
- `changes`: An array of changes which consists of a change `method` and changed `props`.

If you need different behaviour you can either take the output of this method as a starting point or you just write your own.

### Describe a change that should be relevant

Now that you described a change there are change listeners who would like to decide if a change is relevant for them or not. You do that by describing a change which acts as a template for any incoming change description. Let the code talk.

```typescript
// listen to any change of any tasks
let listener1 = {
  entity: 'Task'
}

// listen to any change of a task with id 5
let listener2 = {
  entity: 'Task',
  idProps: { id: 5 }
}

// listen to any update change of a task with id 5
let listener3 = {
  entity: 'Task',
  idProps: { id: 5 },
  changes: { method: 'update' }
}

// listen to any title update change of a task with id 5
let listener4 = {
  entity: 'Task',
  idProps: { id: 5 },
  changes: { method: 'update', props: ['title'] }
}

// listen to any title update change of any task
let listener4 = {
  entity: 'Task',
  changes: { method: 'update', props: ['title'] }
}

// listen to any parentId or userId update change of the task with id 5
let listener5 = {
  entity: 'Task',
  idProps: { id: 5 },
  changes: { method: 'update', props: ['parentId', 'userId'] }
}

// listen to any delete change of any task with a userId of 12
let listener5 = {
  entity: 'Task',
  idProps: { userId: 12 },
  changes: { method: 'delete' }
}
```

As you can see, you are able to determine fine grained changes that listeners should react to.

Use method `isRelevantFor` to find out if a change is relevant for a listener.

```typescript
change.isRelevantFor(listener)
```

### Using ChangeEvent

To be able to describe numerous changes at once you can use the `ChangeEvent` class.

```typescript
let event = new ChangeEvent(change1, change2, change3)
event.isRelevantFor(listener)
```

### Test if a change is relevant to a set of listener rules

You can describe a set of rules a listener should react to.

```typescript
let rule1 = {
  entity: 'Task',
  idProps: { id: 5 }
}

let rule2 = {
  entity: 'Task',
  idProps: { id: 5 },
  changes: { method: 'update' props: ['parentId'] }
}

let listenerRuleSet = [ description1, description2 ]
```

In this case we have two competing rules for tasks with an `id` of 5. If the incoming change is an update change then `rule2` used. In any other case `rule1` is used. That means in the case of an update the listener is only interested if the changed property was the `parentId`.

### Unspecific change descriptions

A change may also be more unspecific.

```typescript
// relevant to any listener which reacts to Task changes disregarding any idProps and changes
let change = {
  entity: 'Task'
}

let listener = {
  entity: 'Task',
  idProps: { id: 5 },
  changes: { method: 'delete' }
}

change.isRelevantFor(listener) == true
```

```typescript
// relevant to any listener which reacts to Task changes of a task with id 5 disregarding any change methods or changed properties
let change = {
  entity: 'Task',
  idProps: { id: 5 }
}

let listener = {
  entity: 'Task',
  idProps: { id: 5 },
  changes: { method: 'delete' }
}

change.isRelevantFor(listener) == true
```