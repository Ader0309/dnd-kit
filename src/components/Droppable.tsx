import { useDroppable } from "@dnd-kit/core"
interface DroppableProps {
  children: React.ReactNode;
  id: any
}
export function Droppable(props: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    // data:{
    //   id:props.id
    // }
  })
  const style = {
    color: isOver ? "green" : undefined,
    width: "80px",
    height: "80px",
    border: "1px solid black",
    margin: "5px",
    backgroundColor: isOver ? "lightpink" : "",
    display: "flex"
  }
  return (
    <div ref={setNodeRef} style={style}>{props.children}</div>
  )
}
