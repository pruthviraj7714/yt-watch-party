"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Github, LogOut, Play, Users, Video, Youtube } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Landing() {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Youtube className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">WatchParty</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Features
            </Link>
            <Link href="#how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">
              How It Works
            </Link>
            <Link href="#faq" className="transition-colors hover:text-foreground/80 text-foreground/60">
              FAQ
            </Link>
          </nav>

          <div>
            {isLoading ? (
              <Button variant="outline" disabled>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Loading
              </Button>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                      <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/home" className="cursor-pointer">
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/party/create" className="cursor-pointer">
                      Create Party
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 focus:text-red-500"
                    onClick={() => signOut({callbackUrl : '/'})}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => signIn("github", {callbackUrl : '/home'})}>
                <Github className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Watch YouTube Together, <span className="text-red-500">Anywhere</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Create or join watch parties to enjoy YouTube videos with friends in perfect sync. Chat, react, and
                  share moments in real-time.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {isAuthenticated ? (
                  <Link href="/home">
                    <Button size="lg" className="gap-2">
                      <Play className="h-4 w-4" />
                      Go to Home
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" onClick={() => signIn("github")} className="gap-2">
                    <Github className="h-4 w-4" />
                    Sign in with GitHub
                  </Button>
                )}
                <Link href="#how-it-works">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover lg:order-last">
              <Image
                src="https://i.pinimg.com/736x/45/ca/98/45ca988864ec816cf77fc900ca2151a6.jpg"
                width={550}
                height={310}
                alt="YouTube Watch Party Preview"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-24 lg:py-32 bg-muted">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Everything You Need for Perfect Watch Parties
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform makes it easy to watch YouTube videos together with friends, no matter where they are.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Synchronized Playback</h3>
              <p className="text-center text-muted-foreground">
                Everyone watches the same content at the same time, perfectly in sync.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Real-time Chat</h3>
              <p className="text-center text-muted-foreground">
                Chat with friends while watching, share reactions and comments.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Youtube className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Any YouTube Video</h3>
              <p className="text-center text-muted-foreground">
                Watch any public YouTube video with your friends with just a URL.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 md:py-24 lg:py-32">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Watching in Three Simple Steps</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Getting started with WatchParty is quick and easy.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-bold">Sign In</h3>
              <p className="text-center text-muted-foreground">
                Create an account or sign in with your GitHub account.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-bold">Create a Party</h3>
              <p className="text-center text-muted-foreground">Create a new watch party with any YouTube video URL.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-bold">Invite Friends</h3>
              <p className="text-center text-muted-foreground">
                Share the party link with friends and start watching together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-muted">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Watch Together?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users who are already enjoying YouTube videos together.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              {isAuthenticated ? (
                <Link href="/create">
                  <Button size="lg" className="gap-2">
                    <Play className="h-4 w-4" />
                    Create a Watch Party
                  </Button>
                </Link>
              ) : (
                <Button size="lg" onClick={() => signIn("github")} className="gap-2">
                  <Github className="h-4 w-4" />
                  Sign in with GitHub
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-24 lg:py-32">
        <div className="px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Find answers to common questions about WatchParty.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Is WatchParty free to use?</h3>
              <p className="text-muted-foreground">
                Yes, WatchParty is completely free to use. Just sign in with your GitHub account and start watching.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Can I watch any YouTube video?</h3>
              <p className="text-muted-foreground">
                You can watch any public YouTube video that allows embedding. Some videos with copyright restrictions
                may not be available.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">How many people can join a watch party?</h3>
              <p className="text-muted-foreground">
                There's no limit to how many people can join your watch party. Invite as many friends as you want!
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Do I need to install anything?</h3>
              <p className="text-muted-foreground">
                No installation required. WatchParty works directly in your web browser on any device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t p-6 md:py-0">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WatchParty. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline underline-offset-4">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

