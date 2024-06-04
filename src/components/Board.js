import React from "react";

export default function Board() {
  const [backlog, setBacklog] = React.useState([]);
  const [inprogress, setInprogress] = React.useState([]);
  const [completed, setCompleted] = React.useState([]);
  const [newTicket, setNewTicket] = React.useState("");
  const handleTicket = () => {
    if (newTicket.trim() !== "") {
      setBacklog([...backlog, newTicket]);
      setNewTicket("");
    }
  };
  const handleDragStart = (e, task, sourceColumn) => {
    e.dataTransfer.setData("task", task);
    e.dataTransfer.setData("sourceColumn", sourceColumn);
  };
  const handleDrop = (e, targetColumn) => {
    const task = e.dataTransfer.getData("task");
    const sourceColumn = e.dataTransfer.getData("sourceColumn");
    if (targetColumn !== sourceColumn) {
      switch (targetColumn) {
        case "Backlog":
          setBacklog([...backlog, task]);
          break;

        case "InProgress":
          setInprogress([...inprogress, task]);
          break;

        case "Completed":
          setCompleted([...completed, task]);
          break;
        default:
          break;
      }

      switch (sourceColumn) {
        case "Backlog":
          setBacklog(backlog.filter((t) => t !== task));
          break;

        case "InProgress":
          setInprogress(inprogress.filter((t) => t !== task));
          break;

        case "Completed":
          setCompleted(completed.filter((t) => t !== task));
          break;

        default:
          break;
      }
    }
  };
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Agile Board</h1>
      <div
        className="add-ticket"
        style={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "center",
        }}
      >
        <input
          style={{
            outline: "none",
            margin: "7px",
            padding: "7px",
            borderRadius: "6px",
            borderColor: "#fff",
            background: "#e7e7e7",
            border: "1px solid #efefef",
          }}
          type="text"
          value={newTicket}
          onChange={(e) => setNewTicket(e.target.value)}
          placeholder="Enter New Ticket"
        />
        <button
          style={{
            background: "blue",
            color: "white",
            padding: "7px",
            margin: "7px",
            border: "1px solid blue",
            borderRadius: "7px",
          }}
          onClick={handleTicket}
        >
          Add Ticket
        </button>
      </div>
      <div
        className="board"
        style={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "center",
        }}
      >
        <Column
          title="Backlog"
          task={backlog}
          onDrop={(e) => handleDrop(e, "Backlog")}
          onDragStart={handleDragStart}
        />
        <Column
          title="InProgress"
          task={inprogress}
          onDrop={(e) => handleDrop(e, "InProgress")}
          onDragStart={handleDragStart}
        />
        <Column
          title="Completed"
          task={completed}
          onDrop={(e) => handleDrop(e, "Completed")}
          onDragStart={handleDragStart}
        />
      </div>
    </div>
  );
}

const Column = ({ title, task, onDrop, onDragStart }) => {
  return (
    <div
      className="column"
      style={{
        width: "150px",
        height: "200px",
        backgroundColor: "#efefef",
        margin: "5px",
        borderRadius: "5px",
        textAlign: "center",
      }}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <h3>{title}</h3>
      {task.map((tas, index) => (
        <div
          draggable
          key={index}
          className="task"
          onDragStart={(e) => onDragStart(e, tas, title)}
        >
          {tas}
        </div>
      ))}
    </div>
  );
};
