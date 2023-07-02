/*
 * @Author: 123 dian.peng.zhao@gds.ey.com
 * @Date: 2023-06-18 11:31:34
 * @LastEditors: 123 dian.peng.zhao@gds.ey.com
 * @LastEditTime: 2023-07-02 16:46:41
 * @FilePath: \前端文档\DOM\操作练习\todoList\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 定义一个Task类
class Task {
  constructor(description) {
    this.description = description;
    this.completed = false;
  }

  complete() {
    this.completed = true;
  }

  uncomplete() {
    this.completed = false;
  }
}

// 定义一个TodoList类
class TodoList {
  constructor(data) {
    this.tasks = data.map((item) => new Task(item.description));
  }

  addTask(description) {
    const task = new Task(description);
    this.tasks.push(task);
    return task;
  }

  removeTask(index) {
    this.tasks.splice(index, 1);
  }

  completeTask(index) {
    this.tasks[index].complete();
  }

  uncompleteTask(index) {
    this.tasks[index].uncomplete();
  }
}

class UITodoList {
  constructor() {
    this.ui_data = new TodoList(dataList);
    this.doms = {
      taskList: document.getElementById("task-list"),
      taskInput: document.getElementById("new-task"),
      addTaskBtn: document.getElementById("add-task"),
    };
    this.createElement();
  }
  //  根据数据创建元素
  createElement() {
    for (let i = 0; i < this.ui_data.tasks.length; i++) {
      const task = this.ui_data.tasks[i];
      this.createSingleElement(task, i);
    }
  }
  // 创建单个元素
  createSingleElement(task, index) {
    // 创建一个li元素
    let li = document.createElement("li");
    // 创建一个input元素
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";//设置input的类型为复选框
    // 设置属性
    checkbox.setAttribute("data-index", index);
    // 状态改变成task任务的状态
    checkbox.checked = task.completed;
    // 创建span
    let span = document.createElement("span");
    // 填充内容
    span.textContent = task.description;
    // 创建一个按钮
    let button = document.createElement("button");
    // 设置属性
    button.setAttribute("data-index", index);
    // 填充内容
    button.textContent = "Remove";
    // 节点上树
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(button);
    this.doms.taskList.appendChild(li);
  }

  addTask() {
    const description = this.doms.taskInput.value;
    let task = this.ui_data.addTask(description);
    this.createSingleElement(task, this.ui_data.tasks.length - 1);
    this.doms.taskInput.value = "";
  }

  removeTask(index) {
    this.ui_data.removeTask(index);
    this.doms.taskList.removeChild(this.doms.taskList.children[index]);
  }

  completeTask(index) {
    this.ui_data.completeTask(index);
    this.updateState(index);
  }
  uncompleteTask(index) {
    this.ui_data.uncompleteTask(index);
    this.updateState(index);
  }
  //   根据状态更新input 的checked状态
  updateState(index) {
    let checkbox =
      this.doms.taskList.children[index].getElementsByTagName("input");
    checkbox.checked = this.ui_data.tasks[index].completed;
  }
}

let todoList = new UITodoList();

todoList.doms.addTaskBtn.addEventListener("click", () => {
  todoList.addTask();
});
todoList.doms.taskList.addEventListener("click", (e) => {
  let target = e.target;
//   let index = target.getAttribute("data-index");
  let index = [...todoList.doms.taskList.children].indexOf(target.parentNode);
  if (target.tagName === "BUTTON") {//删除按钮
    todoList.removeTask(index);
  } else if (target.tagName === "INPUT") {//复选框
    if (target.checked) {//选中状态
      todoList.completeTask(index);
    } else {//取消状态
      todoList.uncompleteTask(index);
    }
  }
});
