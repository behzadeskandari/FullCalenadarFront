import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
const CustomModal = ({
  show,
  onClose,
  title,
  description,
  start,
  end,
  editMode,
  setSelectedEventData,
  selectedEventData,
  updateEvent,
  id,
  addEvent,
  calendarRef,
}) => {
  const eventTypes = [
    { value: "Meeting", label: "Meeting", key: 0 },
    { value: "Appointment", label: "Appointment", key: 1 },
    { value: "Call", label: "Call", key: 2 },
  ];
  // State variables to track edited values
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [startDate, setStartDate] = useState(
    start ? start.toString().substring(0, 10) : ""
  );
  const [startTime, setStartTime] = useState(
    start ? start.toString().substring(11, 16) : ""
  );
  const [endDate, setEndDate] = useState(
    end ? end.toString().substring(0, 10) : ""
  );
  const [endTime, setEndTime] = useState(
    end ? end.toString().substring(11, 16) : ""
  );
  const [eventType, setEventType] = useState(
    selectedEventData?.extendedProps?.eventType ==
      eventTypes[selectedEventData?.extendedProps?.eventType] || ""
  );
  console.log(
    selectedEventData?.extendedProps?.eventType ==
      eventTypes[selectedEventData?.extendedProps?.eventType],
    "selectedEventData?.extendedProps?."
  );
  console.log(selectedEventData?.extendedProps?.eventType, "?.extendedProps?.");
  console.log(
    eventTypes[selectedEventData?.extendedProps?.eventType],
    "selectedEventData?.?."
  );

  // Function to handle saving edited values
  //   const handleSave = () => {
  //     // Implement save functionality here
  //     console.log(id, "idididididid");
  //     console.log(
  //       selectedEventData,
  //       "selectedEventDataselectedEventDataselectedEventData"
  //     );
  //     if (editMode) {
  //       console.log(
  //         selectedEventData.extendedProps,
  //         "extendedPropsextendedProps"
  //       );
  //       updateEvent(id, {
  //         ...selectedEventData,
  //         title: editedTitle,
  //         extendedProps: {
  //           ...selectedEventData.extendedProps,

  //           description: editedDescription,
  //         },
  //       });
  //     }
  //     console.log("Edited title:", editedTitle);
  //     console.log("Edited description:", editedDescription);
  //     // setSelectedEventData([
  //     //   { title: editedTitle, description: { extendedProps: editedDescription } },
  //     // ]);
  //     onClose(); // Close the modal after saving
  //   };
  const handleSave = () => {
    const formattedStart = `${startDate}T${startTime}`;
    const formattedEnd = `${endDate}T${endTime}`;

    if (editMode) {
      // Update existing event
      updateEvent(selectedEventData.id, {
        ...selectedEventData,
        title: editedTitle,
        extendedProps: {
          ...selectedEventData.extendedProps,
          description: editedDescription,
          eventType: eventType,
        },
        start: formattedStart,
        end: formattedEnd,
      });
      onClose();
    } else {
      // Add new event

      try {
        const calendarEvent = {
          Title: editedTitle,
          Description: editedDescription,
          Start: formattedStart,
          End: formattedEnd,
          EventType: eventTypes.find((type) => type.value === eventType).key,
        };
        axios
          .post(
            "https://localhost:7224/auth/CalendarEvent/PostEvent",
            calendarEvent
          )
          .then(function (response) {
            // handle success
            console.log(response.data);
            const data = response.data;
            addEvent(data);

            onClose();
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
          .finally(function () {
            // always executed
          });

        // const response = await fetch(
        //   "https://localhost:7224/api/CalendarEvent/Get"
        // );
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    // Close the modal after saving
  };
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? "Edit Event" : "Add Event"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              autoComplete="additional-name"
              type="text"
              placeholder="Enter title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              autoComplete="additional-name"
              as="textarea"
              placeholder="Enter description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formStart">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              autoComplete="additional-name"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              autoComplete="additional-name"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEnd">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              autoComplete="additional-name"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Form.Label>End Time</Form.Label>
            <Form.Control
              autoComplete="additional-name"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEventType">
            <Form.Label>Event Type</Form.Label>
            <Form.Control
              autoComplete="additional-name"
              as="select"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="">Select Event Type</option>
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default CustomModal;
