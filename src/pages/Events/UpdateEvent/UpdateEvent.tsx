import { Button, FormControl, FormLabel, Input, Stack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import GamePicker from "../../../components/GamePicker/GamePicker";
import { cacheRequestAndRelog } from "../../../components/Navbar/Login/LoginScript";
import { EventPicker } from "../Events";

export default function UpdateEvent() {
  const horizontalFormSpacing = "2rem";

  const [gameId, setGameId] = useState(0);
  const [eventId, setEventId] = useState<number>();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventPickerKey, setEventPickerKey] = useState(1); // this causes an upate on the event picker so that description changes show

  const toast = useToast();

  return (
    <div>
      <Breadcrumbs />
      <Stack direction="column" spacing="3rem" className="Form">
        <EventPicker key={eventPickerKey} value={eventId?? 0} changeHandler={event => selectEvent(Number(event.target.value))} />

        <GamePicker isDisabled={eventId == null || eventId === 0} value={gameId} changeHandler={event => setGameId(Number(event.target.value))} />

        <Stack direction="row" spacing={horizontalFormSpacing}>
          <FormControl>
            <FormLabel>Start time</FormLabel>
            <Input isDisabled={eventId == null || eventId === 0} value={start} type="datetime-local" onChange={(event) => {setStart(event.target.value)}} />
          </FormControl>

          <FormControl>
            <FormLabel>End time</FormLabel>
            <Input isDisabled={eventId == null || eventId === 0} value={end} type="time" onChange={(event) => {setEnd(event.target.value)}} />
          </FormControl>
        </Stack>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input isDisabled={eventId == null || eventId === 0} value={description} type="text" placeholder="This should be a descriptive name" onChange={(event) => {setDescription(event.target.value)}} />
        </FormControl>

        <FormControl>
          <FormLabel>Event type</FormLabel>
          <Input isDisabled={eventId == null || eventId === 0} value={eventType} type="text" onChange={(event) => {setEventType(event.target.value)}} />
        </FormControl>

        <Button isDisabled={eventId == null || eventId === 0} onClick={updateEvent} fontSize="2rem" colorScheme="GttOrange" width="fit-content" padding="1em">Update event</Button>
      </Stack>

    </div>
  )

  function selectEvent(newEventId: number) {
    setEventId(newEventId);

    fetch(
      ((process.env.REACT_APP_PROD === 'yes' ? 'https://gttournament.cz' : '') + `/backend/event/${newEventId}/`)
    )
    .then(response => response.json())
    .then(data => {
      setStart(`${data.date} ${data.beginTime}`);
      setEnd(data.endTime);
      setDescription(data.description);
      setEventType(data.eventType);
      setGameId(data.gameId);
    })
    .catch(error => console.error("Error", error));
  }

  function updateEvent() {
    const startTimestamp = Date.parse(start);
    const startDateObject = new Date(startTimestamp);
    const startDate = startDateObject.toISOString().split('T')[0].replace(/-/g, '-')

    const startHours = String(startDateObject.getHours()).length === 1 ? `0${startDateObject.getHours()}` : startDateObject.getHours();
    const startMinutes = String(startDateObject.getMinutes()).length === 1 ? `0${startDateObject.getMinutes()}` : startDateObject.getMinutes();
    const startTime = `${startHours}:${startMinutes}:00`;

    const endTime = `${end}:00`;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${localStorage.getItem("jws")}`);
    headers.append("Content-Type", "application/json");

    const body = {
      date: startDate,
      beginTime: startTime,
      endTime: endTime,
      gameId: gameId,
      description: description,
      eventType: eventType
    }

    if (Number(localStorage.getItem("jwsTtl")) < Date.now()) {
      let headersArray = new Array();
      headers.forEach((value, key) => {
        headersArray.push([key, value]);
      });
      cacheRequestAndRelog(
        ((process.env.REACT_APP_PROD === 'yes' ? 'https://gttournament.cz' : '') + `/backend/event/${eventId}/`),
        "PUT",
        JSON.stringify(body),
        headersArray,
        "Event updated successfully"
      )
    } else {
      fetch(
        ((process.env.REACT_APP_PROD === 'yes' ? 'https://gttournament.cz' : '') + `/backend/event/${eventId}/`),
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body)
      })
      .then(async response => {
        if (response.ok) {
          toast({
            title: 'Event updated successfully',
            status: 'success',
            duration: 5000,
            isClosable: true
          })
        } else {
          const data = await response.json();
          toast({
            title: 'Error',
            description: data.msg?? data.message?? 'Unknown error.',
            status: 'error',
            duration: 5000,
            isClosable: true
          })
        }
      })
      .catch(error => console.error("Error", error));
    }
    setEventPickerKey(eventPickerKey + 1);
  }
}
