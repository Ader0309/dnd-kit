import React, { useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";
import Draggable from "./components/Draggable";
import { Droppable } from "./components/Droppable";

export default function App() {
  const containers = ["A", "B", "C", "D", "E", "F", "H", "I"];
  const draggers = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const [containerContents, setContainerContents] = useState<Record<string, string | null>>({});
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overContainer, setOverContainer] = useState<UniqueIdentifier | null>(null);
  const [draggerPool, setDraggerPool] = useState<string[]>(draggers);
  // console.log(containerContents);
  // {a:null,B:"5",C:"3"...}
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragOver(event: DragOverEvent) {
    const { over } = event;
    setOverContainer(over ? over.id : null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;

    if (over && containers.includes(over.id as string)) {
      setContainerContents(prev => {
        const newContents = { ...prev };
        // 目標 drop 中已有的 item
        const targetItem = newContents[over.id as string];

        // 找出 active item 原本的位置（即要被替換的 drop）
        const previousContainer = Object.keys(newContents).find(
          key => newContents[key] === active.id
        );

        // 如果目標 drop 中已有 item 且原本的 container 不同，進行互換
        if (targetItem && previousContainer && previousContainer !== over.id) {
          newContents[previousContainer] = targetItem; // 將目標 drop 的 item 放回到原本的 drop
        } else if (previousContainer) {
          // 如果沒有要互換，只是移動到空的 drop，則清空原本 container
          newContents[previousContainer] = null;
        }

        // 將 active item 放置於新的 drop 中
        newContents[over.id as string] = active.id as string;

        // 從 dragger pool 中移除 active item
        setDraggerPool(prevPool => prevPool.filter(id => id !== active.id));

        // 如果有目標 item，將其放回 dragger pool（這是從目標 drop 中移除的 item）
        if (targetItem) {
          setDraggerPool(prevPool => [...prevPool, targetItem]);
        }

        return newContents;
      });
    }

    setActiveId(null);
    setOverContainer(null);
  }


  // Function to check if a dragger is still in the pool
  const isDraggerInPool = (draggerId: string) => {
    return draggerPool.includes(draggerId) && !Object.values(containerContents).includes(draggerId);
  };

  return (
    <div style={{ overflow: 'hidden', width: "500px", height: "600px", backgroundColor: "lightblue" }}>
      <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
          {draggers.map((id) => (
            isDraggerInPool(id) && (
              <Draggable key={id} id={id}>
                Drag {id}
              </Draggable>
            )
          ))}
        </div>
        <div style={{
          display: "flex",
          width: "380px",
          border: "1px solid black",
          flexWrap: "wrap",
          justifyContent: "center",
          position: "absolute",
          top: "300px",
          left: "50px",
          overflow: "hidden"
        }}>
          {containers.map((id) => (
            <Droppable key={id} id={id}>
              {containerContents[id] ? (
                <Draggable id={containerContents[id]!}>
                  Drag {containerContents[id]}
                </Draggable>
              ) : (
                overContainer === id && activeId ? (
                  <div style={{
                    opacity: 0.5,
                    backgroundColor: 'lightgreen',
                    padding: '10px',
                    border: '1px solid black',
                    borderRadius: '4px'
                  }}>
                    Preview: {activeId}
                  </div>
                ) : id
              )}
            </Droppable>
          ))}
        </div>
      </DndContext>
    </div>
  )
}