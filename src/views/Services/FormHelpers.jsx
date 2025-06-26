import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useSelector } from 'store';
import { enqueueSnackbar } from 'notistack';
import Factory from 'utils/Factory';
import { ConstructionOutlined } from '@mui/icons-material';
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
  step,
  msme = false,
  urlKey,
  urlBool = false,
  onStatusChange
}) => {
  const [statusData, setStatusData] = useState(false);
  const user = useSelector((state) => state.accountReducer.user);
  let assignee = data?.assignee || '';
  let rewiewer = data?.reviewer || '';
  let Uid = user.user.id;
  let service = msme ? 'msme' : urlBool ? urlKey : 'income_tax_returns';

  useEffect(() => {
    if (status) {
      if (step === 0 && status === 'approved') {
        status = 'completed';
        setReviewStep(1);
      } else if (step === 1 && status === 'filed') {
        status = 'completed';
        setReviewStep(2);
      }
      setStatusData(status);
    }
  }, [status, data]);

  useEffect(() => {
    if (step === 1 && statusData === 'filed') setReviewStep(2);
  }, [statusData]);

  const changeStatus = async (changedStatus) => {
    let payload = {};
    if (step === 0) {
      type = 'put';
      urlEndpoint = msme || urlKey ? urlEndpoint : `review-filing`;
      payload = { approval_status: changedStatus };
    } else if (step === 1) {
      type = 'put';
      urlEndpoint = msme || urlKey ? urlEndpoint : `review-filing`;
      payload = { filing_status: changedStatus };
    } else if (type === 'put') {
      payload = { status: changedStatus };
    } else {
      payload = { service_task: task_id, service_request: parseInt(service_request), status: changedStatus };
    }
    let response;
    if (type === 'post') {
      response = await Factory('post', urlEndpoint, payload);
    } else {
      response = await Factory('put', `/${service}/${urlEndpoint}/${recId}/`, payload, {});
    }
    if (response.res.status_cd === 0) {
      enqueueSnackbar('Status updated successfully', { anchorOrigin: { vertical: 'top', horizontal: 'right' }, variant: 'success' });
      setStatusData(changedStatus);
      if (onStatusChange) {
        onStatusChange(changedStatus, response.res.data || null);
      }
      if (step === 0 && changedStatus === 'approved') {
        setReviewStep(1);
      }
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
      {/* {!filingHelper ? ( */}
      <>
        {Uid === assignee &&
          (statusData === 'in progress' ||
            statusData === 'revoked' ||
            statusData === 'resubmission' ||
            statusData === 'pending' ||
            statusData === 'resubmitted') && (
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
                  onClick={() => changeStatus(step === 0 ? 'approved' : step === 1 ? 'filed' : 'completed')}
                  mr={1}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="error"
                  onClick={() => changeStatus(step === 0 ? 'resubmission' : step === 1 ? 'resubmitted' : 'revoked')}
                  mr={1}
                >
                  Re Work
                </Button>
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </>
      {/* ) : ( */}
      <>
        {/* {filingHelper && (
        <Button type="button" variant="outlined" color="secondary" onClick={() => changeStatus('completed')} mr={1}>
          Filing
        </Button>
      )} */}
      </>
      {/* )} */}
    </>
  );
};

export default GetActionButtons;
