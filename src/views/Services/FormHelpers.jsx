import { Button } from '@mui/material';
import { useSelector } from 'store';
import { enqueueSnackbar } from 'notistack';
import Factory from 'utils/Factory';
const GetActionButtons = ({ data, status, urlEndpoint, taskId, service_request, setData }) => {
  const user = useSelector((state) => state).accountReducer.user;
  let assignee = data.assignee;
  let rewiewer = data.reviewer;
  let Uid = user.user.id;
  const changeStatus = async (changedStatus) => {
    console.log(changedStatus);
    let response;
    if (urlEndpoint === 'taxPaid') {
      response = await Factory('put', `/income_tax_returns/tax-paid-details/create-or-update/`, {
        service_request: service_request,
        status: changedStatus
      });
    } else {
      response = await Factory('put', `/income_tax_returns/${urlEndpoint}/${taskId}/`, { status: changedStatus }, {});
    }
    console.log(response);
    if (response.res.status_cd === 0) {
      enqueueSnackbar('Status updated successfully', { anchorOrigin: { vertical: 'top', horizontal: 'right' }, variant: 'success' });
      setData({ ...response.res.data });
    } else {
      enqueueSnackbar('Status update failed', { anchorOrigin: { vertical: 'top', horizontal: 'right' }, variant: 'error' });
    }
  };

  return (
    <>
      {taskId && (
        <>
          {Uid === assignee && (status === 'in progress' || status === 'revoked') && (
            <Button type="button" variant="outlined" color="secondary" onClick={() => changeStatus('sent for approval')} mr={1}>
              Send for Review
            </Button>
          )}
          {Uid === rewiewer && (
            <>
              {status === 'completed' ? (
                <Button type="button" variant="outlined" color="secondary" mr={1}>
                  Finished
                </Button>
              ) : status === 'sent for approval' ? (
                <>
                  <Button
                    type="button"
                    disabled={status === 'revoked'}
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
        </>
      )}
    </>
  );
};

export default GetActionButtons;
