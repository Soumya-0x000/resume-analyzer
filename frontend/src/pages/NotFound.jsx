import { useNavigate } from 'react-router';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-4">
            <h1 className="text-6xl font-bold tracking-tight">404</h1>

            <p className="mt-3 text-sm text-muted-foreground">Page not found</p>

            <button
                onClick={() => navigate('/')}
                className="mt-6 h-9 px-4 text-xs border border-input hover:bg-accent transition-colors"
            >
                Go Home
            </button>
        </div>
    );
};

export default NotFound;
