import axios from 'axios';

import { logout } from './api';
const Factory = (api, URL, payload, headers = {}) => {
  URL = import.meta.env.VITE_APP_BASE_URL + URL;
  const token = localStorage.getItem('serviceToken');
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
    url: URL,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers
    },
    data: payload
  })
    .then((res) => {
      if (res?.status == 200 || res?.status == 204) {
        return {
          res: { status_cd: 0, ...res },
          variant: 'success',
          message: getErrorMessage(api)
        };
      } else if (res?.status == 201) {
        return {
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
};

export default Factory;
