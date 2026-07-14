import { memo } from 'react';
import { useNavigate } from 'react-router';
import { AuthPageShell } from './components/AuthPageShell';
import { RegisterForm } from './components/RegisterForm';

const Register = memo(() => {
    const navigate = useNavigate();
    return (
        <AuthPageShell mode="register">
            <RegisterForm onSwitch={() => navigate('/login')} />
        </AuthPageShell>
    );
});

export default Register;
