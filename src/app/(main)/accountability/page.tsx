import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Share2, UserPlus, Users } from "lucide-react";

const partners = [
  { name: "Jane Doe", email: "jane.doe@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  { name: "John Smith", email: "john.smith@example.com", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d" },
];

export default function AccountabilityPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <PageHeader
        title="Accountability"
        description="Share your journey and stay on track with a trusted partner."
      />
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <UserPlus className="h-6 w-6"/>
                Invite a Partner
            </CardTitle>
            <CardDescription>
              Add an accountability partner by entering their email address. They will receive an invitation to view your progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input type="email" placeholder="partner@example.com" />
              <Button type="submit">Send Invite</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Your partner will only see the reports you explicitly share. You are in full control of your privacy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Users className="h-6 w-6"/>
                Your Partners
            </CardTitle>
            <CardDescription>
              Manage your existing accountability partners.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {partners.map((partner) => (
              <div key={partner.email} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={partner.avatar} alt={partner.name} />
                    <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{partner.name}</p>
                    <p className="text-sm text-muted-foreground">{partner.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Remove</Button>
              </div>
            ))}
             <div className="flex items-center justify-center text-center p-3 border-2 border-dashed rounded-lg">
                <button className="w-full">
                    <UserPlus className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
                    <span className="text-sm font-medium">Add a new partner</span>
                </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
          <Card>
              <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                      <Share2 className="h-6 w-6"/>
                      Share Reports
                  </CardTitle>
                  <CardDescription>Generate and share reports with your partners. PDFs are generated in the background and you'll be notified when ready.</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline">Weekly Habit Report</Button>
                  <Button variant="outline">Monthly Journal Summary</Button>
                  <Button variant="outline">Financial Overview</Button>
                  <Button variant="outline">Full Manual Export</Button>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
