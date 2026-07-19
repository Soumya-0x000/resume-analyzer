import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileForm } from '../components/ProfileForm';
import { PasswordForm } from '../components/PasswordForm';

const Profile = memo(() => {
    return (
        <div className="h-full space-y-6 overflow-y-auto bg-background p-6">
            <div>
                <h1 className="text-lg font-semibold">Profile settings</h1>
                <p className="text-xs text-muted-foreground">
                    Manage your account details and password
                </p>
            </div>

            <Card className="max-w-2xl">
                <CardContent className="pt-4">
                    <Tabs defaultValue="profile">
                        <TabsList>
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="pt-6">
                            <ProfileForm />
                        </TabsContent>
                        <TabsContent value="password" className="pt-6">
                            <PasswordForm />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
});

export default Profile;
