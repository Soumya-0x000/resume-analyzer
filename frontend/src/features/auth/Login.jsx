import { memo } from 'react';
import { useNavigate } from 'react-router';
import { AuthPageShell } from './components/AuthPageShell';
import { LoginForm } from './components/LoginForm';

const Login = memo(() => {
    const navigate = useNavigate();
    return (
        <AuthPageShell mode="login">
            <LoginForm onSwitch={() => navigate('/register')} />
        </AuthPageShell>
    );
});

export default Login;
