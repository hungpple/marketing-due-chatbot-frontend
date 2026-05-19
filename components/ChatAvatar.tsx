import Image from "next/image";

type ChatAvatarRole = "bot" | "user";
type ChatAvatarSize = "sm" | "md" | "lg";

const avatarSources: Record<ChatAvatarRole, string> = {
  bot: "/images/bot_avatar_female_agent.png",
  user: "/images/user_avatar_student.png",
};

const sizeClasses: Record<ChatAvatarSize, string> = {
  sm: "h-10 w-10",
  md: "h-11 w-11",
  lg: "h-12 w-12",
};

const statusClasses: Record<ChatAvatarSize, string> = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
};

const botPaddingClasses: Record<ChatAvatarSize, string> = {
  sm: "p-[3px]",
  md: "p-1",
  lg: "p-1",
};

export function ChatAvatar({
  role,
  size = "md",
  className = "",
}: {
  role: ChatAvatarRole;
  size?: ChatAvatarSize;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={role === "bot" ? "Avatar chatbot" : "Avatar nguoi hoi"}
      className={[
        "relative inline-flex shrink-0 rounded-full border-2 bg-white shadow-sm",
        sizeClasses[size],
        role === "bot"
          ? `border-[#f7cdbb] shadow-[#9f3512]/10 ${botPaddingClasses[size]}`
          : "border-white shadow-[#9f3512]/15",
        className,
      ].join(" ")}
    >
      <span className="relative flex h-full w-full overflow-hidden rounded-full bg-white">
        <Image
          src={avatarSources[role]}
          alt=""
          fill
          sizes="48px"
          className={[
            role === "bot"
              ? "object-contain object-center"
              : "object-cover object-center",
          ].join(" ")}
        />
      </span>
      {role === "bot" ? (
        <span
          className={[
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white bg-emerald-400 dark:border-[#160f0b]",
            statusClasses[size],
          ].join(" ")}
        />
      ) : null}
    </span>
  );
}
