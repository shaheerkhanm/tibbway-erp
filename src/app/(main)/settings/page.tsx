
"use client"

import * as React from "react"
import Image from "next/image"
import { MoreHorizontal, PlusCircle, UserPlus, Upload, Loader2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import type { User, UserRole } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const roleVariant: { [key in UserRole]: "default" | "secondary" | "destructive" } = {
  'Super Admin': "destructive",
  'Admin': "default",
  'Staff': "secondary",
}

function AppearanceSettings() {
    const { toast } = useToast()
    const [logoPreview, setLogoPreview] = React.useState<string | null>(null)
    const [logoFile, setLogoFile] = React.useState<File | null>(null)
    const [isUploading, setIsUploading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        const currentLogo = localStorage.getItem("app-logo")
        if (currentLogo) {
            setLogoPreview(currentLogo)
        }
    }, [])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setLogoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSaveLogo = async () => {
        if (!logoFile) {
            toast({
                title: "No file selected",
                description: "Please select a logo image to upload.",
                variant: "destructive"
            })
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", logoFile)
            formData.append("folder", "branding")

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image')
            }

            const { url } = await uploadResponse.json()
            localStorage.setItem("app-logo", url)
            toast({
                title: "Logo Updated!",
                description: "Your new application logo has been saved.",
            })
            // Optionally, force a reload to see the change everywhere
            window.dispatchEvent(new Event('storage'))
        } catch (error) {
            console.error(error)
            toast({
                title: "Upload Error",
                description: "Could not upload the new logo. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look of your application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Application Logo</Label>
                    <div className="flex items-center gap-6">
                        <div className="relative h-16 w-16 rounded-lg border flex items-center justify-center bg-muted/50">
                            {logoPreview ? (
                                <Image src={logoPreview} alt="Logo preview" layout="fill" objectFit="contain" className="rounded-lg p-1" />
                            ) : (
                                <span className="text-xs text-muted-foreground">Logo</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/png, image/jpeg, image/svg+xml"
                                className="hidden"
                            />
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="mr-2 h-4 w-4" />
                                Change Logo
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2">
                                Recommended size: 200x200px. Supports PNG, JPG, SVG.
                            </p>
                        </div>
                    </div>
                </div>
                <Button onClick={handleSaveLogo} disabled={isUploading || !logoFile}>
                    {isUploading ? <Loader2 className="mr-2 animate-spin" /> : null}
                    Save Logo
                </Button>
            </CardContent>
        </Card>
    )
}


export default function SettingsPage() {
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const { toast } = useToast()
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);


  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole }),
        });
        if (!response.ok) throw new Error("Failed to update role");

        toast({
            title: "Role Updated",
            description: "User role has been successfully updated.",
        })
        fetchUsers(); // Refresh users list
    } catch (error) {
        console.error("Failed to update role:", error);
        toast({
            title: "Error",
            description: "Could not update user role. Please try again.",
            variant: "destructive"
        })
    }
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
        const response = await fetch(`/api/users/${userToDelete._id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error("Failed to delete user.");

        toast({
            title: "User Removed",
            description: `${userToDelete.name} has been successfully removed.`,
        });
        fetchUsers(); // Refresh the list
    } catch (error) {
        console.error("Delete error:", error);
        toast({
            title: "Error",
            description: "Could not remove the user. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsAlertOpen(false);
        setUserToDelete(null);
    }
  };

  const openConfirmationDialog = (user: User) => {
    setUserToDelete(user);
    setIsAlertOpen(true);
  };


  return (
    <>
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application and user settings.</p>
      </div>

      <AppearanceSettings />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Invite and manage user roles and permissions.</CardDescription>
            </div>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                          <AvatarFallback>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[user.role]}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                    value={user.role}
                                    onValueChange={(newRole) => handleRoleChange(user._id, newRole as UserRole)}
                                >
                                    <DropdownMenuRadioItem value="Staff">Staff</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Admin">Admin</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Super Admin">Super Admin</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => openConfirmationDialog(user)}>
                            Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the user
                and revoke their access.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
                Continue
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

    