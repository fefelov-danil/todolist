import {addTaskAC, changeTaskAC, removeTaskAC, setTasksAC, tasksReducer, TasksStateType} from './tasks-reducer';
import {addTodolistAC, removeTodoListAC, setTodoListsAC} from "./todolist-reducer";
import {TaskPriorities, TaskStatuses, TaskType, TodoListType} from "api/todoListsAPI";

let startState: TasksStateType
let initialState: TasksStateType
let tasks: Array<TaskType>
let task: TaskType
let todoLists: Array<TodoListType>
let todolist: TodoListType

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                order: 0,
                addedDate: '',
                deadline: '',
                startDate: '',
                description: '',
                priority: TaskPriorities.Middle
            }
        ]
    };
    initialState = {
        "todolistId1": [],
        "todolistId2": []
    }
    tasks = [
        {
            id: "1",
            title: "Unit tests",
            status: TaskStatuses.New,
            todoListId: "todolistId1",
            order: 0,
            addedDate: '',
            deadline: '',
            startDate: '',
            description: '',
            priority: TaskPriorities.Middle
        },
        {
            id: "2",
            title: "StoryBook",
            status: TaskStatuses.New,
            todoListId: "todolistId1",
            order: 0,
            addedDate: '',
            deadline: '',
            startDate: '',
            description: '',
            priority: TaskPriorities.Middle
        },
        {
            id: "3",
            title: "Redux Toolkit",
            status: TaskStatuses.New,
            todoListId: "todolistId1",
            order: 0,
            addedDate: '',
            deadline: '',
            startDate: '',
            description: '',
            priority: TaskPriorities.Middle
        }
    ]
    task = {
        id: "0",
        title: "New task",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        order: 0,
        addedDate: '',
        deadline: '',
        startDate: '',
        description: '',
        priority: TaskPriorities.Middle
    }
    todoLists = [
        {id: 'todolistId1', title: 'Todo1', order: 0, addedDate: ''},
        {id: 'todolistId2', title: 'Todo2', order: 0, addedDate: ''},
        {id: 'todolistId3', title: 'Todo3', order: 0, addedDate: ''}
    ]
    todolist = {id: 'todolistId3', title: 'New todo', order: 0, addedDate: ''}
})

test('Add empty tasks to the correct todolist', () => {
    const action = setTodoListsAC(todoLists)

    const endState = tasksReducer({}, action)

    expect(endState['todolistId1']).toEqual([])
    expect(endState['todolistId2']).toEqual([])
    expect(endState['todolistId3']).toEqual([])
    expect(endState['todolistId4']).toBeUndefined()
})
test('Get a list of tasks in the correct todolist', () => {
    const action = setTasksAC(tasks, 'todolistId1')

    const endState = tasksReducer(initialState, action)

    expect(endState['todolistId2'].length).toBe(0)
    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId1'][0].title).toBe("Unit tests")
    expect(endState['todolistId1'][2].id).toBe("3")
    expect(endState['todolistId1'][4]).toBeUndefined()
});
test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC("todolistId2", "2");

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'].length).toBe(2);
    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'][1].id).toBe('3');
    expect(endState['todolistId1'][1].id).toBe('2');
    expect(endState['todolistId2'][2]).toBeUndefined();

});
test('correct task should be added to correct array', () => {
    const action = addTaskAC(task);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBe('0');
    expect(endState["todolistId2"][0].title).toBe("New task");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})
test('status and title of specified task should be changed', () => {
    task.id = '1'
    const action = changeTaskAC(task)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(3)
    expect(endState['todolistId2'][0].id).toBe('1')
    expect(endState['todolistId2'][0].title).toBe('New task')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.Completed)
});
test('Add empty array to new todoList', () => {
    const action = addTodolistAC(todolist)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId3']).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('bread')
})
test('property with todolistId should be deleted', () => {
    const action = removeTodoListAC("todolistId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
