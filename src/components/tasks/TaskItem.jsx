import TaskProgress from "./TaskProgress.jsx";
import TaskReward from "./TaskReward.jsx";

const TASK_GRADIENTS = [
  "from-violet-400 to-purple-400",
  "from-emerald-400 to-teal-400",
  "from-amber-400 to-orange-400",
  "from-pink-400 to-rose-400",
  "from-cyan-400 to-blue-400",
  "from-indigo-400 to-violet-400",
  "from-yellow-400 to-amber-400",
  "from-rose-400 to-pink-400",
];

export default function TaskItem({ task, index = 0, onClaim, claiming = false, compact = false }) {
  const isDone = task.completed && !task.claimed;

  if (compact) {
    return (
      <div className="flex items-center gap-2.5 group">
        <span
          className={`w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br ${TASK_GRADIENTS[index % TASK_GRADIENTS.length]} text-white flex items-center justify-center text-sm shadow-sm`}
        >
          {task.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-gray-700 truncate leading-tight mb-0.5">
            {task.name}
          </p>
          <TaskProgress
            progress={task.progress}
            target={task.target}
            completed={task.completed}
            claimed={task.claimed}
          />
        </div>
        <span className="shrink-0 text-[11px] font-bold text-amber-600 whitespace-nowrap">
          +{task.rewardCoin}💰
        </span>
        {task.claimed ? (
          <span className="shrink-0 text-[10px] font-bold text-teal-500 bg-teal-50 px-2 py-0.5 rounded-full">✓</span>
        ) : isDone ? (
          <button
            onClick={() => onClaim?.(task.id)}
            className="shrink-0 text-[10px] font-bold text-white bg-gradient-to-r from-amber-400 to-orange-400 px-2.5 py-1 rounded-full hover:from-amber-500 hover:to-orange-500 transition active:scale-95 shadow-sm"
          >
            Nhận
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="note-card p-4 flex items-center gap-4">
      <span
        className={`w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br ${TASK_GRADIENTS[index % TASK_GRADIENTS.length]} text-white flex items-center justify-center text-xl shadow-md`}
      >
        {task.icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink truncate">{task.name}</p>
        <p className="text-xs text-[#8A7C63] mt-0.5">{task.description}</p>
        <TaskProgress
          progress={task.progress}
          target={task.target}
          completed={task.completed}
          claimed={task.claimed}
        />
      </div>

      <div className="shrink-0 flex flex-col items-center gap-1">
        <TaskReward
          rewardCoin={task.rewardCoin}
          rewardXp={task.rewardXp}
          completed={task.completed}
          claimed={task.claimed}
          onClaim={() => onClaim?.(task.id)}
          claiming={claiming}
        />
      </div>
    </div>
  );
}
