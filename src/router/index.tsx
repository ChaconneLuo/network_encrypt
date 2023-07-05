import { Navigate, useRoutes } from 'react-router-dom';
import Rsa from '../pages/Rsa';
import Ssl from '../pages/Ssl';
import App from '../App';

export default function BaseRouter() {
    return useRoutes([
        {
            path: '/',
            element: <App />,
            children: [
                {
                    path: "/",
                    element: <Navigate to={'/rsa'} replace></Navigate>
                },
                {
                    path: "/rsa",
                    element: <Rsa />
                },
                {
                    path: "/ssl",
                    element: <Ssl />
                }
            ]
        }
    ]);
}