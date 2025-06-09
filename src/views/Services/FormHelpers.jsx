import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useSelector } from 'store';
import { enqueueSnackbar } from 'notistack';
import Factory from 'utils/Factory';
const GetActionButtons = ({
  type,
  data,
  status,
  urlEndpoint,
  recId,
  service_request,
  setData,
  task_id,
  filingHelper,
  setReviewStep,
  step
}) => {
  const [statusData, setStatusData] = useState(false);
  const user = useSelector((state) => state).accountReducer.user;
  let assignee = data?.assignee || '';
  let rewiewer = data?.reviewer || '';
  let Uid = user.user.id;

  useEffect(() => {
    if (status) setStatusData(status);
  }, [status]);

  const changeStatus = async (changedStatus) => {
    let payload = {};
    if (type === 'put') {
      payload = { status: changedStatus };
    } else {
      payload = { service_task: task_id, service_request: parseInt(service_request), status: changedStatus };
    }
    let response;
    if (type === 'post') {
      response = await Factory('post', urlEndpoint, payload);
    } else {
      response = await Factory('put', `/income_tax_returns/${urlEndpoint}/${recId}/`, payload, {});
    }
    if (response.res.status_cd === 0) {
      enqueueSnackbar('Status updated successfully', { anchorOrigin: { vertical: 'top', horizontal: 'right' }, variant: 'success' });
      setStatusData(changedStatus);
    } else {
      enqueueSnackbar('Status update failed', { anchorOrigin: { vertical: 'top', horizontal: 'right' }, variant: 'error' });
    }
  };

  const getDisabled = () => {
    if (filingHelper) return false;
    if (statusData === 'completed') return true;
    return false;
  };

  const proceedToFile = (status) => {
    setReviewStep(step);
  };

  return (
    <>
      {Uid === assignee && (statusData === 'in progress' || statusData === 'revoked') && (
        <Button type="button" variant="outlined" color="secondary" onClick={() => changeStatus('sent for approval')} mr={1}>
          Send for Review
        </Button>
      )}
      {Uid === rewiewer && (
        <>
          {statusData === 'completed' ? (
            <Button type="button" variant="outlined" color="secondary" disabled={getDisabled()} onClick={() => proceedToFile()} mr={1}>
              {filingHelper ? 'Proceed to Filing' : 'Finished'}
            </Button>
          ) : statusData === 'sent for approval' ? (
            <>
              <Button
                type="button"
                disabled={statusData === 'revoked'}
                variant="outlined"
                color="secondary"
                onClick={() => changeStatus('completed')}
                mr={1}
              >
                Approve
              </Button>
              <Button type="button" variant="outlined" color="error" onClick={() => changeStatus('revoked')} mr={1}>
                Re Work
              </Button>
            </>
          ) : (
            <></>
          )}
        </>
      )}

      {/* {filingHelper && (
        <Button type="button" variant="outlined" color="secondary" onClick={() => changeStatus('completed')} mr={1}>
          Filing
        </Button>
      )} */}
    </>
  );
};

export default GetActionButtons;
