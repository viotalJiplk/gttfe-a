import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import Breadcrumbs from "../../../components/Breadcrumbs/Breadcrumbs";
import ConfirmationButton from "../../../components/ConfirmationButton/ConfirmationButton";
import DataPicker, { dataType } from "../../../components/DataPicker/DataPicker";
import EndpointForm from "../../../components/EndpointForm/EndpointForm";
import { fetchGracefully } from "../../../components/Navbar/Login/LoginScript";
import { backendUrl } from "../../../config/config";
import TeamResultInput from "../TeamResultInput";

export default function CreateMatch() {
  const toast = useToast();

  const [stageId, setStageId] = useState<number>();
  const [firstTeamId, setFirstTeamId] = useState<number>();
  const [firstTeamResult, setFirstTeamResult] = useState<number>();
  const [secondTeamId, setSecondTeamId] = useState<number>();
  const [secondTeamResult, setSecondTeamResult] = useState<number>();

  return (
    <div>
      <Breadcrumbs />
      <EndpointForm>
        <DataPicker dataType={dataType.stage} changeHandler={(event) => {setStageId(Number(event.target.value))}} toast={toast} />

        <TeamResultInput stageId={stageId} setFirstTeamId={setFirstTeamId} setFirstTeamResult={setFirstTeamResult} setSecondTeamId={setSecondTeamId} setSecondTeamResult={setSecondTeamResult} toast={toast} />

        <ConfirmationButton isDisabled={stageId == null || firstTeamId == null || firstTeamResult == null || secondTeamId == null || secondTeamResult == null} onClick={createMatch}> Create match</ConfirmationButton>

      </EndpointForm>
    </div>
  )

  function createMatch() {
    fetchGracefully(backendUrl + `/backend/match/create/`,
    {
      method: "POST",
      body: JSON.stringify({
        stageId: stageId,
        firstTeamId: firstTeamId,
        firstTeamResult: firstTeamResult,
        secondTeamId: secondTeamId,
        secondTeamResult: secondTeamResult
      }),
      headers: {"Content-Type": "application/json"}
    },
    "Match created successfully", toast);
  }
}
