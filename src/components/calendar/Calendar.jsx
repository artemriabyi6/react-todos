import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../calendar/caledar.css";

const CalendarTodo = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState("");
  const [taskTime, setTaskTime] = useState(9);

  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  // Відновлення даних після завантаження сторінки
  useEffect(() => {
    // Перевірка чи є в localStorage збережені задачі
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
      console.log("Tasks loaded from localStorage", JSON.parse(storedTasks));
    } else {
      console.log("No tasks found in localStorage.");
    }

    // Завантажуємо поточну дату
    const storedDate = localStorage.getItem("currentDate");
    if (storedDate) {
      const parsedDate = new Date(storedDate);
      if (!isNaN(parsedDate)) {
        setCurrentDate(parsedDate);
        setSelectedDay(parsedDate.getDate());
      }
    }
  }, []);

  // Збереження даних при оновленні задач
  useEffect(() => {
    if (Object.keys(tasks).length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log("Tasks saved to localStorage", tasks);
    }
  }, [tasks]);

  // Збереження поточної дати
  useEffect(() => {
    localStorage.setItem("currentDate", currentDate.toISOString());
    console.log("Current date saved to localStorage", currentDate);
  }, [currentDate]);

  const handleSelectDay = (day) => {
    setSelectedDay(day);
  };

  const handleAddTask = () => {
    if (newTask.trim() === "") return;

    // Створюємо ключ для поточної дати
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
    const updatedTasks = {
      ...tasks,
      [dateKey]: [...(tasks[dateKey] || []), { text: newTask, time: taskTime }],
    };
    setTasks(updatedTasks);
    setNewTask("");
    setTaskTime(9);
  };

  const handleDeleteTask = (index) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`;
    const updatedTasks = tasks[dateKey].filter((_, i) => i !== index);
    setTasks({ ...tasks, [dateKey]: updatedTasks });
  };

  const handleTimeChange = (amount) => {
    setTaskTime((prev) => Math.max(0, prev + amount));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

 
 

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  return (
    <div className="calendar-todo">
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>{"<"}</button>
          <h2>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <button onClick={handleNextMonth}>{">"}</button>
        </div>
        <div className="days-grid">
          {[...Array(daysInMonth)].map((_, index) => (
            <motion.div
              key={index + 1}
              className={`day ${selectedDay === index + 1 ? "selected" : ""}`}
              onClick={() => handleSelectDay(index + 1)}
              whileTap={{ scale: 0.9 }}
            >
              {index + 1}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="todo-section">
        <div className="task-input">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a task"
          />
          <div className="time-selector">
            <button onClick={() => handleTimeChange(-1)}>-1h</button>
            <span>{taskTime}:00</span>
            <button onClick={() => handleTimeChange(1)}>+1h</button>
          </div>
          <button onClick={handleAddTask}>Add Task</button>
        </div>

        <ul className="task-list">
          <AnimatePresence>
            {(tasks[`${currentDate.getFullYear()}-${currentDate.getMonth()}-${selectedDay}`] || []).map((task, index) => (
              <motion.li
                key={index}
                className="task-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <span>{index + 1}. {task.text} ({task.time}:00)</span>
                <button className="delete-btn" onClick={() => handleDeleteTask(index)}>✖</button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default CalendarTodo;
