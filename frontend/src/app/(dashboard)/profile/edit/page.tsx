"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import ImageUpload from "@/components/custom/ImageUpload";
import InputField from "@/components/shared/InputField";
import { useMutation } from "@apollo/client/react";
import { UPDATE_PROFILE } from "@/graphql/mutations/user/UpdateProfile";
import { UpdateProfileMutation } from "@/gql/graphql";
import { toast } from "sonner";
import Link from "next/link";

export default function ProfileUpdatePage() {
  const { user, setUser } = useUserStore();
  const [updateProfile, { loading }] = useMutation<UpdateProfileMutation>(
    UPDATE_PROFILE
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    avatarUrl: "",
    isPrivate: false,
    twoFactorEnabled: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        email: user.email || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        isPrivate: user.isPrivate || false,
        twoFactorEnabled: false,
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    updateProfile({
      variables: {
        firstname: formData.firstName,
        lastname: formData.lastName,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        isPrivate: formData.isPrivate,
        twoFactorEnabled: formData.twoFactorEnabled,
      },
      onCompleted: (data) => {
        if (data.UpdateUser) {
          setUser(data.UpdateUser as any);
          toast.success("Profile updated successfully 🎉");
        } else {
          toast.error("Failed to update profile. Please try again.");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong!");
      },
    });
  };

  return (
    <div className="min-h-screen flex-1 overflow-y-auto bg-background text-foreground">
      <div className="container max-w-3xl mx-auto py-8 px-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={user ? `/profile/${user.id}` : "/"}>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-border/80 text-muted-foreground hover:text-foreground"
              aria-label="Back to profile"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Account Settings
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your personal profile, details and security preferences
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Profile Image Section */}
          <Card className="bg-card/85 border border-border/80 text-foreground rounded-2xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">Profile Avatar</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Upload a recognizable photo or avatar for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload formData={formData} setFormData={setFormData} />
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="bg-card/85 border border-border/80 text-foreground rounded-2xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">Personal Information</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Your name and personal bio displayed to other members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
                <InputField
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </div>

              <InputField
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />

              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs font-medium text-foreground/85">
                  About You (Bio)
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Tell the community about yourself, your projects, or passions..."
                  className="min-h-[100px] resize-none bg-secondary/40 border-border/70 text-foreground placeholder:text-muted-foreground/60 text-sm rounded-xl focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30"
                  maxLength={500}
                />
                <p className="text-[11px] text-muted-foreground text-right font-mono">
                  {formData.bio.length}/500
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-card/85 border border-border/80 text-foreground rounded-2xl shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">Privacy & Visibility</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Control who can view your profile and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Profile Status */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="profile-status" className="text-sm font-semibold text-foreground">
                      Profile Privacy
                    </Label>
                    <Badge
                      variant={formData.isPrivate ? "secondary" : "default"}
                      className="text-[10px] h-5"
                    >
                      {formData.isPrivate ? (
                        <span className="flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Private
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Public
                        </span>
                      )}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.isPrivate
                      ? "Only confirmed connections can see your posts and updates."
                      : "Anyone on SocialHub can explore your posts and profile."}
                  </p>
                </div>
                <Switch
                  id="profile-status"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) =>
                    handleInputChange("isPrivate", checked)
                  }
                />
              </div>

              <Separator className="bg-border/60" />

              {/* Two Factor Authentication */}
              <div className="flex items-center justify-between gap-4 opacity-60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="two-factor" className="text-sm font-semibold text-foreground">
                      Two-Factor Authentication (2FA)
                    </Label>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 text-muted-foreground border-border/80"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Coming Soon
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Additional security via authenticator app will be available soon.
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={false}
                  disabled={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href={user ? `/profile/${user.id}` : "/"}>
              <Button
                variant="outline"
                className="rounded-xl h-10 px-5 text-xs font-semibold border-border/80"
              >
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="rounded-xl h-10 px-6 bg-primary text-primary-foreground font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 text-xs"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
