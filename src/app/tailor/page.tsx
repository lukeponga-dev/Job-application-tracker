"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { tailorDocuments, TailorDocumentsInput } from "@/ai/flows/tailor-document-flow";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const tailorFormSchema = z.object({
  cv: z.string().min(1, "Your CV cannot be empty."),
  jobDescription: z.string().min(1, "The job description cannot be empty."),
  companyName: z.string().min(1, "Company name is required."),
  role: z.string().min(1, "Role is required."),
});

export default function TailorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ tailoredCv: string; tailoredCoverLetter: string } | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof tailorFormSchema>>({
    resolver: zodResolver(tailorFormSchema),
    defaultValues: {
      cv: "",
      jobDescription: "",
      companyName: "",
      role: "",
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        try {
          const reader = new FileReader();
          reader.onload = async (e) => {
            if (e.target?.result) {
              const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
              const pdf = await pdfjs.getDocument(typedarray).promise;
              let text = "";
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                text += textContent.items.map(item => (item as any).str).join(" ");
              }
              form.setValue("cv", text);
            }
          };
          reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("Failed to read PDF:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to read the PDF file.",
            });
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          form.setValue("cv", text);
        };
        reader.onerror = () => {
          toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to read the file.",
          });
        }
        reader.readAsText(file);
      }
    }
  };

  const onSubmit = async (values: TailorDocumentsInput) => {
    setIsLoading(true);
    setResult(null);
    try {
      const tailoredResult = await tailorDocuments(values);
      setResult(tailoredResult);
    } catch (error) {
      console.error("Failed to tailor documents:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error tailoring your documents. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tailor Your Application</CardTitle>
              <CardDescription>
                Paste your CV and the job description to get a tailored version for your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Google" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Software Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cv"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Your CV</FormLabel>
                            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload CV
                            </Button>
                            <FormControl>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    accept=".txt,.md,.pdf,.doc,.docx"
                                />
                            </FormControl>
                        </div>
                        <FormControl>
                          <Textarea placeholder="Paste your CV here or upload a file..." {...field} className="h-40" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Paste the job description here..." {...field} className="h-40" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>AI Generated Content</CardTitle>
              <CardDescription>
                Your tailored CV and cover letter will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {result ? (
                <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Tailored CV</h3>
                        <pre className="p-4 rounded-md bg-muted text-muted-foreground text-sm whitespace-pre-wrap font-sans">{result.tailoredCv}</pre>
                    </div>
                    <Separator />
                     <div>
                        <h3 className="text-lg font-semibold mb-2">Tailored Cover Letter</h3>
                        <pre className="p-4 rounded-md bg-muted text-muted-foreground text-sm whitespace-pre-wrap font-sans">{result.tailoredCoverLetter}</pre>
                    </div>
                </div>
              ) : (
                !isLoading && (
                  <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg bg-card">
                    <p className="text-sm text-muted-foreground">
                      Your generated content will be displayed here.
                    </p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
