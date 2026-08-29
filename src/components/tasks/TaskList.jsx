import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, onClaim, claiming = false, compact = false }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-4xl mb-3">🌙</p>
        <p className="text-sm text-[#8A7C63]">Không có nhiệm vụ nào</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-3"}`}>
      {tasks.map((task, i) => (
        <TaskItem
          key={task.id}
          task={task}
          index={i}
          onClaim={onClaim}
          claiming={claiming}
          compact={compact}
        />
      ))}
    </div>
  );
}
