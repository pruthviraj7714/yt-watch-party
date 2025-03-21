"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createPartySchema } from "@repo/types/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import axios from 'axios'
import { BACKEND_URL } from "../../../../config/config"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function CreatePartyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data : session} = useSession();

  const form = useForm<z.infer<typeof createPartySchema>>({
    resolver: zodResolver(createPartySchema),
    defaultValues: {
      slug: "",
      videoUrl: "",
    },
  })

  async function onSubmit(values: z.infer<typeof createPartySchema>) {
    setIsSubmitting(true)
      const res = await axios.post(`${BACKEND_URL}/party/create`, {
        slug : values.slug,
        videoUrl : values.videoUrl
      }, {
        headers : {
          Authorization : `Bearer ${session?.user.accessToken}`
        }
      });
      toast.success(res.data.message);
      setIsSubmitting(false)
      router.push(`/party/${values.slug}`)
  }

  return (
    <div className="py-10 flex flex-col justify-center items-center h-screen">
      <Link href="/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to parties
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create a Watch Party</CardTitle>
          <CardDescription>Set up a new YouTube watch party to enjoy videos with friends</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Party Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="my-awesome-party" {...field} />
                    </FormControl>
                    <FormDescription>This will be used in the URL: yourdomain.com/party/{"{slug}"}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormDescription>Paste the full YouTube video URL.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Watch Party"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

