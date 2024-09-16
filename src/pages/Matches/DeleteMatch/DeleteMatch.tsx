import { Button, Stack, useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import DataPicker, { dataType } from "../../../components/DataPicker/DataPicker";
import { fetchGracefully } from "../../../components/Navbar/Login/LoginScript";

export default function DeleteMatch() {
  const [eventId, setEventId] = useState<number>();
  const [stageId, setStageId] = useState<number>();
  const [matchId, setMatchId] = useState<number>();
  const [firstTeamName, setFirstTeamName] = useState("");
  const [secondTeamName, setSecondTeamName] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  return (
    <div>
      <Breadcrumbs />
      <Stack direction="column" spacing="2rem" className="Form">
        <DataPicker dataType={dataType.event} changeHandler={event => setEventId(Number(event.target.value))} />

        <DataPicker eventId={eventId?? undefined} dataType={dataType.stage} changeHandler={event => selectStage(Number(event.target.value))} />

        <DataPicker eventId={eventId?? undefined} stageId={stageId?? undefined} dataType={dataType.match} changeHandler={event => selectMatch(Number(event.target.value))} />

        <Button isDisabled={matchId == undefined} onClick={onOpen} fontSize="2rem" colorScheme="red" width="fit-content" padding="1em">Delete match</Button>

        <ConfirmationModal isOpen={isOpen} onClose={onClose} body={`Do you really want to delete the match ${firstTeamName} vs ${secondTeamName}`} confirmFunction={deleteMatch} />
      </Stack>
    </div>
  )

  function selectStage(newStageId: number) {
    setStageId(newStageId);
    if (eventId == undefined) {
      fetch(
      ((process.env.REACT_APP_PROD === 'yes' ? 'https://gttournament.cz' : '') + `/backend/stage/${newStageId}/`),
      )
      .then(response => response.json())
      .then(data => setEventId(Number(data.eventId)))
      .catch(error => console.error("Error", error));
    }
  }

  function selectMatch(newMatchId: number) {
    setMatchId(newMatchId);
    if (stageId == undefined) {
      fetch(
      ((process.env.REACT_APP_PROD === 'yes' ? 'https://gttournament.cz' : '') + `/backend/match/${newMatchId}/`),
      )
      .then(response => response.json())
      .then(data => {
        setStageId(Number(data.stageId));
        setFirstTeamName(getTeamName(Number(data.firstTeamId)));
        setSecondTeamName(getTeamName(Number(data.secondTeamId)));
      })
      .catch(error => console.error("Error", error));
    }
  }

  function getTeamName(teamId: number): string {
    fetch(
    ((process.env.REACT_APP_PROD === 'yes' ? 'https://gttournament.cz' : '') + `/backend/team/id/${teamId}/`),
    )
    .then(response => response.json())
    .then(data => {
      return data.name
    })
    .catch(error => console.error("Error", error));
    return "Error";
  }

  function deleteMatch() {
    const headers: [string, string][] = [
      ["Authorization", `Bearer ${localStorage.getItem("jws")}`],
    ];

    fetchGracefully(((process.env.REACT_APP_PROD === 'yes' ? 'https://gttournament.cz' : '') + `/backend/match/${matchId}/`),
    "DELETE", null, headers, "Match deleted successfully", toast);
  }
}
