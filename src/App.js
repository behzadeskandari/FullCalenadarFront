import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Otp from "./components/Otp";
import Board from "./components/Board";
import Stepper from "./components/Stepper"; // App.js
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // needs additional webpack config!
import timeGridPlugin from "@fullcalendar/timegrid";

import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import axios from "axios";
import CustomModal from "./components/Modal";
const ComponentList = [
  <div>CompoenntOne</div>,
  <div>CompoenntTwo</div>,
  <div>CompoenntThree</div>,
  <div>CompoenntFour</div>,
];

function App() {
  const [calendarKey, setCalendarKey] = useState(0);
  const [events, setEvents] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newModalVisible, setNewModalVisible] = useState(false);
  const [selectedEventData, setSelectedEventData] = useState(null);
  const calendarRef = React.useRef();
  // Function to handle opening the edit modal when clicking on an event card
  const handleClickEvent = (eventClickInfo) => {
    setSelectedEventData(eventClickInfo.event);
    console.log(eventClickInfo, "eventClickInfo");
    console.log(eventClickInfo.event, "eventClickInfo.event");
    console.log(eventClickInfo.event.id, "eventClickInfo.event.id");
    console.log(
      eventClickInfo.event.extendedProps,
      "eventClickInfo.event.extendedProps"
    );
    setEditModalVisible(true);
    //setEvents([{ ...events, events: selectedEventData }]);
  };
  const handleEventAdd = (addedEvent) => {
    // Here you can add the new event to your events state.
    console.log(addedEvent, "addedEvent");
    const data = {
      title: addedEvent.editedTitle,
      description: addedEvent.editedDescription,
      start: addedEvent.formattedStart,
      end: addedEvent.formattedEnd,
      eventType: addedEvent.eventType,
    };
    setEvents((prevEvents) => [...prevEvents, data]);
    console.log(events, "events handleEventAdd");
    setCalendarKey((prevKey) => prevKey + 1);
    const calendarApi = calendarRef.current.getApi(); // Assuming you have a ref to the FullCalendar component
    console.log(calendarApi, "calendarApi handleEventAdd");
    calendarApi.refetchEvents();
    calendarRef.current.render(); // This will refetch events from the event source and rerender the calendar
  };
  const updateEvent = (id, updatedEventData) => {
    // setEvents((prevEvents) => {
    //   return prevEvents.map((event) => {
    //     console.log(event, "FOund FOund");
    //     console.log(id, "idid");
    //     if (event.id === id) {
    //       // Found the event to update
    //       console.log(" INSIDE FOund FOund");

    //       return { ...events, ...updatedEventData };
    //     }
    //     return event; // Return the event unchanged if it's not the one to update
    //   });
    // });
    const eventIndex = events.findIndex((event) => event.id === id);

    // If eventIndex is not found, return
    if (eventIndex === -1) {
      console.error("Event not found");
      return;
    }

    // Update the event at the found index
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = {
      ...updatedEvents[eventIndex],
      ...updatedEventData,
    };

    // Update the events state with the new events array
    setEvents(updatedEvents);
    console.log(events, "evemts");
    // If you want to update the event in the FullCalendar view, use its methods
    const calendarApi = calendarRef.current.getApi(); // Assuming you have a ref to the
    // FullCalendar component
    const eventToUpdate = calendarApi.getEventById(id); // Get the event by id
    eventToUpdate.setProp("title", updatedEventData.title); // Update the title
    eventToUpdate.setExtendedProp("description", updatedEventData.description); //
    calendarApi.render();
    console.log(events, "evemts");
  };
  // Function to handle opening the new modal when clicking on the custom button
  const handleNewModalOpen = () => {
    setNewModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setSelectedEventData(null);
  };
  useEffect(() => {
    fetchEvents();
  }, [calendarKey]);
  // Function to handle opening the modal
  const handleOpenModal = () => {
    alert("hi");
    //setModalVisible(true);
  };
  const fetchEvents = () => {
    try {
      axios
        .get("https://localhost:7224/auth/CalendarEvent/Get")
        .then(function (response) {
          // handle success
          console.log(response.data);
          const data = response.data;
          setEvents(data);
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
    // const data = [
    //   {
    //     title: "Meeting",
    //     start: "2024-05-14" + "T09:00:00",
    //     end: "2024-05-14" + "T17:00:00",
    //     startStr: "2024-05-20" + "T09:00:00",
    //     endStr: "2024-05-26" + "T09:00:00",
    //     description: "TEst Description Meeting",
    //     eventType: EventType.Meeting,
    //   },
    //   {
    //     title: "Appointment",
    //     start: "2024-05-13" + "T09:00:00",
    //     end: "2024-05-13" + "T17:00:00",
    //     startStr: "2024-05-29" + "T09:00:00",
    //     endStr: "2024-05-30" + "T09:00:00",
    //     description: "TEst Description Appointment",
    //     eventType: EventType.Appointment,
    //   },
    //   {
    //     title: "Call",
    //     start: "2024-05-12" + "T09:00:00",
    //     end: "2024-05-12" + "T17:00:00",
    //     startStr: "2024-05-29" + "T09:00:00",
    //     endStr: "2024-05-30" + "T09:00:00",
    //     description: "TEst Description Appointment",
    //     eventType: EventType.Call,
    //   },
    // ];
    //setEvents(data);
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* <NavBar /> */}
        {/* <Otp /> */}
      </header>
      {/* <Board /> */}
      {/* <Stepper
        ComponentList={ComponentList}
        ComponentLenght={ComponentList.length}
      /> */}
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin, bootstrap5Plugin]}
        initialView="timeGridWeek"
        events={formatEvents()}
        editable={true}
        timeHint="10:00"
        eventBackgroundColor="red"
        eventMinHeight={"80%"}
        //eventColor="white"
        //eventBorderColor="grey"
        eventClassNames={"test"}
        themeSystem="bootstrap5"
        allDaySlot={false}
        allDayClassNames={"testAllDay"}
        buttonText={{
          prev: "prev",
          next: "next",
          today: "Go To Today",
        }}
        // businessHours={{
        //   title: "bussines Hours",
        //   allow: false,
        //   color: "orange",
        // }}
        buttonIcons={{
          prev: "bi bi-chevron-left",
          next: "bi bi-chevron-right",
          prevYear: "bi bi-chevron-double-left",
          nextYear: "bi bi-chevron-double-right",
        }}
        eventAdd={handleEventAdd}
        displayEventEnd={true}
        displayEventTime={true}
        eventDisplay="block"
        aspectRatio={4}
        customButtons={{
          customButton: {
            text: "Add New",
            hint: "add",
            click: handleNewModalOpen, // Attach event handler to custom button
          },
        }}
        headerToolbar={{
          left: "customButton today prev,next",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        eventTextColor="white"
        weekNumberClassNames={"testWeekNumber"}
        key={calendarKey}
        height={"auto"}
        weekNumberFormat={{
          week: "short",
        }}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        titleFormat={{
          month: "long",
          year: "numeric",
          day: "numeric",
          weekday: "long",
          hour12: true,
        }}
        eventClick={handleClickEvent}
        eventContent={renderEventContent}
      />
      {selectedEventData && (
        <CustomModal
          calendarRef={calendarRef}
          setSelectedEventData={setSelectedEventData}
          show={editModalVisible}
          onClose={handleCloseEditModal}
          id={selectedEventData.id}
          selectedEventData={selectedEventData}
          title={selectedEventData.title}
          description={selectedEventData.extendedProps?.description}
          start={selectedEventData.start}
          end={selectedEventData.end}
          editMode={true}
          updateEvent={updateEvent} // Pass the function as a prop
        />
      )}
      {newModalVisible && (
        <CustomModal
          show={newModalVisible}
          //setSelectedEventData={setSelectedEventData}
          onClose={() => setNewModalVisible(false)}
          //title=""
          //description=""
          //start={null}
          //end={null}
          editMode={false}
          addEvent={handleEventAdd}
        />
      )}
    </div>
  );

  function formatEvents() {
    //console.log(e, "eeeee");
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      description: event.description,
      eventType: event.eventType,
      classNames: getEventColor(event),
    }));
  }

  function getEventColor(event) {
    // Determine classNames based on the event properties
    // For example, you can switch on event properties and return classNames accordingly
    // Here's a basic example:
    console.log(event.eventType, "event.EventType");
    switch (event.eventType) {
      case EventType.Meeting:
        return "event-meeting"; // CSS class for Meeting events
      case EventType.Appointment:
        return "event-appointment"; // CSS class for Appointment events
      // Add more cases as needed for different event types
      case EventType.Call:
        return "event-call"; // CSS class for Appointment events
      // Add more cases as needed for different event types
      default:
        return "event-default"; // Default CSS class
    }
  }

  function renderEventContent(eventInfo) {
    console.log(eventInfo.event.extendedProps, "eventInfo");
    return (
      <div
        className={`fc-event-card ${
          eventInfo.event.extendedProps.eventType === EventType.Meeting
            ? "meeting-color"
            : eventInfo.event.extendedProps.eventType === EventType.Appointment
            ? "appointment-color"
            : eventInfo.event.extendedProps.eventType === EventType.Call
            ? "call-color"
            : ""
        }`}
      >
        <div className="fc-event-date">
          {formatDate(eventInfo.event.start)}
          <span className="m2">
            {eventInfo.event.extendedProps.eventType === EventType.Meeting ? (
              <div>
                <span className="GreenTick" alt="pic" />
              </div>
            ) : eventInfo.event.extendedProps.eventType ===
              EventType.Appointment ? (
              <div>
                <span className="RedIcon" alt="pic" />
              </div>
            ) : eventInfo.event.extendedProps.eventType === EventType.Call ? (
              <div>
                <span className="OrangeIcon" alt="pic" />
              </div>
            ) : (
              <div></div>
            )}
          </span>
        </div>
        <div className="fc-event-icons">
          {/* Add your Bootstrap icon class here */}
          <i className="bi bi-calendar"></i>
          <div className="fc-event-title">{eventInfo.event.title}</div>
        </div>

        <div className="fc-event-icon">
          {/* Add your Bootstrap icon class here */}
          <div className="fc-event-description">
            {/* <i className="bi bi-check"></i> */}
            <span className="description">
              {eventInfo.event.extendedProps.description}
            </span>
          </div>
        </div>
        <div className="fc-event-title">
          <span>
            {eventInfo.event.extendedProps.eventType === EventType.Meeting ? (
              <div>
                <span className="GreenClock" alt="pic" />
              </div>
            ) : eventInfo.event.extendedProps.eventType ===
              EventType.Appointment ? (
              <div>
                <span className="RedClock" alt="pic" />
              </div>
            ) : eventInfo.event.extendedProps.eventType === EventType.Call ? (
              <div>
                <span className="OrangeClock" alt="pic" />
              </div>
            ) : (
              <div></div>
            )}
          </span>
          {eventInfo.timeText}
        </div>
      </div>
    );
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: "short", month: "short", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate.replace(/\./g, ""); // Remove periods from weekday
  }
}

const EventType = {
  Meeting: 0,
  Appointment: 1,
  Call: 2,
};
export default App;
