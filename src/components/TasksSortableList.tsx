import { Task } from "@/lib/store";
import { TaskCard } from "./TaskCard";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  tasks: Task[];
  onComplete: (id: string, anchor: { x: number; y: number }) => void;
  onReorder: (orderedIds: string[]) => void;
}

export function TasksSortableList({ tasks, onComplete, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = tasks.map((t) => t.id);
    const oldIdx = ids.indexOf(String(active.id));
    const newIdx = ids.indexOf(String(over.id));
    if (oldIdx < 0 || newIdx < 0) return;
    onReorder(arrayMove(ids, oldIdx, newIdx));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="grid md:grid-cols-2 gap-4">
          {tasks.map((t) => (
            <SortableTaskItem key={t.id} task={t} onComplete={onComplete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableTaskItem({
  task,
  onComplete,
}: {
  task: Task;
  onComplete: (id: string, anchor: { x: number; y: number }) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto" as const,
  };

  const handle = (
    <button
      ref={setNodeRef as never}
      {...attributes}
      {...listeners}
      type="button"
      className="font-pixel text-[10px] px-1.5 py-1 border border-pixel-purple text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
      title="Drag to reorder"
    >
      ⋮⋮
    </button>
  );

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TaskCard task={task} onComplete={onComplete} dragHandle={handle} />
    </div>
  );
}
