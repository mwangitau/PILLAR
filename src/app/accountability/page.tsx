"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Share2, UserPlus, Users, X } from "lucide-react";
import { useFirestore, useUser, useCollection, addDocumentNonBlocking, deleteDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import type { AccountabilityPartner } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { generateReport, type GenerateReportInput } from "@/ai/flows/generate-report";
import { downloadUserData } from "@/ai/flows/download-user-data";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppLayout from "@/components/layout/AppLayout";

interface InvitePartnerForm {
  email: string;
}

type ReportType = GenerateReportInput['reportType'];
type Timeframe = GenerateReportInput['timeframe'];

export default function AccountabilityPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { register, handleSubmit, reset } = useForm<InvitePartnerForm>();
  const { toast } = useToast();

  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [reportTitle, setReportTitle] = useState("");

  const partnersCollection = useMemoFirebase(() => 
    user ? collection(firestore, `users/${user.uid}/accountabilityPartners`) : null
  , [user, firestore]);

  const { data: partners, isLoading: partnersLoading } = useCollection<AccountabilityPartner>(partnersCollection);

  const handleInvitePartner = (data: InvitePartnerForm) => {
    if (!partnersCollection || !user) return;
    const newPartner = {
        partnerEmail: data.email,
        name: data.email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        permissions: "{}",
        consentLog: "[]",
        userProfileId: user.uid,
    };
    addDocumentNonBlocking(partnersCollection, newPartner);
    reset();
  };

  const handleRemovePartner = (partnerId: string) => {
    if (!partnersCollection) return;
    const partnerDocRef = doc(partnersCollection, partnerId);
    deleteDocumentNonBlocking(partnerDocRef);
  };
  
  const handleGenerateReport = async (reportType: ReportType, timeframe: Timeframe, title: string) => {
    if (!user) return;
    setIsGeneratingReport(true);
    setReportTitle(title);
    setReportContent("");
    setIsReportDialogOpen(true);

    try {
        const result = await generateReport({ userId: user.uid, reportType, timeframe });
        setReportContent(result.report);
    } catch (error) {
        console.error("Failed to generate report:", error);
        toast({
            title: "Error Generating Report",
            description: "Could not generate your report. Please try again.",
            variant: "destructive"
        });
        setIsReportDialogOpen(false);
    } finally {
        setIsGeneratingReport(false);
    }
  }

  const handleFullExport = async () => {
    if (!user) return;
    setIsExporting(true);
    try {
      const result = await downloadUserData({ userId: user.uid });
      const blob = new Blob([result.jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pillar-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Successful",
        description: "Your data has been downloaded as pillar-data.json.",
      });
    } catch (error) {
      console.error("Failed to export data:", error);
      toast({
        title: "Error Exporting Data",
        description: "Could not export your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }

  const isLoading = isUserLoading || partnersLoading;

  return (
    <AppLayout>
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
                    <CardDescription>Generate and share reports with your partners. AI summaries are generated and displayed for you to share.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" onClick={() => handleGenerateReport('habits', 'weekly', 'Weekly Habit Report')}>Weekly Habit Report</Button>
                    <Button variant="outline" onClick={() => handleGenerateReport('journal', 'monthly', 'Monthly Journal Summary')}>Monthly Journal Summary</Button>
                    <Button variant="outline" onClick={() => handleGenerateReport('finances', 'monthly', 'Financial Overview')}>Financial Overview</Button>
                    <Button variant="outline" onClick={handleFullExport} disabled={isExporting}>
                      {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                      Full Manual Export
                    </Button>
                </CardContent>
            </Card>
        </div>
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-headline">{reportTitle}</DialogTitle>
              <DialogDescription>
                This is a preview of the report. You can copy this text to share with your accountability partner.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-4 border rounded-md">
              {isGeneratingReport ? (
                  <div className="flex items-center justify-center h-48">
                      <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                  </div>
              ) : (
                  <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: reportContent.replace(/\n/g, '<br />') }} />
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
