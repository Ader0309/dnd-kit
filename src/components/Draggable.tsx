import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from "@dnd-kit/utilities"

interface DraggableProps {
    children: React.ReactNode;
    id: any;
}

export default function Draggable(props: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: props.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none",
    opacity: isDragging ? 0.5 : 1,  // 添加透明度變化以提供視覺反饋
    cursor: 'grab',  // 改變鼠標樣式以表明可拖動
    padding: '10px',
    margin: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f0f0f0',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
    >
      {props.children}
    </div>
  );
}