
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Share2, UserPlus, Users, X } from "lucide-react";
import { useFirestore, useUser, useCollection, addDocumentNonBlocking, deleteDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { AccountabilityPartner } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

interface InvitePartnerForm {
  email: string;
}

export default function AccountabilityPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { register, handleSubmit, reset } = useForm<InvitePartnerForm>();

  const partnersCollection = useMemoFirebase(() => 
    user ? collection(firestore, `users/${user.uid}/accountabilityPartners`) : null
  , [user, firestore]);

  const { data: partners, isLoading: partnersLoading } = useCollection<AccountabilityPartner>(partnersCollection);

  const handleInvitePartner = (data: InvitePartnerForm) => {
    if (!partnersCollection) return;
    // In a real app, you'd also send an email invitation.
    // For now, we'll just add them to the list.
    const newPartner = {
        partnerEmail: data.email,
        // For now, we extract a mock name from the email.
        name: data.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        permissions: "{}",
        consentLog: "[]",
    };
    addDocumentNonBlocking(partnersCollection, newPartner);
    reset();
  };

  const handleRemovePartner = (partnerId: string) => {
    if (!partnersCollection) return;
    const partnerDocRef = doc(partnersCollection, partnerId);
    deleteDocumentNonBlocking(partnerDocRef);
  };

  const isLoading = isUserLoading || partnersLoading;

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
              Add an accountability partner by entering their email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleInvitePartner)} className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="partner@example.com" 
                {...register("email", { required: true })}
              />
              <Button type="submit">Send Invite</Button>
            </form>
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
            {isLoading && Array.from({length: 2}).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-20" />
                </div>
            ))}
            {!isLoading && partners?.map((partner) => (
              <div key={partner.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${partner.partnerEmail}`} alt={partner.name} />
                    <AvatarFallback>{partner.name?.charAt(0) || 'P'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{partner.name}</p>
                    <p className="text-sm text-muted-foreground">{partner.partnerEmail}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleRemovePartner(partner.id)}>
                    <X className="h-4 w-4 mr-1"/>
                    Remove
                </Button>
              </div>
            ))}
            {!isLoading && (!partners || partners.length === 0) && (
                 <div className="flex items-center justify-center text-center p-3 border-2 border-dashed rounded-lg">
                    <div className="text-center p-6">
                        <UserPlus className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
                        <span className="text-sm font-medium">You have no partners yet.</span>
                        <p className="text-xs text-muted-foreground">Use the form to send an invite.</p>
                    </div>
                </div>
            )}
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
