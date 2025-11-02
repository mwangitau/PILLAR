import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences."
      />
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Profile</CardTitle>
            <CardDescription>
              This is how others will see you on the site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Alex Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="alex@example.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Profile</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="reminders" className="font-medium">Habit Reminders</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications to complete your habits.</p>
                </div>
              <Switch id="reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="weekly-summary" className="font-medium">Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">Get a weekly email with your progress summary.</p>
                </div>
              <Switch id="weekly-summary" defaultChecked />
            </div>
             <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="partner-updates" className="font-medium">Partner Updates</Label>
                    <p className="text-sm text-muted-foreground">Notify me when an accountability partner checks my report.</p>
                </div>
              <Switch id="partner-updates" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="font-headline text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              These actions are irreversible. Please be certain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
