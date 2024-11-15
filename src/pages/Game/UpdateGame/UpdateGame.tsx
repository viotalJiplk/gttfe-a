import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import { FormControl, FormLabel, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Stack, useToast } from "@chakra-ui/react";
import DataPicker, { dataType } from "../../../components/DataPicker/DataPicker";
import { useState } from "react";
import { fetchGracefully } from "../../../components/Navbar/Login/LoginScript";
import ConfirmationButton from "../../../components/ConfirmationButton/ConfirmationButton";
import { backendUrl, horizontalFormSpacing } from "../../../config/config";
import EndpointForm from "../../../components/EndpointForm/EndpointForm";

export default function UpdateGame() {
  const toast = useToast();

  const [gameErr, setGameErr] = useState(false);

  const [gameId, setGameId] = useState<Number>();
  const [regStart, setRegStart] = useState("");
  const [regEnd, setRegEnd] = useState("");
  const [maxTeams, setMaxTeams] = useState(0);
  const [backdrop, setBackdrop] = useState("");
  const [icon, setIcon] = useState("");

  return (
    <div>
      <Breadcrumbs />

      <EndpointForm>
        <DataPicker dataType={dataType.game} isInvalid={gameErr} changeHandler={(event) => selectGame(event.target.value)} toast={toast} />

        <Stack direction="row" spacing={horizontalFormSpacing}>
          <FormControl>
            <FormLabel>Registration start</FormLabel>
            <Input max={regEnd} type='datetime-local' value={regStart} onChange={(event) => setRegStart(event.target.value)}/>
          </FormControl>

          <FormControl>
            <FormLabel>Registration end</FormLabel>
            <Input min={regStart}  type='datetime-local' value={regEnd} onChange={(event) => setRegEnd(event.target.value)} />
          </FormControl>
        </Stack>

        <FormControl>
          <FormLabel>Maximum teams</FormLabel>
          <NumberInput min={0} value={maxTeams} onChange={(_, value) => {setMaxTeams(value)}}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <DataPicker title="Backdrop" value={backdrop} dataType={dataType.file} changeHandler={event => {setBackdrop(event.target.value)}} toast={toast} />

        <DataPicker title="Icon" value={icon} dataType={dataType.file} changeHandler={event => {setIcon(event.target.value)}} toast={toast} />

        <ConfirmationButton isDisabled={gameId == null} onClick={updateGame}>Update game</ConfirmationButton> 

      </EndpointForm>
    </div>
  );

  function selectGame(newGameId: String) {
    if (newGameId === "") {
      setGameErr(true);
      setGameId(undefined);
      return;
    }

    setGameId(Number(newGameId));
    setGameErr(false);
    fetch(backendUrl + `/backend/game/${newGameId}/`)
    .then(response => response.json())
    .then(data => {

      if (data.registrationStart != null) {
        setRegStart(data.registrationStart);
      } else {
        setRegStart(new Date().toISOString());
      }

      if (data.registrationEnd != null) {
        setRegEnd(data.registrationEnd);
      } else {
        setRegEnd(new Date().toISOString());
      }

      if (data.maxTeams != null) {
        setMaxTeams(data.maxTeams);
      } else {
        setMaxTeams(0);
      }

      if (data.backdrop != null) {
        setBackdrop(data.backdrop);
      } else {
        setBackdrop("");
      }

      if (data.icon != null) {
        setIcon(data.icon);
      } else {
        setIcon("");
      }
    })
  }

  async function updateGame() {
    fetchGracefully(backendUrl + `/backend/game/${gameId}/`,
    {
      method: "PUT",
      body: JSON.stringify({
        registrationStart: regStart,
        registrationEnd: regEnd,
        maxTeams: maxTeams,
        backdrop: backdrop,
        icon: icon
      }),
      headers: {"Content-Type": "application/json"}
    },
    "Game updated successfully", toast);
  }
}
