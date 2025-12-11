import { createContext, use, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppConext = createContext();
export const AppProvider = ({children}) => {

    const [isAdmin, setIsAdmin] = useState(false); 
    const [shows, setShows] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    const {user} = useUser();
    const {getToken} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchIsAdmin = async () => {
        try {
            const {data} = await axios.get('/api/admin/is-admin', {headers : {
                Authorization : `Bearer ${await getToken()}`
            }});
            
            setIsAdmin(data.isAdmin);

            if (!data.isAdmin && location.pathname.startsWith('/admin')) {
                console.log('user is not admin');
                navigate('/');
                toast.error('You are not authorized to access admin panel');
            }

        } catch (error) {
            console.error(error);
        }
    }

    const fetchShows = async () => {
        try {
            const {data} = await axios.get('/api/show/all');
            if (data?.success) {
                setShows(data.shows);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const fetchFavoriteMovies = async () => {
        try {
            const {data} = await axios.get('/api/user/favourite-movies', {headers : {
                Authorization : `Bearer ${await getToken()}`
            }});
            if (data?.success) {
                setFavoriteMovies(data.favorites);
            } else {
                // toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchShows();
    }, [])

    useEffect(() => {
        if (user) {
            fetchIsAdmin();
            fetchFavoriteMovies();
        }    
    }, [user]) 

    const value = {
        axios, fetchIsAdmin, user, getToken, navigate, isAdmin, shows, favoriteMovies, fetchFavoriteMovies
    };

    return (
        <AppConext.Provider value={value}>
            {children}
        </AppConext.Provider>
    )
}

export const useAppContext = () => useContext(AppConext);
