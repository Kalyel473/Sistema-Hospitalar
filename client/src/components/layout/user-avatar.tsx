import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@shared/schema";

interface UserAvatarProps {
  user: User | null;
  className?: string;
}

export default function UserAvatar({ user, className }: UserAvatarProps) {
  if (!user) return null;
  
  // Create initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={className}>
      <AvatarFallback className="bg-primary/20 text-primary">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}
