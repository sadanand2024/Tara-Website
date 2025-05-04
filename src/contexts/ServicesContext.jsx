import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const ServicesContext = createContext();

export const ServicesProvider = ({ children }) => {
  let baseURL = 'http://dev-backend.tarafirst.com:8000';
  const [services, setServices] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${baseURL}/user_management/feature-services/`)
      .then((res) => setServices(res.data))
      .catch((err) => {
        setServices([]);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to fetch services. Please try again later.',
            variant: 'alert',
            severity: 'error',
            alert: { color: 'error', variant: 'filled' },
            transition: 'SlideUp'
          })
        );
      });
  }, [dispatch]);

  return <ServicesContext.Provider value={{ services }}>{children}</ServicesContext.Provider>;
};

export default ServicesContext;
