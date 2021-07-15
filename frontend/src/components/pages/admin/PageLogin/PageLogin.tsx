import React from 'react';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_PATHS from "constants/apiPaths";

const login = async ( username: any, password: any ) => {
    try {
        const { data: { message } } = await axios.post(`${API_PATHS.login}/login`, {
            username,
            password
        });

        localStorage.setItem( "authToken", message );
        window.location.href = "/";
    }
    catch ( err ) {
        const options  = {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        };

        if( err.status === 401 ) {
            // @ts-ignore
            toast.error('Incorrect credentials', options);
        }
        else {
            // @ts-ignore
            toast.error('Oops, something went wrong!', options);
        }
    }
}

class PageLogin extends React.Component{
    state = {
        username: "",
        password: ""
    }

    handleUsername = ( username = "" ) => {
        this.setState({
            username
        })
    }

    handlePassword = ( password = "" ) => {
        this.setState({
            password
        })
    }

    render() {
        const { username, password } = this.state;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div>
                    <Avatar >
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={ username }
                            onChange={ ({ target: { value } }) => this.handleUsername( value ) }
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={ password }
                            onChange={ ({ target: { value } }) => this.handlePassword( value ) }
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={ () => login( username, password ) }
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </Container>
        );
    }
}

export default PageLogin;
