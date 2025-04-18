import axios from 'axios';
import { BASE_URL } from 'constants';
import { logout } from '@/utils/api';

function Factory(api, URL, payload, headers = {}) {
  const tokens = JSON.parse(localStorage.getItem('auth-user'));
  const getErrorMessage = (api) => {
    switch (api) {
      case 'put':
        return 'Data updated successfully.';
      case 'post':
        return 'Data submitted successfully.';
      case 'delete':
        return 'Data deleted successfully.';
      case 'get':
        return 'Data fetched successfully.';
      case 'patch':
        return 'Data fetched successfully.';
      default:
        break;
    }
  };

  return axios({
    method: api,
    url: BASE_URL + URL,
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      ...headers
    },
    data: payload
  })
    .then((res) => {
      if (res?.status == 200) {
        return {
          // res: res.data,
          variant: 'success',
          res: { status_cd: 0, ...res },
          message: getErrorMessage(api)
        };
      } else if (res?.status == 201) {
        return {
          res: res.data,
          res: { status_cd: 0, ...res.data },

          variant: 'success',
          message: getErrorMessage(api)
        };
      } else if (res?.status == 500) {
        return {
          res: { status_cd: 1 },
          variant: 'error',
          message: getErrorMessage(api)
        };
      } else {
        return { res: res, variant: 'error', message: 'Something went wrong.' };
      }
    })
    .catch((e) => {
      if (e?.response?.status == 401) {
        if (e?.response?.data.code === 'token_not_valid') {
          logout();
        }
      } else if (e?.response?.status == 404) {
        if (e?.response?.data.status_cd === 2) {
          return {
            res: { status_cd: 2, ...e.response },
            variant: 'warning',
            message: 'Data not found.'
          };
        }
        return {
          res: { status_cd: 1, ...e.response },
          variant: 'warning',
          message: 'Data not found.'
        };
      } else if (e?.response?.status == 500) {
        return {
          res: { status_cd: 1, ...e.response },
          variant: 'error',
          message: 'Something went wrong'
        };
      } else if (e?.response?.status == 400) {
        return {
          res: { status_cd: 1, data: { ...e.response } },
          variant: 'error',
          message: 'Something went wrong'
        };
      } else {
        return {
          res: { status_cd: 1, ...e.response },
          variant: 'error',
          message: 'Something went wrong.'
        };
      }
    });
}

export default Factory;
