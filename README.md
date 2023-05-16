# Knight Change by Coderitter

A data structure to describe and listen to changes of entities. It is a great fit for updating user interfaces like in a React app. The React components can rerender if any of the entities they display change.

## Install

`npm install knight-change`

## Overview

There is a `Change` class which is used for describing a change and to define a listener which wants to react to certain changes.

### Describe a change

A change object consists of the name of the entity that changed, the entity itself and an arbitrary the method name, depending on your use case.

```typescript
import { Change } from 'knight-change'

// A task was created
let task = new Task
task.id = 5
task.title = 'Clean up room'

let createChange = new Change(task, 'create')

createChange.entityName == 'Task'
createChange.entity == { id: 5, title: 'Clean up room' }
createChange.method == { method: 'create' }

// A task was updated
task.title = 'Clean up room and do homework'

let updateChange = new Change(task, 'update', [ 'title' ])

updateChange.entityName == 'Task'
updateChange.entity == { id: 5, title: 'Clean up room and do homework' }
updateChange.method == 'update'
updateChange.props == [ 'title' ]

// Task was deleted
task = undefined

let deleteChange = new Change(task, 'delete')

deleteChange.entityName == 'Task'
deleteChange.entity == { id: 5, title: 'Clean up room and do homework' }
deleteChange.method == 'delete'
```

### Define a listener using the same Change class

```typescript
// Listen to any change of any task
new Change('Task')
new Change(Task)

// Listen to any change of a task with id 5
new Change('Task', { id: 5 })
new Change(Task, { id: 5 })
new Change(new Task(5))

// Listen to any update of any task
new Change('Task', 'update')
new Change(Task, 'update')

// Listen to any update of a task with id 5
new Change('Task', { id: 5 }, 'update')
new Change(Task, { id: 5 }, 'update')
new Change(new Task(5), 'update')

// Listen to any title update of any task
new Change('Task', 'update', [ 'title' ])
new Change(Task, 'update', [ 'title' ])

// Listen to any title update of a task with id 5
new Change('Task', { id: 5 }, 'update', [ 'title' ])
new Change(Task, { id: 5 }, 'update', [ 'title' ])
new Change(new Task(5), 'update', [ 'title' ])
```

### Check if listeners are triggered by changes

```typescript
// Check if a listener is triggered by a change
listener.triggeredBy(change)

// Check if one of a set of listeners is triggered by a change
let listeners = new Changes(listener1, listener2, listener3)
listeners.triggeredBy(change)

// Check if one of a set of listeners is triggered by a set of changes
let changes = new Changes(change1, change2, change3)
listeners.triggeredBy(changes)
```

### Collect changes with the Changes class

The class `Changes` collects arbitrary many changes.

```typescript
let listeners = new Changes

// Add a change which refers to any updated Task object
changes.add(new Change(Task, 'create'))
changes.changes.length == 1
changes.changes[0].entityName == 'Task'
changes.changes[0].entity == undefined
changes.changes[0].method == 'create'
changes.changes[0].props == undefined


// Add a change which referes to any Task object which was deleted
changes.add(new Change(Task, 'update', 'title'))
// The method add will merge this object into the already existing one
changes.changes.length == 1
changes.changes[0].entityName == 'Task'
changes.changes[0].entity == undefined
changes.changes[0].method == 'update'
changes.changes[0].props == [ 'title' ]

listerners.triggeredBy(new Change(Task, 'delete')) == false
```

### Refine listener

If there are two listeners, one more specific than the other, the most specific listener is chosen.

```typescript
// listens to any change of a task with id 5
let listener1 = new Change(Task, { id: 5 })
// listens to any update of a task with id 5 for the property title
let listener2 = new Change(Task, { id: 5 }, 'update', 'title')

let listeners = [ listener1, listener2 ]

// is triggering because the title changed
let change1 = new Change(new Task(5), 'update', 'title')
listeners.triggeredBy(change1) == true

// is not triggering because the description changed and listener2 only listens to title changes
// meanwhile listener1 is ignored because listener2 is defining the behaviour for updates
let change2 = new Change(new Task(5), 'update', 'description')
listeners.triggeredBy(change2) == false

// is triggering because of listener1
// meanwhile listener2 is ignored because it is only relevant for updates
let change3 = new Change(new Task(5), 'delete')
listeners.triggeredBy(change3) == true
```

We have two competing rules for tasks with an `id` of 5. If the incoming change is an update change then `listener2` used. In any other case `listener1` is used. That means in the case of an update the listener is only interested if the changed property was the `title`.

### Unspecific changes

A change may also be more unspecific. That way you can activate event listeners which otherwise would require a certain change.

```typescript
// relevant to any listener which reacts to a task change in some kind of way
let change = new Change(Task)

// a listener which only listens to the deletion of a task with id 5
let listener = new Change(Task, { id: 5 }, { method: 'delete' })

// the change is nonetheless relevant for the listener because the entity name is the same
listener.triggeredBy(change) == true
```

Here is an example where a more unspecific change is not relevant for a listener.

```typescript
// relevant to any listener which reacts to a Task with id 5 in some kind of way
let change = new Change(Task, { id: 5 })

// a listener which only listens to the deletion of a task with id 7
let listener = new Change(Task, { id: 7 }, 'delete')

// the change is not relevant for the listener because the ids differ
listener.triggeredBy(change) == false
```
