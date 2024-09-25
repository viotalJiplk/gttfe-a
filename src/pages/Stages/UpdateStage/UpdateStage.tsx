import { QuestionIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, Tooltip, useToast } from "@chakra-ui/react";
import { useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import DataPicker, { dataType } from "../../../components/DataPicker/DataPicker";
import { fetchGracefully } from "../../../components/Navbar/Login/LoginScript";

export default function UpdateStage() {
  const [eventId, setEventId] = useState<Number>();
  const [stageId, setStageId] = useState<Number>();
  const [stageName, setStageName] = useState("");
  const [stageIndex, setStageIndex] = useState<number>();

  const toast = useToast();

  return (
    <div>
      <Breadcrumbs />
      <Stack direction="column" spacing="3rem" className="Form">
        <DataPicker title="Event (Optional)" dataType={dataType.event} changeHandler={event => setEventId(Number(event.target.value))} />

        <DataPicker dataType={dataType.stage} eventId={eventId?? undefined} changeHandler={event => selectStage(Number(event.target.value))} /> 

        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input isDisabled={stageId == undefined} value={stageName} type="text" onChange={event => setStageName(event.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>Index/Level <Tooltip label="i. e. quarterfinals = 1, semifinals = 2, finals = 3"><QuestionIcon /></Tooltip></FormLabel>
          <NumberInput isDisabled={stageId == undefined} defaultValue={stageIndex} onChange={(_, value) => {setStageIndex(value)}}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <Button isDisabled={stageId == undefined} onClick={updateStage} fontSize="2rem" colorScheme="GttOrange" width="fit-content" padding="1em">Update stage</Button>
      </Stack>
    </div>
  )

  function selectStage(newStageId: Number) {
    setStageId(newStageId);

    fetch(
      ((process.env.REACT_APP_PROD === 'yes' ? 'https://gttournament.cz' : '') + `/backend/stage/${newStageId}/`)
    )
    .then(response => response.json())
    .then(data => {
      setEventId(data.eventId);
      setStageName(data.stageName);
      setStageIndex(data.stageIndex);
    })
    .catch(error => console.error("Error", error));
  }

  function updateStage() {
    const headers: [string, string][] = [
      ["Authorization", `Bearer ${localStorage.getItem("jws")}`],
      ["Content-Type", "application/json"]
    ];
    
    const body = {
      eventId: eventId,
      stageName: stageName,
      stageIndex: stageIndex
    }

    fetchGracefully(((process.env.REACT_APP_PROD === 'yes' ? 'https://gttournament.cz' : '') + `/backend/stage/${stageId}/`),
    "PUT", JSON.stringify(body), headers, "Stage updated successfully", toast);
  }
}